import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const signup = () => {

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    // 🔐 Strong password regex
    const strongPassword =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;

    if (!strongPassword.test(password)) {
      alert(
        "Password must be 8+ chars, 1 capital, 1 number & 1 special character"
      );
      return;
    }

    const existingUser = JSON.parse(localStorage.getItem("user"));

    // 📧 Email already exists
    if (existingUser && existingUser.email === email) {
      alert("Email already exists. Please login.");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({ email, password })
    );

    alert("Account created successfully");

    nav("/");
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <h2>Create Account</h2>

        <form onSubmit={(e)=>{e.preventDefault(); signup();}}>

          <div className="input-group">
            <input
              type="email"
              placeholder="Enter your email"
              required
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Enter strong password"
              required
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn" type="submit">
            Sign Up
          </button>

        </form>

      </div>
    </div>
  );
}
