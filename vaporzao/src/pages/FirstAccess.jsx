import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function FirstAccess() {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  async function handleFirstAccess(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/primeiro-acesso", {
        matricula: matricula,
        senha: password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);

      setSuccess("Password defined successfully! Redirecting...");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Detailed first access error:", err);
      const backendError =
        err.response?.data?.erro || err.response?.data?.mensagem;
      setError(
        backendError ||
          "Failed to define password. Please ensure your matriculation is registered.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "350px",
        margin: "50px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h2>First Access Setup</h2>
      <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
        Enter your matriculation ID and define a password to initialize your
        account.
      </p>

      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", fontWeight: "bold" }}>{success}</p>
      )}

      <form
        onSubmit={handleFirstAccess}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="text"
          placeholder="Enter your Matriculation ID"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />

        <input
          type="password"
          placeholder="Define a new Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px", fontSize: "16px", cursor: "pointer" }}
        >
          {loading ? "Registering..." : "Define Password"}
        </button>
      </form>

      <div style={{ marginTop: "20px", fontSize: "14px", textAlign: "center" }}>
        <Link to="/login" style={{ color: "#0066cc", textDecoration: "none" }}>
          Already have a password? Sign In
        </Link>
      </div>
    </div>
  );
}
