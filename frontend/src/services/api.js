import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000", // bỏ /api đi
});

// Lấy danh sách user
export const getUsers = () => API.get("/users");

// Thêm user
export const addUser = (user) => API.post("/users", user);
