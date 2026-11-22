import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuthContext } from "../context/AuthContext";
import { setOnline } from "../firebase/presenceService";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthContext();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(form);
      const user = res.data.data.user;
      setUser(user);
      setOnline(user._id);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div id="login-page" style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>💬</div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to continue to ChatApp</p>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Email address</label>
          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}>✉️</span>
            <input
              id="email-input"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <label style={styles.label}>Password</label>
          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}>🔒</span>
            <input
              id="password-input"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          {error && <p id="login-error" style={styles.error}>{error}</p>}
          <button id="login-button" type="submit" style={styles.btn}>
            Sign in
          </button>
        </form>
        <p style={styles.footer}>
          Don&apos;t have an account? <Link to="/register" style={styles.link}>Sign up</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6" },
  card: { background: "#fff", borderRadius: 12, padding: "40px 36px", width: 360, boxShadow: "0 4px 24px rgba(0,0,0,0.08)" },
  icon: { fontSize: 32, textAlign: "center", marginBottom: 8 },
  title: { textAlign: "center", margin: "0 0 4px", fontSize: 22, fontWeight: 700 },
  subtitle: { textAlign: "center", color: "#6b7280", fontSize: 14, marginBottom: 20 },
  label: { display: "block", fontSize: 13, fontWeight: 500, marginBottom: 4, color: "#374151" },
  inputWrap: { display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: 6, marginBottom: 14, padding: "0 10px", background: "#fff" },
  inputIcon: { marginRight: 8, fontSize: 14, color: "#9ca3af" },
  input: { flex: 1, border: "none", outline: "none", padding: "10px 0", fontSize: 14, background: "transparent" },
  btn: { width: "100%", padding: "11px 0", background: "#2563eb", color: "#fff", border: "none", borderRadius: 6, fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 4 },
  error: { color: "#dc2626", fontSize: 13, marginBottom: 8, textAlign: "center" },
  footer: { textAlign: "center", fontSize: 13, color: "#6b7280", marginTop: 16 },
  link: { color: "#2563eb", textDecoration: "none", fontWeight: 500 },
};

export default Login;
