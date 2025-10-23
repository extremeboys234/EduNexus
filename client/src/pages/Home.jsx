import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../providers/AuthProvider";
import { logout as logoutAPI } from "../features/auth/services/authApi";
import { useNavigate } from "react-router-dom";

function Home() {
  const [message, setMessage] = useState("");
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/protected/dashboard", { withCredentials: true })
      .then((res) => setMessage(res.data.message))
      .catch((err) => {
        setMessage("Access denied. Please log in again.");
        logout();
        navigate("/login");
      });
  }, []);

  const handleLogout = async () => {
    await logoutAPI();
    logout();
    navigate("/login");
  };

  return (
    <div className="home-container">
      <h1>Welcome to Smart Study & Attendance Tracker</h1>
      <p>{message}</p>
      {auth && (
        <div className="user-info">
          <p><strong>Name:</strong> {auth.name}</p>
          <p><strong>Email:</strong> {auth.email}</p>
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Home;
