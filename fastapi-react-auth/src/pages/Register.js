import { useState } from "react";
import { register } from "../services/auth";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // ✅ State for success message
  const [errorMessage, setErrorMessage] = useState(""); // ✅ State for error handling
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const role = "User"; 

    try {
      await register(username, password, role);
      setSuccessMessage("Registration successful! Redirecting to login...");
      setErrorMessage("");

      // ✅ Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      setErrorMessage(" Registration failed! Try a different username.");
      setSuccessMessage("");
    }
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('/home_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#ADC3DE"
      }}
    >
      <div className="container vh-100 d-flex align-items-center justify-content-center">
        <div className="col-md-4 bg-white p-4 shadow rounded">
          <h2 className="text-center mb-4">Register</h2>

          {/* ✅ Show success or error message */}
          {successMessage && <div className="alert alert-success text-center">{successMessage}</div>}
          {errorMessage && <div className="alert alert-danger text-center">{errorMessage}</div>}

          <form onSubmit={handleRegister}>
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
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>

          <p className="text-center mt-3">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
