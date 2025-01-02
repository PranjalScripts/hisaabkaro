import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // Import context
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const Login = () => {
  const [identifier, setIdentifier] = useState(""); // Can be email or phone
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const { login } = useAuth(); // Access login function from context
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/; // Assumes a 10-digit phone number

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
      toast.warn("Please enter a valid email or 10-digit phone number.");
      return;
    }

    const loginPayload = emailRegex.test(identifier)
      ? { email: identifier, password }
      : { phone: identifier, password };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/api/v1/auth/login`,
        loginPayload
      );
      console.log("response", response);
      const { user, token } = response.data;
      login(user); // Pass the user data to context for login
      localStorage.setItem("token", token);
      console.log("user id", user.id);
      localStorage.setItem("userId", user.id);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh", backgroundColor: "#f8f9fa" }}
    >
      <div
        className="card p-4 shadow-lg rounded"
        style={{ maxWidth: "400px", width: "100%", borderColor: "#ced4da" }}
      >
        <h2 className="text-center mb-4" style={{ color: "#495057" }}>
          Login
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email or Phone</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              className="form-control"
              placeholder="Enter email or phone"
            />
          </div>
          <div className="mb-3 position-relative">
            <label className="form-label">Password</label>
            <input
              type={showPassword ? "text" : "password"} // Toggle password visibility
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"
              placeholder="Enter password"
            />
            <button
              type="button"
              className="position-absolute border-0 bg-transparent"
              style={{
                top: "70%",
                right: "10px",
                transform: "translateY(-50%)",
                color: "#6c757d",
                cursor: "pointer",
              }}
              onClick={() => setShowPassword(!showPassword)} // Toggle visibility
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
              {/* Toggle between eye and eye-slash icons */}
            </button>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
          <p className="text-center mt-3">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-decoration-none"
              style={{ color: "#0d6efd" }}
            >
              Signup here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
