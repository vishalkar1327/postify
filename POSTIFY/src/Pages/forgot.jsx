import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Forgot() {

  const [email, setEmail] = useState("");
  const nav = useNavigate();

  const recover = () => {

    if (!email) {
      alert("Enter email");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.email !== email) {
      alert("Email not found");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    localStorage.setItem("otp", otp.toString());
    localStorage.setItem("recoverEmail", email);

    alert("OTP sent (demo): " + otp);

    nav("/otp");
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2>Forgot Password</h2>

        <form onSubmit={(e)=>{ e.preventDefault(); recover(); }}>

          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              required
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <button className="login-btn" type="submit">
            Recover
          </button>

        </form>

        <div className="switch">
          <span onClick={() => nav("/")}>
            Back to Login
          </span>
        </div>

      </div>
    </div>
  );
}
