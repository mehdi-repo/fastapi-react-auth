import { useEffect, useState } from "react";
import { login, isAuthenticated } from "../services/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/"); // Redirect to home if already logged in
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      
      // Store token and role
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("role", response.role);
  
      // Redirect based on role
      if (response.role === "Admin") navigate("/admin-dashboard");
      else if (response.role === "Manager") navigate("/manager-dashboard");
      else navigate("/user-dashboard");  // Default redirect for Users
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('/home_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor:"#ADC3DE"
      }}
    >
      <div className="col-md-4 bg-white p-4 shadow rounded">
        <h2 className="text-center mb-4">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <p className="text-center mt-3">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
