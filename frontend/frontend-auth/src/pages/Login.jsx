import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "../redux/authThunks";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginThunk(form));

    if (result.meta.requestStatus === "fulfilled") {
      const role = result.payload.user.role;
      navigate(role === "admin" ? "/admin" : "/profile");
    }
  };

  return (
    <div
      className="container"
      style={{
        maxWidth: 400,
        margin: "auto",
        marginTop: "80px",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        textAlign: "center",
      }}
    >
      <h2>🔐 Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            background: loading ? "#aaa" : "#007bff",
            color: "white",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
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

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
