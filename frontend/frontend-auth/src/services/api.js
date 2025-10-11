import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// ========== AUTH ==========
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);
export const forgotPassword = (data) => API.post("/profile/forgot-password", data);
export const resetPassword = (token, data) => API.post(`/profile/reset-password/${token}`, data);


// ========== PROFILE ==========
export const getProfile = (token) =>
  API.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProfile = (token, data) =>
  API.put("/profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const uploadAvatar = (token, formData) =>
  API.put("/profile/upload-avatar", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

// ========== ADMIN ==========
export const getUsers = (token) =>
  API.get("/users", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteUser = (token, id) =>
  API.delete(`/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
