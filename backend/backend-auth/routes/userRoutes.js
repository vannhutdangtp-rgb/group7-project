import express from "express";
import User from "../models/User.js";
import { protect, adminOnly, editorOrAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// 📌 Lấy danh sách user (Admin hoặc Editor)
router.get("/", protect, editorOrAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("role", "name"); // ✅ hiển thị tên role

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// 📌 Xóa user (Admin hoặc chính user đó)
router.delete("/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("role", "name");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    // ✅ vì role là object => dùng role.name
    if (req.user.role?.name === "admin" || req.user._id.toString() === user._id.toString()) {
      await user.deleteOne();
      res.json({ message: "Đã xóa tài khoản!" });
    } else {
      res.status(403).json({ message: "Bạn không có quyền xóa tài khoản này!" });
    }
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
