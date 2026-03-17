import "./reset.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function getStrength(password) {
  let score = 0;
  if (password.length >= 8)        score++;
  if (/[A-Z]/.test(password))      score++;
  if (/[0-9]/.test(password))      score++;
  if (/[!@#$%^&*]/.test(password)) score++;

  if (score === 0) return { level: 0, label: "",       cls: "" };
  if (score === 1) return { level: 1, label: "Weak",   cls: "weak" };
  if (score === 2) return { level: 2, label: "Fair",   cls: "fair" };
  if (score === 3) return { level: 3, label: "Good",   cls: "good" };
  return             { level: 4, label: "Strong", cls: "strong" };
}

export default function Reset() {
  const [pass, setPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const nav = useNavigate();

  const strength = getStrength(pass);

  const rules = [
    { label: "At least 8 characters",             met: pass.length >= 8 },
    { label: "One uppercase letter (A-Z)",         met: /[A-Z]/.test(pass) },
    { label: "One number (0-9)",                   met: /[0-9]/.test(pass) },
    { label: "One special character (!@#$%^&*)",   met: /[!@#$%^&*]/.test(pass) },
  ];

  const reset = () => {
    if (!pass) {
      alert("Please enter a new password.");
      return;
    }

    const strongPassword = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

    if (!strongPassword.test(pass)) {
      alert("Password must be 8+ characters with 1 uppercase, 1 number & 1 special character.");
      return;
    }

    const email = localStorage.getItem("recoverEmail");

    // Update password in users array
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const updated = users.map((u) =>
      u.email === email ? { ...u, password: pass } : u
    );
    localStorage.setItem("users", JSON.stringify(updated));

    // Cleanup OTP keys
    localStorage.removeItem("otp");
    localStorage.removeItem("recoverEmail");

    alert("Password updated successfully!");
    nav("/login");
  };

  return (
    <div className="reset-root">

      {/* Background Effects */}
      <div className="reset-grid-bg" />
      <div className="reset-orb reset-orb-1" />
      <div className="reset-orb reset-orb-2" />
      <div className="reset-orb reset-orb-3" />

      <div className="reset-wrapper">

        {/* Left Side */}
        <div className="reset-left">
          <div className="reset-badge">
            <div className="reset-badge-dot" />
            <span>Postify</span>
          </div>

          <h1>Create New<br />Password.</h1>

          <p>
            Choose a strong password to keep your
            account safe and secure.
          </p>

          <div className="reset-tips">

            <div className="reset-tip">
              <div className="reset-tip-icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="reset-tip-text">
                <span className="reset-tip-title">Use a unique password</span>
                <span className="reset-tip-desc">Do not reuse old passwords</span>
              </div>
            </div>

            <div className="reset-tip">
              <div className="reset-tip-icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="reset-tip-text">
                <span className="reset-tip-title">Mix characters</span>
                <span className="reset-tip-desc">Letters, numbers and symbols</span>
              </div>
            </div>

            <div className="reset-tip">
              <div className="reset-tip-icon">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="reset-tip-text">
                <span className="reset-tip-title">Never share it</span>
                <span className="reset-tip-desc">Keep your password private</span>
              </div>
            </div>

          </div>
        </div>

        {/* Reset Card */}
        <div className="reset-card">

          <div className="reset-card-header">
            <div className="reset-icon-wrap">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2>Reset Password</h2>
            <p>Set a new secure password for your account</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); reset(); }}>

            {/* Password Field with Eye Toggle */}
            <div className="reset-field">
              <label>New Password</label>
              <div className="reset-input-wrap">
                <svg className="reset-input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={pass}
                  required
                  onChange={(e) => setPass(e.target.value)}
                />
                <button
                  type="button"
                  className="reset-eye-btn"
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Strength Bar */}
              {pass.length > 0 && (
                <>
                  <div className="reset-strength-bar">
                    {[1, 2, 3, 4].map((seg) => (
                      <div
                        key={seg}
                        className={`reset-strength-seg ${strength.level >= seg ? strength.cls : ""}`}
                      />
                    ))}
                  </div>
                  <div className={`reset-strength-label ${strength.cls}`}>
                    {strength.label} password
                  </div>
                </>
              )}
            </div>

            {/* Rules Checklist */}
            {pass.length > 0 && (
              <div className="reset-rules">
                {rules.map((rule, i) => (
                  <div key={i} className={`reset-rule ${rule.met ? "met" : ""}`}>
                    <div className="reset-rule-dot" />
                    {rule.label}
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className="reset-btn">
              Reset Password →
            </button>

          </form>

          <div className="reset-back">
            <button type="button" className="reset-back-btn" onClick={() => nav("/login")}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Sign In
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}