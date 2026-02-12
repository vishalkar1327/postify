import { Routes, Route } from "react-router-dom";

import Landing from "./Pages/landing.jsx";
import Login from "./Pages/Login.jsx";
import Signup from "./Pages/sing up";
import Forgot from "./Pages/forgot.jsx";
import Otp from "./Pages/otp.jsx";
import Reset from "./Pages/reset.jsx";

export default function App() {
  return (
    <Routes>

      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot" element={<Forgot />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/reset" element={<Reset />} />

    </Routes>
  );
}
