import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authApi";
import { useAuth } from "../../providers/AuthProvider";
import "../../assets/styles/auth.css";

function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await signup(formData);
      setMessage(res.data.message || "Signup successful!");
      setAuth(res.data.user);
      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Join Smart Study & Attendance Tracker</h2>
      <p>Connect notes, questions, and attendance in one place.</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="College Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Sign Up</button>
      </form>

      {message && <p className="msg">{message}</p>}

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default Signup;
