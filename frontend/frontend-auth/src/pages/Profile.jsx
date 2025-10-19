import React, { useEffect, useState } from "react";
import { getProfile, updateProfile, uploadAvatar, logoutAPI } from "../services/api";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  // 🧩 Hàm resize ảnh trước khi upload
  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const img = document.createElement("img");
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // ✅ Giữ tỉ lệ khung hình
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              const resized = new File([blob], file.name, { type: file.type });
              resolve(resized);
            },
            file.type,
            0.9 // chất lượng ảnh (0–1)
          );
        };
      };
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        setUser(res.data);
        setForm({ name: res.data.name, email: res.data.email });
      } catch {
        setMessage("❌ Lỗi tải thông tin người dùng! Hãy đăng nhập lại.");
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
    if (!file) return setMessage("⚠️ Vui lòng chọn ảnh!");
    try {
      // 🧠 Resize ảnh xuống 400x400 trước khi gửi lên server
      const resizedFile = await resizeImage(file, 400, 400);
      const formData = new FormData();
      formData.append("avatar", resizedFile);

      await uploadAvatar(formData);
      setMessage("✅ Avatar đã được cập nhật!");
      const refreshed = await getProfile();
      setUser(refreshed.data);
      setPreview("");
    } catch {
      setMessage("❌ Lỗi upload ảnh!");
    }
  };
  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
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
    <div
      className="container"
      style={{
        maxWidth: 420,
        margin: "40px auto",
        padding: 20,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>👤 Hồ sơ cá nhân</h2>

      {user ? (
        <>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <img
              src={preview || user.avatar || "/default-avatar.png"}
              alt="Avatar"
              style={{
                width: 140,
                height: 140,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #ddd",
              }}
            />
          </div>

          <form onSubmit={handleUpload} style={{ marginBottom: 20, textAlign: "center" }}>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {preview && (
              <p style={{ fontSize: 13, color: "#888" }}>Ảnh sẽ được resize về 400x400px</p>
            )}
            <button
              type="submit"
              style={{
                marginTop: 10,
                background: "#1976d2",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              📤 Tải lên Avatar
            </button>
          </form>

          <form onSubmit={handleUpdate}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Tên"
                required
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
              />
              <input
                name="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                required
                style={{
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                marginTop: 15,
background: "#4caf50",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              💾 Cập nhật
            </button>
          </form>

          <button
            onClick={handleLogout}
            style={{
              marginTop: 20,
              width: "100%",
              background: "tomato",
              color: "white",
              padding: "8px 16px",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            🚪 Đăng xuất
          </button>

          {message && (
            <p style={{ marginTop: 15, textAlign: "center", color: "#333" }}>{message}</p>
          )}
        </>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
}