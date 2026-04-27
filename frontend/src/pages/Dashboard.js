import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";

function Dashboard() {
  const [loans, setLoans] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const [form, setForm] = useState({
    amount: "",
    reason: ""
  });

  const [expenseForm, setExpenseForm] = useState({
    loan: "",
    amount: "",
    description: "",
    image: null,
    latitude: "",
    longitude: ""
  });

  useEffect(() => {
    fetchLoans();
    fetchExpenses();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await API.get("/loans");
      setLoans(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await API.get("/expenses");
      setExpenses(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const addLoan = async () => {
    try {
      await API.post("/loans", {
        amount: Number(form.amount),
        reason: form.reason,
        interest: 5,
        duration: 12
      });

      setForm({ amount: "", reason: "" });
      fetchLoans();
      toast.success("Loan added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Add loan failed");
    }
  };

  const deleteLoan = async (id) => {
    try {
      await API.delete(`/loans/${id}`);
      fetchLoans();
      fetchExpenses();
      toast.success("Loan deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const updateLoan = async (id) => {
    const newAmount = prompt("Enter new amount:");
    if (!newAmount) return;

    try {
      await API.put(`/loans/${id}`, { amount: Number(newAmount) });
      fetchLoans();
      toast.success("Loan updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const addExpense = async () => {
    try {
      const formData = new FormData();

      formData.append("loan", expenseForm.loan);
      formData.append("amount", expenseForm.amount);
      formData.append("description", expenseForm.description);
      formData.append("latitude", expenseForm.latitude);
      formData.append("longitude", expenseForm.longitude);

      if (expenseForm.image) {
        formData.append("image", expenseForm.image);
      }

      await API.post("/expenses", formData);

      setExpenseForm({
        loan: "",
        amount: "",
        description: "",
        image: null,
        latitude: "",
        longitude: ""
      });

      fetchExpenses();
      toast.success("Expense added successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding expense");
    }
  };

  const deleteExpense = async (id) => {
    try {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
      toast.success("Expense deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete expense failed");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/expenses/${id}/status`, { status });
      fetchExpenses();
      toast.success("Status updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating status");
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setExpenseForm((prev) => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
        toast.success("Location fetched successfully");
      },
      () => {
        toast.error("Unable to fetch location");
      }
    );
  };

  const totalLoan = loans.reduce((sum, l) => sum + Number(l.amount || 0), 0);
  const totalExpense = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const remaining = totalLoan - totalExpense;

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoMark}>₹</div>
          <div>
            <h1 style={styles.title}>Loan Utilization Dashboard</h1>
            <p style={styles.headerSub}>Track and manage your loan spending</p>
          </div>
        </div>
        <button
          style={styles.logoutBtn}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* Summary Cards */}
      <div style={styles.summaryBox}>
        <div style={{ ...styles.summaryCard, ...styles.summaryCardBlue }}>
          <p style={styles.summaryLabel}>Total Loan</p>
          <p style={styles.summaryValue}>₹{totalLoan.toLocaleString("en-IN")}</p>
          <p style={styles.summaryHint}>Sanctioned amount</p>
        </div>

        <div style={{ ...styles.summaryCard, ...styles.summaryCardAmber }}>
          <p style={styles.summaryLabel}>Total Used</p>
          <p style={{ ...styles.summaryValue, color: "#92400e" }}>₹{totalExpense.toLocaleString("en-IN")}</p>
          <p style={styles.summaryHint}>Across all expenses</p>
        </div>

        <div style={{ ...styles.summaryCard, ...styles.summaryCardGreen }}>
          <p style={styles.summaryLabel}>Remaining</p>
          <p style={{ ...styles.summaryValue, color: "#065f46" }}>₹{remaining.toLocaleString("en-IN")}</p>
          <p style={styles.summaryHint}>Available balance</p>
        </div>
      </div>

      <div style={styles.grid}>

        {/* Add Loan */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={{ ...styles.sectionIcon, background: "#dbeafe" }}>💳</div>
            <h3 style={styles.sectionTitle}>Add Loan</h3>
          </div>
          <label style={styles.label}>Amount (₹)</label>
          <input
            style={styles.input}
            placeholder="e.g. 50000"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <label style={styles.label}>Reason</label>
          <input
            style={styles.input}
            placeholder="e.g. Home renovation"
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
          />
          <button style={styles.button} onClick={addLoan}>
            + Add Loan
          </button>
        </div>

        {/* Add Expense */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={{ ...styles.sectionIcon, background: "#d1fae5" }}>🧾</div>
            <h3 style={styles.sectionTitle}>Add Expense</h3>
          </div>

          <label style={styles.label}>Select Loan</label>
          <select
            style={styles.input}
            value={expenseForm.loan}
            onChange={(e) =>
              setExpenseForm({ ...expenseForm, loan: e.target.value })
            }
          >
            <option value="">— Choose a loan —</option>
            {loans.map((loan) => (
              <option key={loan._id} value={loan._id}>
                ₹{loan.amount} — {loan.reason}
              </option>
            ))}
          </select>

          <label style={styles.label}>Amount (₹)</label>
          <input
            style={styles.input}
            placeholder="e.g. 5000"
            value={expenseForm.amount}
            onChange={(e) =>
              setExpenseForm({ ...expenseForm, amount: e.target.value })
            }
          />

          <label style={styles.label}>Description</label>
          <input
            style={styles.input}
            placeholder="What was this expense for?"
            value={expenseForm.description}
            onChange={(e) =>
              setExpenseForm({ ...expenseForm, description: e.target.value })
            }
          />

          <label style={styles.label}>Proof Image</label>
          <input
            style={{ ...styles.input, padding: "8px 12px", cursor: "pointer" }}
            type="file"
            accept="image/*"
            onChange={(e) =>
              setExpenseForm({ ...expenseForm, image: e.target.files[0] })
            }
          />

          <div style={{ display: "flex", gap: "8px" }}>
            <button style={{ ...styles.locationBtn, flex: 1 }} onClick={getLocation}>
              📍 Get Current Location
            </button>
            {expenseForm.latitude && expenseForm.longitude ? (
              <a
                href={`https://www.google.com/maps?q=${expenseForm.latitude},${expenseForm.longitude}`}
                target="_blank"
                rel="noreferrer"
                style={styles.viewMapBtn}
              >
                🗺️ View Map
              </a>
            ) : (
              <button style={{ ...styles.viewMapBtn, opacity: 0.4, cursor: "not-allowed" }} disabled>
                🗺️ View Map
              </button>
            )}
          </div>

          <div style={styles.coordRow}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Latitude</label>
              <input
                style={{ ...styles.input, background: "#f1f5f9", color: "#64748b" }}
                placeholder="Auto-filled"
                value={expenseForm.latitude}
                readOnly
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Longitude</label>
              <input
                style={{ ...styles.input, background: "#f1f5f9", color: "#64748b" }}
                placeholder="Auto-filled"
                value={expenseForm.longitude}
                readOnly
              />
            </div>
          </div>

          <button style={{ ...styles.button, background: "linear-gradient(135deg, #059669, #047857)", boxShadow: "0 4px 12px rgba(5,150,105,0.3)" }} onClick={addExpense}>
            + Add Expense
          </button>
        </div>
      </div>

      {/* Loans List */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={{ ...styles.sectionIcon, background: "#ede9fe" }}>🏦</div>
          <h3 style={styles.sectionTitle}>Your Loans</h3>
          <span style={styles.countBadge}>{loans.length}</span>
        </div>

        {loans.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No loans added yet. Add your first loan above.</p>
          </div>
        ) : (
          loans.map((loan) => (
            <div key={loan._id} style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={styles.cardAvatar}>₹</div>
                <div>
                  <p style={styles.cardTitle}>{loan.reason}</p>
                  <p style={styles.cardMeta}>ID: {loan._id}</p>
                </div>
              </div>
              <div style={styles.cardRight}>
                <p style={styles.cardAmount}>₹{Number(loan.amount).toLocaleString("en-IN")}</p>
                <div style={styles.cardActions}>
                  <button style={styles.editBtn} onClick={() => updateLoan(loan._id)}>Edit</button>
                  <button style={styles.deleteBtn} onClick={() => deleteLoan(loan._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Expenses List */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <div style={{ ...styles.sectionIcon, background: "#fef3c7" }}>📋</div>
          <h3 style={styles.sectionTitle}>Your Expenses</h3>
          <span style={styles.countBadge}>{expenses.length}</span>
        </div>

        {expenses.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No expenses recorded yet.</p>
          </div>
        ) : (
          expenses.map((exp) => (
            <div key={exp._id} style={styles.card}>
              <div style={styles.cardLeft}>
                <div style={{ ...styles.cardAvatar, background: "#fef3c7", color: "#92400e" }}>🧾</div>
                <div>
                  <p style={styles.cardTitle}>{exp.description}</p>
                  <p style={styles.cardMeta}>
                    {exp.location?.latitude && exp.location?.longitude
                      ? `📍 ${exp.location.latitude.toFixed(4)}, ${exp.location.longitude.toFixed(4)}`
                      : "No location"}
                  </p>
                  {exp.location?.latitude && exp.location?.longitude && (
                    <a
                      href={`https://www.google.com/maps?q=${exp.location.latitude},${exp.location.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.mapLink}
                    >
                      View on Map →
                    </a>
                  )}
                </div>
              </div>

              <div style={styles.cardRight}>
                <p style={styles.cardAmount}>₹{Number(exp.amount).toLocaleString("en-IN")}</p>

                <span style={{
                  ...styles.statusBadge,
                  ...(exp.status === "approved" ? styles.statusApproved
                    : exp.status === "rejected" ? styles.statusRejected
                    : styles.statusPending)
                }}>
                  {exp.status}
                </span>

                {exp.image && (
                  <img
                    src={`http://localhost:5000${exp.image}`}
                    alt="proof"
                    style={styles.image}
                  />
                )}

                <div style={styles.actionRow}>
                  <button style={styles.approveBtn} onClick={() => updateStatus(exp._id, "approved")}>✓ Approve</button>
                  <button style={styles.rejectBtn} onClick={() => updateStatus(exp._id, "rejected")}>✕ Reject</button>
                  <button style={styles.deleteBtn} onClick={() => deleteExpense(exp._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>



    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f1f5f9",
    padding: "24px",
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "24px",
    padding: "20px 24px",
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  logoMark: {
    width: "44px",
    height: "44px",
    background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
    color: "#fff",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "700",
    flexShrink: 0,
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.4px",
  },
  headerSub: {
    fontSize: "13px",
    color: "#64748b",
    margin: "2px 0 0",
  },

  summaryBox: {
    display: "flex",
    gap: "16px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  summaryCard: {
    flex: "1",
    minWidth: "180px",
    background: "white",
    padding: "20px 22px",
    borderRadius: "14px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  summaryCardBlue: {
    borderLeft: "4px solid #1d4ed8",
  },
  summaryCardAmber: {
    borderLeft: "4px solid #f59e0b",
  },
  summaryCardGreen: {
    borderLeft: "4px solid #059669",
  },
  summaryLabel: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    margin: "0 0 8px",
  },
  summaryValue: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#1e40af",
    margin: "0 0 4px",
    letterSpacing: "-0.5px",
  },
  summaryHint: {
    fontSize: "11px",
    color: "#94a3b8",
    margin: 0,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
    marginBottom: "16px",
  },

  section: {
    background: "white",
    padding: "22px 24px",
    borderRadius: "16px",
    marginBottom: "16px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "18px",
  },
  sectionIcon: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    flexShrink: 0,
  },
  sectionTitle: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
    flex: 1,
  },
  countBadge: {
    fontSize: "12px",
    fontWeight: "600",
    background: "#f1f5f9",
    color: "#475569",
    padding: "2px 10px",
    borderRadius: "20px",
    border: "1px solid #e2e8f0",
  },

  label: {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "5px",
    marginTop: "2px",
  },

  input: {
    padding: "10px 13px",
    margin: "0 0 12px 0",
    borderRadius: "9px",
    border: "1.5px solid #e2e8f0",
    width: "100%",
    boxSizing: "border-box",
    fontSize: "14px",
    color: "#0f172a",
    background: "#f8fafc",
    fontFamily: "inherit",
    outline: "none",
  },

  button: {
    padding: "11px 16px",
    background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
    color: "white",
    border: "none",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    marginTop: "4px",
    width: "100%",
    boxShadow: "0 4px 12px rgba(29,78,216,0.3)",
    fontFamily: "inherit",
    letterSpacing: "0.01em",
  },

  locationBtn: {
    flex: 1,
    padding: "10px 13px",
    background: "#f8fafc",
    color: "#374151",
    border: "1.5px solid #e2e8f0",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    marginBottom: "10px",
    fontFamily: "inherit",
    textAlign: "left",
  },
  viewMapBtn: {
    padding: "10px 13px",
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1.5px solid #bfdbfe",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "13px",
    marginBottom: "10px",
    fontFamily: "inherit",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap",
  },

  coordRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "4px",
  },

  card: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "10px",
    background: "#f8fafc",
    gap: "12px",
  },
  cardLeft: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    flex: 1,
    minWidth: 0,
  },
  cardAvatar: {
    width: "38px",
    height: "38px",
    background: "#dbeafe",
    color: "#1e40af",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "16px",
    fontWeight: "700",
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#0f172a",
    margin: "0 0 3px",
  },
  cardMeta: {
    fontSize: "12px",
    color: "#64748b",
    margin: 0,
  },
  cardRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
    flexShrink: 0,
  },
  cardAmount: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#0f172a",
    margin: 0,
    letterSpacing: "-0.3px",
  },
  cardActions: {
    display: "flex",
    gap: "6px",
  },

  actionRow: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },

  editBtn: {
    background: "#fef3c7",
    color: "#92400e",
    border: "1px solid #fde68a",
    padding: "5px 12px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    fontFamily: "inherit",
  },

  deleteBtn: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    padding: "5px 12px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    fontFamily: "inherit",
  },

  approveBtn: {
    background: "#d1fae5",
    color: "#065f46",
    border: "1px solid #a7f3d0",
    padding: "5px 12px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    fontFamily: "inherit",
  },

  rejectBtn: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
    padding: "5px 12px",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    fontFamily: "inherit",
  },

  statusBadge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "700",
    padding: "3px 10px",
    borderRadius: "20px",
    textTransform: "capitalize",
    letterSpacing: "0.04em",
  },
  statusApproved: {
    background: "#d1fae5",
    color: "#065f46",
    border: "1px solid #a7f3d0",
  },
  statusRejected: {
    background: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fecaca",
  },
  statusPending: {
    background: "#fef3c7",
    color: "#92400e",
    border: "1px solid #fde68a",
  },

  image: {
    width: "80px",
    height: "60px",
    marginTop: "4px",
    borderRadius: "8px",
    objectFit: "cover",
    border: "1px solid #e2e8f0",
  },

  mapLink: {
    display: "inline-block",
    marginTop: "4px",
    color: "#1d4ed8",
    fontWeight: "600",
    textDecoration: "none",
    fontSize: "12px",
  },

  emptyState: {
    padding: "24px",
    background: "#f8fafc",
    borderRadius: "10px",
    border: "1.5px dashed #e2e8f0",
    textAlign: "center",
  },
  emptyText: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: 0,
  },
  logoutBtn: {
    padding: "11px 32px",
    background: "#fff",
    color: "#dc2626",
    border: "1.5px solid #fecaca",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "14px",
    fontFamily: "inherit",
    letterSpacing: "0.01em",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
};

export default Dashboard;