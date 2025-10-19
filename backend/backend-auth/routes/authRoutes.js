import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import Role from "../models/role.js"; // ✅ thêm import Role
import crypto from "crypto";
import transporter from "../config/email.js"; // bạn tạo file email.js theo hướng dẫn trước

const router = express.Router();

/* =======================
   POST /signup
======================= */
router.post(
  "/signup",
  [
    body("name").notEmpty().withMessage("Tên không được để trống"),
    body("email").isEmail().withMessage("Email không hợp lệ"),
    body("password").isLength({ min: 6 }).withMessage("Mật khẩu tối thiểu 6 ký tự"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, role } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "Email đã tồn tại!" });

      // ✅ Lấy role theo name, nếu không có thì mặc định "user"
      const assignedRole =
        (await Role.findOne({ name: role })) || (await Role.findOne({ name: "user" }));

      if (!assignedRole)
        return res.status(400).json({ message: "Không tìm thấy vai trò phù hợp!" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: assignedRole._id, // ✅ dùng ObjectId thay vì chuỗi
      });

      await newUser.save();
      res.status(201).json({ message: `Đăng ký thành công với vai trò: ${assignedRole.name}` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server" });
    }
  }
);

/* =======================
   POST /login
======================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate("role", "name"); // ✅ populate role
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    // ====== Access Token (30s demo) ======
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role.name }, // ✅ role.name
      process.env.ACCESS_TOKEN_SECRET || "access_secret_key",
      { expiresIn: "30s" }
    );

    // ====== Refresh Token (7 ngày) ======
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role.name },
      process.env.REFRESH_TOKEN_SECRET || "refresh_secret_key",
      { expiresIn: "7d" }
    );

    // ====== Lưu Refresh Token vào DB ======
    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    res.json({
      message: "Đăng nhập thành công!",
      accessToken,
      refreshToken,
      user: {
        name: user.name,
        email: user.email,
        role: user.role.name, // ✅ trả về tên role
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* =======================
   POST /refresh
======================= */
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(400).json({ message: "Thiếu refresh token" });

  try {
    const storedToken = await RefreshToken.findOne({ token: refreshToken, revoked: false });
    if (!storedToken)
      return res.status(403).json({ message: "Refresh token không hợp lệ hoặc đã bị thu hồi" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "refresh_secret_key",
      async (err, user) => {
        if (err)
          return res.status(403).json({ message: "Refresh token hết hạn hoặc sai" });

        const newAccessToken = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.ACCESS_TOKEN_SECRET || "access_secret_key",
          { expiresIn: "15m" }
        );

        res.json({
          message: "Tạo access token mới thành công!",
          accessToken: newAccessToken,
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

/* =======================
   POST /logout
======================= */
router.post("/logout", async (req, res) => {
  const { refreshToken } = req.body;
  try {
    if (refreshToken) {
      await RefreshToken.findOneAndUpdate(
        { token: refreshToken },
        { revoked: true }
      );
    }
    res.json({ message: "Đăng xuất thành công! (Refresh token đã thu hồi)" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});
/* =======================
   🧩 QUÊN MẬT KHẨU - FORGOT PASSWORD
======================= */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Không tìm thấy email!" });

    // Sinh token reset
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken; // ✅ Lưu token dạng hash
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 phút
    await user.save();

    // Gửi link có token gốc
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Đặt lại mật khẩu của bạn",
      html: `
        <h3>Xin chào ${user.name},</h3>
        <p>Bạn vừa yêu cầu đặt lại mật khẩu.</p>
        <p>Nhấn vào link bên dưới để tiếp tục:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Liên kết có hiệu lực trong 10 phút.</p>
      `,
    });

    res.json({ message: "Email đặt lại mật khẩu đã được gửi!" });
  } catch (err) {
    console.error("❌ Lỗi forgot-password:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});
/* =======================
   POST /reset-password
======================= */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Mật khẩu đã được đặt lại thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
