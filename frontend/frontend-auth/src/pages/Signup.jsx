import React, { useState } from "react";
import { signup } from "../services/api";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="card" style={{ maxWidth: 400, margin: "auto" }}>
      <h2 className="center" style={{ marginBottom: 24 }}>Đăng ký tài khoản</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            className="input"
            name="name"
            placeholder="Tên"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Mật khẩu"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <input
            className="input"
            type="password"
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <select
            className="input"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị viên</option>
            <option value="editor">Biên tập viên</option>
          </select>
        </div>

        <button type="submit" className="btn" style={{ width: "100%" }}>
          Đăng ký
        </button>
      </form>
      {message && (
        <p
          style={{
            marginTop: 20,
            fontWeight: "600",
            color: message.includes("❌") ? "#ef4444" : "#2563eb",
            textAlign: "center",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
