import React, { useState } from "react";
import { login } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("role", res.data.user.role);

      setMessage("✅ Đăng nhập thành công!");
      const role = res.data.user.role;

      if (role === "admin") navigate("/admin");
      else navigate("/profile");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Sai email hoặc mật khẩu!");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, margin: "auto" }}>
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

      <p style={{ marginTop: "10px" }}>
        <button
          type="button"
          onClick={() => navigate("/forgot-password")}
          style={{
            background: "none",
            border: "none",
            color: "blue",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          Quên mật khẩu?
        </button>
      </p>

      {message && <p>{message}</p>}
    </div>
  );
}