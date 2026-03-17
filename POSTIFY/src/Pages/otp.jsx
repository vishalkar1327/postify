import "./Otp.css";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Otp() {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);
  const nav = useNavigate();

  // ===== COUNTDOWN TIMER =====
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTimer = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ===== INPUT HANDLERS =====
  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const updated = [...digits];
    updated[idx] = val;
    setDigits(updated);
    if (val && idx < 5) {
      inputs.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputs.current[idx - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputs.current[5].focus();
    }
  };

  // ===== VERIFY OTP =====
  const verify = () => {
    const otp = digits.join("");
    if (otp.length < 6) {
      alert("Please enter the complete 6-digit OTP.");
      return;
    }
    const savedOtp = localStorage.getItem("otp");
    if (otp === savedOtp) {
      nav("/reset");
    } else {
      alert("Invalid OTP. Please try again.");
      setDigits(["", "", "", "", "", ""]);
      inputs.current[0].focus();
    }
  };

  // ===== RESEND OTP =====
  const resendOtp = () => {
    if (!canResend) return;

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem("otp", newOtp);

    alert("New OTP (demo): " + newOtp);

    setDigits(["", "", "", "", "", ""]);
    inputs.current[0].focus();
    setTimer(60);
    setCanResend(false);
  };

  return (
    <div className="otp-root">

      {/* Background Effects */}
      <div className="otp-grid-bg" />
      <div className="otp-orb otp-orb-1" />
      <div className="otp-orb otp-orb-2" />
      <div className="otp-orb otp-orb-3" />

      <div className="otp-wrapper">

        {/* Left Side */}
        <div className="otp-left">
          <div className="otp-badge">
            <div className="otp-badge-dot" />
            <span>Postify</span>
          </div>

          <h1>Check Your<br />Email.</h1>

          <p>
            We sent a 6-digit verification code to your
            registered email address. Enter it below to continue.
          </p>

          <div className="otp-info-box">
            <div className="otp-info-icon">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="otp-info-text">
              <span className="otp-info-title">OTP sent to your email</span>
              <span className="otp-info-desc">Check your inbox or spam folder</span>
            </div>
          </div>

          <div className="otp-info-box">
            <div className="otp-info-icon">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="otp-info-text">
              <span className="otp-info-title">Code expires in 10 minutes</span>
              <span className="otp-info-desc">Request a new one if it expires</span>
            </div>
          </div>
        </div>

        {/* OTP Card */}
        <div className="otp-card">

          <div className="otp-card-header">
            <div className="otp-icon-wrap">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h2>Verify OTP</h2>
            <p>Enter the 6-digit code sent to your email</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); verify(); }}>

            <div className="otp-boxes" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  className="otp-box"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  ref={(el) => (inputs.current[i] = el)}
                  onChange={(e) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                />
              ))}
            </div>

            <button type="submit" className="otp-btn">
              Verify OTP →
            </button>

          </form>

          {/* Resend / Timer */}
          <div className="otp-resend-section">
            {canResend ? (
              <div className="otp-resend">
                Did not receive the code?{" "}
                <span onClick={resendOtp}>Resend OTP</span>
              </div>
            ) : (
              <div className="otp-timer">
                Resend available in{" "}
                <span className="otp-timer-count">{formatTimer(timer)}</span>
              </div>
            )}
          </div>

          <div className="otp-back">
            <button type="button" className="otp-back-btn" onClick={() => nav("/forgot")}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Forgot Password
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}