import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../services/auth";

const AuthRoute = ({ children, requiredRole }) => {
  if (!isAuthenticated()) {
    // If the user is not logged in, redirect to login page
    return <Navigate to="/login" />;
  }

  const userRole = getRole();
  if (requiredRole && userRole !== requiredRole) {
    // If the user does not have permission, redirect to home page "/"
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthRoute;
