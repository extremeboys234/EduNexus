import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/authApi";
import { useAuth } from "../../../providers/AuthProvider";
import "../../../assets/styles/auth.css";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginApi(formData);
      login(res.data.user); // ✅ context login
      setMessage("Welcome back, " + res.data.user.name + "!");
      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p className="msg">{message}</p>}
    </div>
  );
}

export default Login;
