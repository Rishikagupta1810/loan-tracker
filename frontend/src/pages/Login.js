import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

 const handleSubmit = async () => {
  try {
    const res = await API.post("/auth/login", form);

    localStorage.setItem("token", res.data.token);

    toast.success("Login Success");
    navigate("/dashboard");
  } catch (error) {
    toast.error(error.response?.data?.message || "Login failed");
  }
};

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brandBar}>
          <span style={styles.brandIcon}>₹</span>
          <span style={styles.brandName}>LoanTrack</span>
        </div>

        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.subtitle}>Login to manage your loan utilization</p>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Email address</label>
          <input
            style={styles.input}
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button onClick={handleSubmit} style={styles.button}>
          Sign In →
        </button>

        <div style={styles.divider}><span style={styles.dividerText}>or</span></div>

        <p style={styles.footerText}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.link}>Create one free</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgb(241, 245, 249)",
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#ffffff",
    padding: "40px 36px",
    borderRadius: "20px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
  },
  brandBar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "28px",
  },
  brandIcon: {
    width: "32px",
    height: "32px",
    background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
    color: "#fff",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "700",
  },
  brandName: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#1e40af",
    letterSpacing: "-0.3px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 6px 0",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "28px",
    lineHeight: "1.5",
  },
  fieldGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1.5px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  },
  button: {
    width: "100%",
    background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
    color: "white",
    border: "none",
    padding: "13px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "8px",
    letterSpacing: "0.02em",
    boxShadow: "0 4px 15px rgba(29,78,216,0.4)",
    fontFamily: "inherit",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    margin: "20px 0 16px",
    gap: "12px",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "20px",
  },
  dividerText: {
    fontSize: "12px",
    color: "#94a3b8",
    background: "#fff",
    padding: "0 8px",
    marginTop: "-32px",
    alignSelf: "flex-start",
  },
  footerText: {
    textAlign: "center",
    fontSize: "13px",
    color: "#64748b",
    margin: "0",
  },
  link: {
    color: "#1d4ed8",
    fontWeight: "600",
    textDecoration: "none",
  },
};

export default Login;