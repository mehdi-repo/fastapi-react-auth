import { useEffect, useState } from "react";
import api from "../services/api";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/me"); // Replace with actual API endpoint
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  return <h2>Welcome, {user ? user.username : "Loading..."}</h2>;
};

export default AdminDashboard;
