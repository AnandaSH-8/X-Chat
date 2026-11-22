import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div id="register-page" style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>💬</div>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join our community and start chatting</p>
        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full Name</label>
          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}>👤</span>
            <input
              id="fullname-input"
              name="fullName"
              type="text"
              placeholder="Your full name"
              value={form.fullName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
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
          <label style={styles.label}>Username</label>
          <div style={styles.inputWrap}>
            <span style={styles.inputIcon}>@</span>
            <input
              id="username-input"
              name="username"
              type="text"
              placeholder="Choose a username"
              value={form.username}
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
              placeholder="Choose a strong password"
              value={form.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          {error && <p id="register-error" style={styles.error}>{error}</p>}
          <button id="register-button" type="submit" style={styles.btn}>
            Create Account
          </button>
        </form>
        <p style={styles.footer}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
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

export default Register;
