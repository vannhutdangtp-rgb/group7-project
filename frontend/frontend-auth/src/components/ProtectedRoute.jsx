import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute({ children, requiredRole }) {
  const { accessToken, role } = useSelector((state) => state.auth);
  const location = useLocation();

  // Nếu chưa đăng nhập → chuyển về /login
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu có yêu cầu role cụ thể (vd: admin) mà user không đủ quyền
  if (requiredRole && role !== requiredRole) {
    // Nếu là admin page mà user thường truy cập → chuyển về /profile
    return <Navigate to="/profile" replace />;
  }

  // Hợp lệ → render trang con
  return children;
}
