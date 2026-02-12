import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const login = () => {

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.email === email && user.password === password) {
      alert("Login Success");
    } else {
      alert("Invalid credentials");
    }
  };

  return (

    <div className="login-container">

      <div className="login-card">

        <h2 className="brand">POSTIFY</h2>

        <form onSubmit={(e) => { e.preventDefault(); login(); }}>

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
              placeholder="Enter your password"
              required
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="options">
            <span className="forgot" onClick={() => nav("/forgot")}>
              Forgot Password?
            </span>
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>

        </form>

        <div className="switch">
          Don't have account? <span onClick={() => nav("/signup")}>Sign Up</span>
        </div>

      </div>
    </div>
  );
}
