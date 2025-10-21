import rateLimit from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 phút
  max: 5, // tối đa 5 lần thử đăng nhập trong 1 phút
  message: {
    success: false,
    message: "⚠️ Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 1 phút.",
  },
});