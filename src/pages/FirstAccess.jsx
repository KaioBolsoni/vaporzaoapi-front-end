import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import swal from "../utils/swal";
import { useForm } from "../hooks/useForm";

export default function FirstAccess() {
  const [form, onChange] = useForm({ matricula: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { token, login, loading: authLoading } = useAuth();

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  if (authLoading) return null;

  async function handleFirstAccess(e) {
    e.preventDefault();
    if (!form.matricula.trim() || !form.password.trim()) {
      swal.fire({ icon: "warning", title: "Campos obrigatórios", text: "Preencha sua matrícula e a nova senha." });
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("/auth/primeiro-acesso", {
        matricula: form.matricula,
        senha: form.password,
      });
      const { token: jwtToken, usuario } = response.data;
      login(jwtToken, usuario);
      swal.fire({ icon: "success", title: "Senha definida!", text: "Bem-vindo(a) à Vaporzão!", timer: 1500, showConfirmButton: false })
        .then(() => navigate("/"));
    } catch (err) {
      const msg = err.response?.data?.erro || err.response?.data?.mensagem;
      swal.fire({
        icon: "error",
        title: "Erro no primeiro acesso",
        text: msg || "Verifique sua matrícula e tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-main)", padding: "2rem" }}>
      <div style={{
        width: "100%",
        maxWidth: "420px",
        background: "var(--bg-surface)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "var(--radius-lg)",
        padding: "2.5rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "3px",
          background: "linear-gradient(90deg, #7c3aed, #c084fc, #a78bfa, #7c3aed)",
          backgroundSize: "300% 100%",
          animation: "bar-shimmer 3s linear infinite",
        }} />

        <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "2rem" }}>
          <span style={{ fontSize: "1.4rem" }}>🎮</span>
          <span style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
            TaTaKazim
          </span>
        </div>

        <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.35rem", letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
          Primeiro acesso
        </h2>
        <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginBottom: "2rem", lineHeight: 1.5 }}>
          Informe sua matrícula e defina uma senha para ativar sua conta.
        </p>

        <form onSubmit={handleFirstAccess} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Matrícula</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                className="form-input"
                type="text"
                name="matricula"
                placeholder="00000.0000"
                value={form.matricula}
                onChange={onChange}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Nova Senha</label>
            <div className="input-wrapper">
              <span className="input-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect width="18" height="11" x="3" y="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                className="form-input"
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Mínimo 6 caracteres"
                value={form.password}
                onChange={onChange}
                autoComplete="new-password"
                style={{ paddingRight: "2.8rem" }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                title={showPass ? "Ocultar senha" : "Mostrar senha"}
                style={{
                  position: "absolute", right: "10px",
                  background: "none", border: "none", cursor: "pointer",
                  color: showPass ? "var(--accent-light)" : "var(--text-muted)",
                  display: "flex", padding: "4px",
                  transition: "color 0.15s",
                }}
              >
                {showPass
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                }
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", padding: "0.82rem", marginTop: "0.2rem", fontSize: "0.92rem" }}
          >
            {loading ? (
              <>
                <span style={{
                  width: "14px", height: "14px",
                  border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
                  borderRadius: "50%", display: "inline-block",
                }} className="spin" />
                Ativando conta...
              </>
            ) : "Definir senha →"}
          </button>
        </form>

        <div style={{
          marginTop: "2rem", padding: "1rem",
          background: "var(--bg-card)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "var(--radius-sm)", textAlign: "center",
        }}>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
            Já possui senha?
          </p>
          <Link
            to="/login"
            style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--accent-light)", textDecoration: "none" }}
          >
            Entrar na conta →
          </Link>
        </div>
      </div>
    </div>
  );
}
