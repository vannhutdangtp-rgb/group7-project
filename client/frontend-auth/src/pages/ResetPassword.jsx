import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/api"; // import từ api.js

const ResetPassword = () => {
  const { token } = useParams(); // Lấy token từ URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      setMessage("❌ Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      const { data } = await resetPassword({ token, password });
      setMessage("✅ Đặt lại mật khẩu thành công!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Lỗi reset password:", err);
      setMessage("❌ Token không hợp lệ hoặc đã hết hạn!");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>🔐 Đặt lại mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nhập mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ margin: "5px", padding: "5px" }}
        />
        <br />
        <input
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          style={{ margin: "5px", padding: "5px" }}
        />
        <br />
        <button type="submit" style={{ marginTop: "10px" }}>
          Đặt lại mật khẩu
        </button>
      </form>

      {message && <p style={{ color: "red", marginTop: "10px" }}>{message}</p>}
    </div>
  );
};

export default ResetPassword;
