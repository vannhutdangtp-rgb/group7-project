import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ✅ Middleware xác thực người dùng
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET || "access_secret_key"
      );

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user)
        return res.status(404).json({ message: "Không tìm thấy người dùng!" });

      next();
    } catch (error) {
      console.error("❌ Token error:", error);
      return res
        .status(401)
        .json({ message: "Token không hợp lệ hoặc hết hạn!" });
    }
  } else {
    return res.status(401).json({ message: "Không có token xác thực!" });
  }
};

// ✅ Middleware chỉ cho phép Admin
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Chỉ admin được phép!" });
  }
};
