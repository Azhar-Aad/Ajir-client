import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import bgImage from "../images/pattern.png";

// 🌍 Render backend
const BASE_URL = "https://ajir-server-v972.onrender.com";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUser] = useState("");
  const [password, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/admin-login`, {
        username,
        password,
      });

      if (res.status === 200) {
        navigate("/admin/add-product");
      }
    } catch (err) {
      alert(
        err.response?.data?.message || "Server error. Try again."
      );
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="login-content">
          <h2 className="login-title">Admin Login</h2>
          <p className="login-subtitle">
            Only authorized users can access the admin panel
          </p>

          <form
            className="login-form"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Username */}
            <label>Username</label>
            <input
              type="text"
              placeholder="username"
              value={username}
              onChange={(e) => setUser(e.target.value)}
            />

            {/* Password */}
            <label>Password</label>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPass(e.target.value)}
            />

            {/* Login Button */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE IMAGE */}
      <div
        className="login-right"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
    </div>
  );
}
