import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);