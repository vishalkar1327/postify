import "./forgot.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const nav = useNavigate();

  const recover = () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem("postify_users")) || [];
    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      alert("No account found with this email.");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    localStorage.setItem("otp", otp.toString());
    localStorage.setItem("recoverEmail", email);

    alert("OTP sent (demo): " + otp);

    nav("/otp");
  };

  return (
    <div className="fp-root">

      {/* Background Effects */}
      <div className="fp-grid-bg" />
      <div className="fp-orb fp-orb-1" />
      <div className="fp-orb fp-orb-2" />
      <div className="fp-orb fp-orb-3" />

      <div className="fp-wrapper">

        {/* Left Side Panel */}
        <div className="fp-left">
          <div className="fp-badge">
            <div className="fp-badge-dot" />
            <span>Postify</span>
          </div>

          <h1>Recover<br />Access.</h1>

          <p>
            Enter your registered email and we will send
            you a one-time password to reset your account.
          </p>

          <div className="fp-steps">

            <div className="fp-step">
              <div className="fp-step-num">01</div>
              <div className="fp-step-text">
                <span className="fp-step-title">Enter your email</span>
                <span className="fp-step-desc">The one linked to your account</span>
              </div>
            </div>

            <div className="fp-step-line" />

            <div className="fp-step">
              <div className="fp-step-num">02</div>
              <div className="fp-step-text">
                <span className="fp-step-title">Receive your OTP</span>
                <span className="fp-step-desc">A 6-digit code will be generated</span>
              </div>
            </div>

            <div className="fp-step-line" />

            <div className="fp-step">
              <div className="fp-step-num">03</div>
              <div className="fp-step-text">
                <span className="fp-step-title">Reset your password</span>
                <span className="fp-step-desc">Create a new secure password</span>
              </div>
            </div>

          </div>
        </div>

        {/* Card */}
        <div className="fp-card">

          <div className="fp-card-header">
            <div className="fp-icon-wrap">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2>Forgot Password</h2>
            <p>We will help you get back in</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); recover(); }}>

            <div className="fp-field">
              <label>Registered Email</label>
              <div className="fp-input-wrap">
                <svg className="fp-input-icon" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="fp-note">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              An OTP will be generated for demo purposes.
            </div>

            <button type="submit" className="fp-btn">
              Send OTP →
            </button>

          </form>

          <div className="fp-back">
            <button type="button" className="fp-back-btn" onClick={() => nav("/login")}>
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