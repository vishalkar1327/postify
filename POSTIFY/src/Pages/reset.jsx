import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Reset() {

  const [pass, setPass] = useState("");
  const nav = useNavigate();

  const reset = () => {

    if (!pass) {
      alert("Please enter new password");
      return;
    }

    // 🔐 Strong password regex
    const strongPassword =
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/;

    if (!strongPassword.test(pass)) {
      alert(
        "Password must be 8+ chars, 1 capital letter, 1 number & 1 special character"
      );
      return;
    }

    const email = localStorage.getItem("recoverEmail");

    localStorage.setItem(
      "user",
      JSON.stringify({
        email,
        password: pass
      })
    );

    alert("Password updated successfully");

    nav("/");
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2>Reset Password</h2>

        <form onSubmit={(e)=>{ e.preventDefault(); reset(); }}>

          <div className="input-group">
            <input
              type="password"
              placeholder="Enter strong new password"
              required
              onChange={e => setPass(e.target.value)}
            />
          </div>

          <button className="login-btn" type="submit">
            Reset Password
          </button>

        </form>

      </div>
    </div>
  );
}
