import { createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../services/api";
import { loginStart, loginSuccess, loginFailure } from "./authSlice";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginStart());
      const res = await login(credentials);
      dispatch(
        loginSuccess({
          user: res.data.user,
          accessToken: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        })
      );
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "❌ Sai email hoặc mật khẩu!";
      dispatch(loginFailure(msg));
      return rejectWithValue(msg);
    }
  }
);
