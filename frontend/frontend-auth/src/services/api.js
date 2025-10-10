import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// ========== AUTH ==========
export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);

// ========== PROFILE ==========
export const getProfile = async (token) =>
  API.get("/profile", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProfile = async (token, data) =>
  API.put("/profile", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  });
