import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";

import Landing from "./Pages/landing.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/sing up";
import Forgot from "./Pages/forgot.jsx";
import Otp from "./Pages/otp.jsx";
import Reset from "./Pages/reset.jsx";
import Dashboard from "./Pages/Dashboard";
import Generate from "./Pages/Generate";
import UserDashboard from "./Pages/UserDashboard";

export default function App() {
  const navigate = useNavigate();

  const [isAuth, setIsAuth] = useState(
    localStorage.getItem("isAuth") === "true"
  );

  const handleLogout = () => {
    localStorage.removeItem("isAuth");
    setIsAuth(false);
    navigate("/login");
  };

  return (
    <Routes>

      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={<Login setIsAuth={setIsAuth} />}
      />

      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/reset" element={<Reset />} />

      <Route
        path="/dashboard"
        element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
      />

      <Route
        path="/user-dashboard"
        element={
          isAuth ? (
            <UserDashboard onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin"
        element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
      />

      <Route
        path="/generate"
        element={isAuth ? <Generate /> : <Navigate to="/login" />}
      />

    </Routes>
  );
}