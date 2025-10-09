import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const router = express.Router();

// ========== POST /signup ==========
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
      // Kiểm tra email trùng
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "Email đã tồn tại!" });

      // Kiểm tra role hợp lệ
      const validRoles = ["admin", "editor", "user"];
      const assignedRole = validRoles.includes(role) ? role : "user";

      // Mã hóa mật khẩu
      const hashedPassword = await bcrypt.hash(password, 10);

      // Tạo user mới
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

// ========== POST /login ==========
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Tìm user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email không tồn tại" });

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Sai mật khẩu" });

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ========== POST /logout ==========
router.post("/logout", (req, res) => {
  // Không cần xử lý token ở backend (JWT lưu client)
  res.json({ message: "Đăng xuất thành công (xóa token ở client)" });
});

export default router;
