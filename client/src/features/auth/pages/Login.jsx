import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authApi";
import { useAuth } from "../../../providers/AuthProvider";
import "../../../assets/styles/auth.css"

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      setMessage("Welcome back, " + res.data.user.name + "!");
      setAuth(res.data.user);
      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login to Smart Study & Attendance Tracker</h2>
      <p>Stay prepared, stay consistent.</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <input type="email" name="email" placeholder="College Email" value={formData.email} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>

      {message && <p className="msg">{message}</p>}

      <p>New here? <a href="/signup">Create an account</a></p>
    </div>
  );
}

export default Login;
