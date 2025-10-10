import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      return res.status(401).json({ message: "Token không hợp lệ!" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Không có token!" });
  }
};

// Kiểm tra quyền role
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") next();
  else return res.status(403).json({ message: "Chỉ admin được phép!" });
};
