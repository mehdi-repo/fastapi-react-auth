import api from "./api";
import { jwtDecode } from "jwt-decode";  

export const login = async (username, password) => {
  const response = await api.post("/login", { username, password });
  return response.data;
};

export const register = async (username, password, role) => {
  const response = await api.post("/register", { username, password, role });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

export const getToken = () => localStorage.getItem("token");

export const getRole = () => localStorage.getItem("role");

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      logout();
      return false;
    }
    return true;
  } catch (error) {
    logout();
    return false;
  }
};
