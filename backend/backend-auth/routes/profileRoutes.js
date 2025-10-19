import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import sharp from "sharp";
import streamifier from "streamifier";

const router = express.Router();

/* ===================================================
   🧩 1️⃣ LẤY THÔNG TIN PROFILE
=================================================== */
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    res.json(user);
  } catch (err) {
    console.error("❌ Lỗi GET /profile:", err);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

/* ===================================================
   🧩 2️⃣ CẬP NHẬT THÔNG TIN PROFILE
=================================================== */
router.put("/", protect, async (req, res) => {
  try {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    ).select("-password");

    res.json({ message: "Cập nhật thành công!", user: updatedUser });
  } catch (err) {
    console.error("❌ Lỗi PUT /profile:", err);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

/* ===================================================
   🧩 3️⃣ QUÊN MẬT KHẨU (TẠO TOKEN)
=================================================== */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Không tìm thấy email này!" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 phút

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = resetTokenExpire;
    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    console.log("🔗 Link reset mật khẩu:", resetUrl);

    res.json({
      message: "Tạo token đặt lại mật khẩu thành công!",
      resetUrl,
      token: resetToken,
    });
  } catch (err) {
    console.error("❌ Lỗi forgot-password:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* ===================================================
   🧩 4️⃣ ĐẶT LẠI MẬT KHẨU
=================================================== */
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn!" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (err) {
    console.error("❌ Lỗi reset-password:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* ===================================================
   🧩 5️⃣ CẤU HÌNH CLOUDINARY
=================================================== */
console.log("✅ CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ===================================================
   🧩 6️⃣ CẤU HÌNH MULTER STORAGE (UPLOAD ẢNH LÊN CLOUDINARY)
=================================================== */
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // tối đa 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Chỉ chấp nhận file ảnh!"), false);
    }
    cb(null, true);
  },
});

/* ===================================================
   🧩 7️⃣ UPLOAD & RESIZE AVATAR RỒI ĐẨY LÊN CLOUDINARY
=================================================== */
router.put("/upload-avatar", protect, upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Chưa có file để upload!" });
    }

    // Resize ảnh bằng Sharp (300x300, chất lượng 90%)
    const resizedBuffer = await sharp(req.file.buffer)
      .resize(300, 300)
      .jpeg({ quality: 90 })
      .toBuffer();

    // Upload stream lên Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "avatars", resource_type: "image" },
      async (error, result) => {
        if (error) {
          console.error("❌ Lỗi upload Cloudinary:", error);
          return res.status(500).json({ message: "Lỗi upload Cloudinary", error });
        }

        const avatarUrl = result.secure_url;

        // Cập nhật user
        const user = await User.findByIdAndUpdate(
          req.user._id,
          { avatar: avatarUrl },
          { new: true }
        ).select("-password");

        res.json({
          message: "Upload & resize avatar thành công!",
          avatarUrl,
          user,
        });
      }
    );

    streamifier.createReadStream(resizedBuffer).pipe(uploadStream);
  } catch (err) {
    console.error("❌ Upload avatar error:", err);
    res.status(500).json({ message: "Lỗi server khi upload avatar", error: err.message });
  }
});

export default router;
