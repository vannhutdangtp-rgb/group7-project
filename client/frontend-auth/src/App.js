import React from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store"; // ✅ đúng cú pháp (vì store được export bằng { store })

// 📄 Các trang
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="app-root">
          {/* ==== HEADER ==== */}
          <header className="topbar">
            <div className="container">
              <h1 className="brand">🚗 Quản lý người dùng</h1>
              <nav className="navlinks">
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    isActive ? "navlink active" : "navlink"
                  }
                >
                  Đăng ký
                </NavLink>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "navlink active" : "navlink"
                  }
                >
                  Đăng nhập
                </NavLink>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? "navlink active" : "navlink"
                  }
                >
                  Hồ sơ cá nhân
                </NavLink>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    isActive ? "navlink active" : "navlink"
                  }
                >
                  Quản trị
                </NavLink>
              </nav>
            </div>
          </header>

          {/* ==== MAIN ==== */}
          <main className="main-container">
            <div className="card">
              <Routes>
                {/* 🔓 Route public */}
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />

                {/* 🔒 Route private */}
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </div>
          </main>

          {/* ==== FOOTER ==== */}
          <footer className="footer">
            © 2025 - Hệ thống quản lý người dùng (Demo)
          </footer>
        </div>
      </BrowserRouter>
    </Provider>
  );
}
