import React, { useState } from "react";
import { uploadAvatar } from "../services/api";

const UploadAvatar = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [url, setUrl] = useState("");

  const handleSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("⚠️ Bạn chưa đăng nhập!");
    if (!file) return alert("Vui lòng chọn ảnh!");

    try {
      const data = await uploadAvatar(token, file);
      setUrl(data.avatarUrl);
      alert("✅ Upload thành công!");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi upload: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>🖼️ Upload Avatar</h2>
      <input type="file" onChange={handleSelect} />
      {preview && (
        <div>
          <p>Ảnh xem trước:</p>
          <img
            src={preview}
            alt="Preview"
            style={{ width: 150, borderRadius: "50%" }}
          />
        </div>
      )}
      <button onClick={handleUpload}>Upload</button>
      {url && (
        <div>
          <p>Ảnh Cloudinary:</p>
          <img
            src={url}
            alt="Uploaded"
            style={{ width: 150, borderRadius: "50%", marginTop: 10 }}
          />
        </div>
      )}
    </div>
  );
};

export default UploadAvatar;
