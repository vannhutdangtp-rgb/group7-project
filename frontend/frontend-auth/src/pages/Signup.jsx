import React, { useState } from "react";
import { signup } from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [confirmPassword, setConfirmPassword] = useState(""); // 🔹 Thêm dòng này
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 Kiểm tra mật khẩu khớp
    if (form.password !== confirmPassword) {
      setMessage("❌ Mật khẩu nhập lại không khớp!");
      return;
    }

    try {
      const res = await signup(form);
      setMessage(res.data.message || "Đăng ký thành công!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi đăng ký!");
    }
  };

  return (
    <div className="container">
      <h2>Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Tên"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
          required
        />

        {/* 🔹 Thêm phần nhập lại mật khẩu */}
        <input
          type="password"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="user">Người dùng</option>
          <option value="admin">Quản trị viên</option>
          <option value="editor">Biên tập viên</option>
        </select>

        <button type="submit">Đăng ký</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
