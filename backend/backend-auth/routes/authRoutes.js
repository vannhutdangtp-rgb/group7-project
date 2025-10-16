import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";

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

      const validRoles = ["admin", "editor", "user"];
      const assignedRole = validRoles.includes(role) ? role : "user";

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: assignedRole,
      });

      await newUser.save();
      res.status(201).json({ message: `Đăng ký thành công với vai trò: ${assignedRole}` });
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
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    // ====== Tạo Access Token (ngắn hạn) ======
    const accessToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.ACCESS_TOKEN_SECRET || "access_secret_key",
      { expiresIn: "15m" }
    );

    // ====== Tạo Refresh Token (dài hạn) ======
    const refreshToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.REFRESH_TOKEN_SECRET || "refresh_secret_key",
      { expiresIn: "7d" }
    );

    // ====== Lưu Refresh Token vào DB ======
    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 ngày
    });

    res.json({
      message: "Đăng nhập thành công!",
      accessToken,
      refreshToken,
      user: { name: user.name, email: user.email, role: user.role },
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
    // Kiểm tra token trong DB
    const storedToken = await RefreshToken.findOne({
      token: refreshToken,
      revoked: false,
    });
    if (!storedToken)
      return res.status(403).json({ message: "Refresh token không hợp lệ hoặc đã bị thu hồi" });

    // Xác thực token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET || "refresh_secret_key",
      async (err, user) => {
        if (err)
          return res.status(403).json({ message: "Refresh token hết hạn hoặc sai" });

        // Tạo access token mới
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

export default router;
