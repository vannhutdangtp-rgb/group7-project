import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// 🧠 Gắn access token vào header trước mỗi request
API.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 🔁 Tự động refresh token khi accessToken hết hạn
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/auth/refresh`,
          { refreshToken }
        );

        localStorage.setItem("accessToken", data.accessToken);
        API.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;

        return API(originalRequest);
      } catch (refreshErr) {
        console.error("❌ Refresh token thất bại:", refreshErr);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// ========== AUTH ==========
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);
export const refreshTokenAPI = (refreshToken) => API.post("/auth/refresh", { refreshToken });
export const logoutAPI = (refreshToken) => API.post("/auth/logout", { refreshToken });

// ✅ Hoạt động 2: quên mật khẩu / đặt lại mật khẩu chuyển về /auth/
export const forgotPassword = (data) => API.post("/profile/forgot-password", data);
export const resetPassword = (token, data) => API.post(`/profile/reset-password/${token}`, data);

// ========== PROFILE ==========
export const getProfile = () => API.get("/profile");
export const updateProfile = (data) => API.put("/profile", data);
export const uploadAvatar = (formData) =>
  API.put("/profile/upload-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// ========== ADMIN ==========
export const getUsers = () => API.get("/users");
export const deleteUser = (id) => API.delete(`/users/${id}`);

export default API;