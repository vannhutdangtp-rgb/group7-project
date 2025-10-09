import React, { useState } from "react";
import { login } from "../services/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      setMessage(res.data.message || "Đăng nhập thành công!");
      setToken(res.data.token);
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi đăng nhập!");
    }
  };

  return (
    <div className="container">
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Đăng nhập</button>
      </form>
      <p>{message}</p>

      {token && (
        <div style={{ marginTop: "10px", wordBreak: "break-all" }}>
          <strong>JWT Token:</strong>
          <p>{token}</p>
        </div>
      )}
    </div>
  );
}
