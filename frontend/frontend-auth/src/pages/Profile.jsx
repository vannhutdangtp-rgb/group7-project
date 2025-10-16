import React, { useEffect, useState } from "react";
import { getProfile, updateProfile, uploadAvatar, logoutAPI } from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email });
      } catch {
        setMessage("❌ Lỗi tải thông tin người dùng!");
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile(form);
      setMessage(res.data.message || "✅ Cập nhật thành công!");
      const refreshed = await getProfile();
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
      await uploadAvatar(formData);
      setMessage("✅ Avatar đã được cập nhật!");
      const refreshed = await getProfile();
      setUser(refreshed.data);
    } catch {
      setMessage("❌ Lỗi upload ảnh!");
    }
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await logoutAPI(refreshToken);
    } finally {
      localStorage.clear();
      window.location.href = "/login";
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400, margin: "auto" }}>
      <h2>Thông tin cá nhân</h2>
      {user ? (
        <>
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

          <form onSubmit={handleUpload} style={{ marginBottom: 20 }}>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
            <button type="submit">Tải lên Avatar</button>
          </form>

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

          <button
            onClick={handleLogout}
            style={{ marginTop: 15, background: "tomato", color: "white" }}
          >
            Đăng xuất
          </button>

          {message && <p style={{ marginTop: 10 }}>{message}</p>}
        </>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
}