import React, { useEffect, useState } from "react";
import { getProfile, updateProfile, uploadAvatar } from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile(token);
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email });
      } catch {
        setMessage("Lỗi tải thông tin người dùng!");
      }
    };
    fetchProfile();
  }, [token]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(token, form);
      setMessage(res.data.message || "✅ Cập nhật thành công!");
      const refreshed = await getProfile(token);
      setUser(refreshed.data);
    } catch {
      setMessage("❌ Lỗi cập nhật!");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Vui lòng chọn ảnh!");
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      await uploadAvatar(token, formData);
      setMessage("✅ Avatar đã được cập nhật!");
      const refreshed = await getProfile(token);
      setUser(refreshed.data);
    } catch {
      setMessage("❌ Lỗi upload ảnh!");
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Thông tin cá nhân</h2>

      {user ? (
        <>
          {/* 🖼️ Avatar */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <img
              src={user.avatar || "/default-avatar.png"}
              alt="Avatar"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ccc",
               }}
            />

          </div>

          {/* Upload avatar */}
          <form onSubmit={handleUpload} style={{ marginBottom: 20 }}>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
            <button type="submit">Tải lên Avatar</button>
          </form>

          {/* Form cập nhật */}
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

          {message && <p style={{ marginTop: 10 }}>{message}</p>}
        </>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
}
