import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Otp() {

  const [otp, setOtp] = useState("");
  const nav = useNavigate();

  const verify = () => {

    if(!otp){
      alert("Enter OTP");
      return;
    }

    const savedOtp = localStorage.getItem("otp");

    if (otp === savedOtp) {
      nav("/reset");
    } else {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2>Verify OTP</h2>

        <form onSubmit={(e)=>{ e.preventDefault(); verify(); }}>

          <div className="input-group">
            <input
              placeholder="Enter OTP"
              required
              onChange={e => setOtp(e.target.value)}
            />
          </div>

          <button className="login-btn" type="submit">
            Verify
          </button>

        </form>

      </div>
    </div>
  );
}
