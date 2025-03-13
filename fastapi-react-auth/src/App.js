import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";  // New home page
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AuthRoute from "./components/AuthRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes - Users must have the correct role */}
        <Route path="/admin-dashboard" element={<AuthRoute requiredRole="Admin"><AdminDashboard /></AuthRoute>} />
        <Route path="/user-dashboard" element={<AuthRoute requiredRole="User"><UserDashboard /></AuthRoute>} />
        <Route path="/manager-dashboard" element={<AuthRoute requiredRole="Manager"><ManagerDashboard /></AuthRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
