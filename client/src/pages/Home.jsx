import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../providers/AuthProvider";
import { logout as logoutAPI } from "../features/auth/services/authApi";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Home.css";

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
    <div>
      <nav className="navbar">
        <div className="nav-brand">
          <h1>StudySync 🎓</h1>
        </div>
        <ul className="nav-links">
          <li><a href="#" className="active">Home</a></li>
          <li><a href="#">Notes & Questions</a></li>
          <li><a href="#">Attendance</a></li>
        </ul>
        <div className="nav-profile">
          <span>Welcome, {auth?.name || "Student"}!</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="container">
        <header className="main-header">
          <h2>Your Academic Home</h2>
          <p>Here's a quick overview of your progress.</p>
          <p>{message}</p>
        </header>

        <div className="dashboard-grid">
          <div className="card quick-actions">
            <h3>Quick Actions</h3>
            <a href="notes.html" className="btn btn-primary">➕ Upload New Notes</a>
            <button className="btn btn-secondary">✔️ Mark Today's Attendance</button>
          </div>

          <div className="card attendance-overview">
            <h3>Attendance Overview</h3>
            <div className="subject-attendance safe">
              <span>CS101 - Intro to Programming</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: "92%" }}>92%</div>
              </div>
            </div>
            <div className="subject-attendance warning">
              <span>MA203 - Calculus II</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: "78%" }}>78%</div>
              </div>
            </div>
            <div className="subject-attendance danger">
              <span>EE101 - Basic Electronics</span>
              <div className="progress-bar">
                <div className="progress" style={{ width: "65%" }}>65%</div>
              </div>
            </div>
          </div>

          <div className="card ai-recommendations">
            <h3>🤖 AI Study Recommendations</h3>
            <p>You recently uploaded notes on "Data Structures".</p>
            <button className="btn btn-tertiary">Generate Quiz on Linked Lists</button>
            <p>You seem to be struggling with "Big O Notation".</p>
            <button className="btn btn-tertiary">Review Key Questions</button>
          </div>

          <div className="card recent-activity">
            <h3>Recent Activity</h3>
            <ul className="activity-feed">
              <li>Uploaded notes for <strong>CS101 - Lecture 5</strong>. <span>(Today)</span></li>
              <li>Generated 15 questions on "Recursion". <span>(Yesterday)</span></li>
              <li>Marked attendance for all subjects. <span>(Yesterday)</span></li>
              <li>Uploaded notes for <strong>MA203 - Chapter 3</strong>. <span>(2 days ago)</span></li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;