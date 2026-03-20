import "./Login.css";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login({ setIsAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const location = useLocation();
  const nav = useNavigate();

  // ===== LOAD SAVED CREDENTIALS OR PASSED EMAIL =====
  useEffect(() => {
    // 1. If we came from Signup or Reset Password with an email
    if (location.state?.email) {
      setEmail(location.state.email);
      return;
    }

    // 2. Otherwise fall back to Remembered Email
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    const savedRemember = localStorage.getItem("rememberMe");

    if (savedRemember === "true" && savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, [location.state]);

  const login = () => {
    if (!email && !password) {
      alert("Please enter both email and password.");
      return;
    }
    if (!email) {
      alert("Please enter your email.");
      return;
    }
    if (!password) {
      alert("Please enter your password.");
      return;
    }

    const adminEmail = "admin@postify.com";
    const adminPassword = "123456";

    // ===== SAVE OR CLEAR REMEMBER ME =====
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedPassword", password);
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
      localStorage.removeItem("rememberMe");
    }

    // ===== ADMIN TAB =====
    if (role === "admin") {
      if (email === adminEmail && password === adminPassword) {
        localStorage.setItem("isAuth", "true");
        localStorage.setItem("role", "admin");
        setIsAuth(true);
        alert("Admin login successful!");
        nav("/dashboard");
      } else {
        alert("Invalid admin credentials.");
      }
      return;
    }

    // ===== USER TAB =====
    if (role === "user") {
      if (email === adminEmail) {
        alert("Please use the Admin tab to login as admin.");
        return;
      }

      const users = JSON.parse(localStorage.getItem("postify_users")) || [];
      const userExists = users.find((u) => u.email === email);

      if (!userExists) {
        alert("Account not found. Please sign up.");
        return;
      }

      if (userExists.password !== password) {
        alert("Incorrect password. Please try again.");
        return;
      }

      // Successful login
      localStorage.setItem("isAuth", "true");
      localStorage.setItem("role", "user");
      localStorage.setItem("currentUser", JSON.stringify(userExists));
      setIsAuth(true);
      alert("Login successful!");
      nav("/user-dashboard");
    }
  };

  return (
    <div className="postify-login-root">

      {/* Background Effects */}
      <div className="postify-grid-bg" />
      <div className="postify-orb postify-orb-1" />
      <div className="postify-orb postify-orb-2" />
      <div className="postify-orb postify-orb-3" />

      <div className="postify-wrapper">

        {/* Left Side Panel */}
        <div className="postify-left">
          <div className="postify-badge">
            <div className="postify-badge-dot" />
            <span>Postify</span>
          </div>

          <h1>Welcome<br />Back.</h1>

          <p>
            Manage your posts, view analytics, and connect
            with your community all in one place.
          </p>

          <div className="postify-stats">
            <div className="postify-stat">
              <span className="postify-stat-num">2.4K</span>
              <span className="postify-stat-label">Active Users</span>
            </div>
            <div className="postify-divider-v" />
            <div className="postify-stat">
              <span className="postify-stat-num">18K</span>
              <span className="postify-stat-label">Posts Live</span>
            </div>
            <div className="postify-divider-v" />
            <div className="postify-stat">
              <span className="postify-stat-num">99.9%</span>
              <span className="postify-stat-label">Uptime</span>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="postify-card">

          <div className="postify-card-header">
            <h2>Sign In</h2>
            <p>Access your Postify account</p>
          </div>

          {/* Role Tabs */}
          <div className="postify-tab-row">
            <button
              className={`postify-tab ${role === "user" ? "active" : ""}`}
              onClick={() => {
                setRole("user");
                setEmail("");
                setPassword("");
              }}
            >
              User
            </button>
            <button
              className={`postify-tab ${role === "admin" ? "active" : ""}`}
              onClick={() => {
                setRole("admin");
                setEmail("");
                setPassword("");
              }}
            >
              Admin
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); login(); }}>

            {/* Email Field */}
            <div className="postify-field">
              <label>Email Address</label>
              <div className="postify-input-wrap">
                <svg className="postify-input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  type="email"
                  placeholder={role === "admin" ? "admin@postify.com" : "Enter your email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="postify-field">
              <label>Password</label>
              <div className="postify-input-wrap">
                <svg className="postify-input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="postify-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="postify-field-row">
              <label className="postify-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="postify-forgot"
                onClick={() => nav("/forgot")}
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button type="submit" className="postify-login-btn">
              Sign In →
            </button>

          </form>

          {/* Sign Up Link */}
          <div className="postify-signup-link">
            Don't have an account?{" "}
            <span onClick={() => nav("/signup")}>Sign Up</span>
          </div>

        </div>
      </div>
    </div>
  );
}