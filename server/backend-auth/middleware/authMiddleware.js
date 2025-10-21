import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* =========================================
   ✅ Middleware xác thực người dùng
========================================= */
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // ✅ Giải mã token để lấy id
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET || "access_secret_key"
      );

      // ✅ Lấy user + populate role để có role.name và quyền
      req.user = await User.findById(decoded.id)
        .select("-password")
        .populate("role", "name permissions");

      if (!req.user)
        return res.status(404).json({ message: "Không tìm thấy người dùng!" });

      next();
    } catch (error) {
      console.error("❌ Token error:", error);
      return res.status(401).json({ message: "Token không hợp lệ hoặc hết hạn!" });
    }
  } else {
    return res.status(401).json({ message: "Không có token xác thực!" });
  }
};

/* =========================================
   ✅ Chỉ cho phép Admin
========================================= */
export const adminOnly = (req, res, next) => {
  if (req.user?.role?.name === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Chỉ Admin được phép truy cập!" });
  }
};

/* =========================================
   ✅ Cho phép Editor hoặc Admin
========================================= */
export const editorOrAdmin = (req, res, next) => {
  const roleName = req.user?.role?.name;
  if (roleName === "editor" || roleName === "admin") {
    next();
  } else {
    return res.status(403).json({
      message: "Chỉ Editor hoặc Admin được phép truy cập!",
    });
  }
};

/* =========================================
   ✅ Middleware kiểm tra vai trò tùy chỉnh
========================================= */
export const checkRole = (...roles) => {
  return (req, res, next) => {
    const roleName = req.user?.role?.name;
    if (roles.includes(roleName)) {
      next();
    } else {
      return res.status(403).json({
        message: `Yêu cầu quyền truy cập: ${roles.join(", ")}`,
      });
    }
  };
};
