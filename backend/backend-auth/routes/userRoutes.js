import express from "express";
import User from "../models/User.js";
import { protect, adminOnly, editorOrAdmin } from "../middleware/authMiddleware.js";
import Log from "../models/Log.js";

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
// 📜 API xem log hoạt động (chỉ admin)
router.get("/logs", protect, adminOnly, async (req, res) => {
  try {
    const logs = await Log.find()
      .populate("userId", "name email")
      .sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi lấy logs" });
  }
});

export default router;