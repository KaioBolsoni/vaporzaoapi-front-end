import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { token, login, loading: authLoading } = useAuth();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  if (authLoading) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <h2>Checking session...</h2>
      </div>
    );
  }

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        matricula: identifier,
        senha: password,
      });

      const { token: jwtToken, usuario } = response.data;
      login(jwtToken, usuario);

      navigate("/");
    } catch (err) {
      console.error("Detailed login error:", err);
      setError("Invalid credentials or communication error. Please try again.");
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
      <h2>Catalog Access</h2>

      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#fef2f2",
            border: "1px solid #fee2e2",
            borderRadius: "4px",
            color: "#991b1b",
            fontSize: "14px",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
          ❌ {error}
        </div>
      )}

      <form
        onSubmit={handleLogin}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="text"
          placeholder="Enter your Matriculation or Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />

        <input
          type="password"
          placeholder="Enter your Password"
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
          {loading ? "Authenticating..." : "Sign In"}
        </button>
      </form>

      <div style={{ marginTop: "20px", fontSize: "14px", textAlign: "center" }}>
        <Link
          to="/first-access"
          style={{ color: "#0066cc", textDecoration: "none" }}
        >
          First access? Setup your password here
        </Link>
      </div>
    </div>
  );
}
