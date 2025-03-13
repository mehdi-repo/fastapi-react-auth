import { useNavigate } from "react-router-dom";
import { logout, isAuthenticated, getRole } from "../services/auth";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const navigate = useNavigate();
  const userRole = getRole();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className="vh-100 d-flex flex-column"
      style={{
        backgroundImage: "url('/home_bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Top Navigation (Login, Register, Logout) */}
      <nav className="container-fluid py-3">
        <div className="d-flex justify-content-end">
          {isAuthenticated() ? (
            <>
              <span className="text-light me-3">Logged in as <strong>{userRole}</strong></span>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn btn-light me-2" onClick={() => navigate("/login")}>Login</button>
              <button className="btn btn-outline-light" onClick={() => navigate("/register")}>Register</button>
            </>
          )}
        </div>
      </nav>

      {/* Centered Welcome Text */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center text-center">
        <div className="text-white p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", borderRadius: "10px" }}>
          <h1 className="display-4">Welcome to Our Platform</h1>
          <p className="lead">Experience the best authentication system</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
