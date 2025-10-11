import React, { useState } from "react";
import { forgotPassword } from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email });
      setMessage(res.data.message || "Token reset đã được gửi qua email!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Lỗi khi gửi yêu cầu!");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Quên mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Gửi token reset</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
