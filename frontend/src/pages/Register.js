import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

 const handleSubmit = async () => {
  try {
    await API.post("/auth/register", form);
    alert("Registered Successfully");
    navigate("/");
  } catch (error) {
    console.log("REGISTER ERROR:", error.response?.data || error.message);
    alert(error.response?.data?.message || error.message || "Register failed");
  }
};

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brandBar}>
          <span style={styles.brandIcon}>₹</span>
          <span style={styles.brandName}>LoanTrack</span>
        </div>

        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>Register to start tracking your loans</p>

        <div style={styles.fieldGroup}>
          <label style={styles.label}>Full name</label>
          <input
            style={styles.input}
            placeholder="Arjun Sharma"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

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
            placeholder="Create a strong password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button onClick={handleSubmit} style={styles.button}>
          Create Account →
        </button>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <Link to="/" style={styles.link}>Sign in</Link>
        </p>

        <p style={styles.termsText}>
          By registering you agree to our Terms of Service and Privacy Policy.
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
    background: "linear-gradient(135deg, #059669, #047857)",
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
    color: "#047857",
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
    marginBottom: "24px",
    lineHeight: "1.5",
  },
  fieldGroup: {
    marginBottom: "14px",
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
    background: "linear-gradient(135deg, #059669, #047857)",
    color: "white",
    border: "none",
    padding: "13px",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    marginTop: "8px",
    letterSpacing: "0.02em",
    boxShadow: "0 4px 15px rgba(5,150,105,0.4)",
    fontFamily: "inherit",
  },
  footerText: {
    textAlign: "center",
    fontSize: "13px",
    color: "#64748b",
    margin: "18px 0 10px",
  },
  link: {
    color: "#059669",
    fontWeight: "600",
    textDecoration: "none",
  },
  termsText: {
    textAlign: "center",
    fontSize: "11px",
    color: "#94a3b8",
    margin: "0",
    lineHeight: "1.5",
  },
};

export default Register;