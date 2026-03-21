import "./sing up.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ===== PASSWORD STRENGTH CHECKER =====
function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*]/.test(password)) score++;

  if (score === 0) return { level: 0, label: "", cls: "" };
  if (score === 1) return { level: 1, label: "Weak", cls: "weak" };
  if (score === 2) return { level: 2, label: "Fair", cls: "fair" };
  if (score === 3) return { level: 3, label: "Good", cls: "good" };
  return { level: 4, label: "Strong", cls: "strong" };
}

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();

  const strength = getStrength(password);

  const rules = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "One uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
    { label: "One number (0-9)", met: /[0-9]/.test(password) },
    { label: "One special character (!@#$%^&*)", met: /[!@#$%^&*]/.test(password) },
  ];

  const signup = () => {
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

    const strongPassword = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;
    if (!strongPassword.test(password)) {
      alert("Password must be 8+ characters with 1 uppercase, 1 number & 1 special character.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    let users = JSON.parse(localStorage.getItem("postify_users")) || [];

    const exists = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      alert("This email is already registered. Please log in.");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: normalizedEmail.split("@")[0], // Default name from email
      email: normalizedEmail,
      password,
      plan: "Free",
      credits: 50,
      images: 0,
      status: "Active",
      joined: new Date().toISOString().split("T")[0]
    };
    users.push(newUser);
    localStorage.setItem("postify_users", JSON.stringify(users));

    // Create signup notification for admin
    const signupTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const signupDate = new Date().toISOString().split("T")[0];
    const notifications = JSON.parse(localStorage.getItem("postify_notifications")) || [];
    const newNotif = {
      id: Date.now(),
      type: "signup",
      msg: `New user ${newUser.name} signed up on ${signupDate} at ${signupTime}`,
      time: signupTime,
      read: false
    };
    localStorage.setItem("postify_notifications", JSON.stringify([newNotif, ...notifications]));

    alert("Account created successfully!");
    nav("/login", { state: { email } });
  };

  return (
    <div className="postify-signup-root">

      {/* Background Effects */}
      <div className="postify-grid-bg" />
      <div className="postify-orb postify-orb-1" />
      <div className="postify-orb postify-orb-2" />
      <div className="postify-orb postify-orb-3" />

      <div className="postify-signup-wrapper">

        {/* ===== LEFT SIDE PANEL ===== */}
        <div className="postify-signup-right">

          <div className="postify-signup-badge">
            <div className="postify-signup-badge-dot" />
            <span>Postify</span>
          </div>

          <h1>Start Your<br />Journey.</h1>

          <p>
            Create your free account and get access to
            powerful tools to grow your audience and manage your content.
          </p>

          <div className="postify-features">

            <div className="postify-feature">
              <div className="postify-feature-icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f9a8d4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div className="postify-feature-text">
                <span className="postify-feature-title">Create & Publish Posts</span>
                <span className="postify-feature-desc">Write and share content instantly</span>
              </div>
            </div>

            <div className="postify-feature">
              <div className="postify-feature-icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f9a8d4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="postify-feature-text">
                <span className="postify-feature-title">Track Your Analytics</span>
                <span className="postify-feature-desc">Monitor views, likes and engagement</span>
              </div>
            </div>

            <div className="postify-feature">
              <div className="postify-feature-icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#f9a8d4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="postify-feature-text">
                <span className="postify-feature-title">Grow Your Community</span>
                <span className="postify-feature-desc">Connect with readers and followers</span>
              </div>
            </div>

          </div>
        </div>

        {/* ===== RIGHT SIGNUP CARD ===== */}
        <div className="postify-signup-card">

          <div className="postify-signup-card-header">
            <h2>Create Account</h2>
            <p>Join Postify and start creating today</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); signup(); }}>

            {/* Email Field */}
            <div className="postify-signup-field">
              <label>Email Address</label>
              <div className="postify-signup-input-wrap">
                <svg className="postify-signup-input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Field with Eye Toggle */}
            <div className="postify-signup-field">
              <label>Password</label>
              <div className="postify-signup-input-wrap">
                <svg className="postify-signup-input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="postify-signup-eye-btn"
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

              {/* Strength Bar */}
              {password.length > 0 && (
                <>
                  <div className="postify-strength-bar">
                    {[1, 2, 3, 4].map((seg) => (
                      <div
                        key={seg}
                        className={`postify-strength-segment ${strength.level >= seg ? strength.cls : ""}`}
                      />
                    ))}
                  </div>
                  <div className={`postify-strength-label ${strength.cls}`}>
                    {strength.label} password
                  </div>
                </>
              )}
            </div>

            {/* Password Rules */}
            {password.length > 0 && (
              <div className="postify-rules">
                {rules.map((rule, i) => (
                  <div key={i} className={`postify-rule ${rule.met ? "met" : ""}`}>
                    <div className="postify-rule-dot" />
                    {rule.label}
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <button type="submit" className="postify-signup-btn">
              Create Account →
            </button>

          </form>

          {/* Login Link */}
          <div className="postify-login-link">
            Already have an account?{" "}
            <span onClick={() => nav("/login")}>Sign In</span>
          </div>

        </div>

      </div>
    </div>
  );
}