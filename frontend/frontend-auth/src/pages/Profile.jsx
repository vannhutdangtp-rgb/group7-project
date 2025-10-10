import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null); // Dữ liệu gốc
  const [form, setForm] = useState({ name: "", email: "" }); // Dữ liệu nhập sửa
  const [message, setMessage] = useState("");
  const [updatedUser, setUpdatedUser] = useState(null); // Dữ liệu sau cập nhật

  const token = localStorage.getItem("token");

  // 🟩 Lấy thông tin ban đầu
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile(token);
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email });
      } catch (err) {
        setMessage("Lỗi tải thông tin người dùng!");
      }
    };
    fetchProfile();
  }, [token]);

  // 🟩 Cập nhật thông tin
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(token, form);
      setMessage(res.data.message || "✅ Cập nhật thành công!");

      // Gọi lại API để lấy thông tin mới nhất
      const refreshed = await getProfile(token);
      setUpdatedUser(refreshed.data);
    } catch (err) {
      setMessage("❌ Lỗi cập nhật!");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Thông tin cá nhân</h2>

      {user ? (
        <>
          {/* 🧩 Thông tin hiện tại */}
          <div style={{ marginBottom: "20px" }}>
            <h4>Trước khi cập nhật:</h4>
            <p><strong>Tên:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>

          {/* 🧩 Form cập nhật */}
          <form onSubmit={handleUpdate}>
            <input
              name="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Tên"
              required
            />
            <input
              name="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              required
            />
            <button type="submit">Cập nhật</button>
          </form>

          {/* 🧩 Thông báo */}
          {message && <p style={{ marginTop: 10 }}>{message}</p>}

          {/* 🧩 Hiển thị thông tin sau cập nhật */}
          {updatedUser && (
            <div style={{ marginTop: "20px" }}>
              <h4>Sau khi cập nhật:</h4>
              <p><strong>Tên:</strong> {updatedUser.name}</p>
              <p><strong>Email:</strong> {updatedUser.email}</p>
            </div>
          )}
        </>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
}