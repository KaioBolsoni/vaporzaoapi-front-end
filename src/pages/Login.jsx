import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import swal from "../utils/swal";
import { useForm } from "../hooks/useForm";

const STARS = [
  { x: "10%",  y: "15%", r: 2,   delay: "0s",   dur: "2.2s" },
  { x: "80%",  y: "10%", r: 1.5, delay: "0.5s", dur: "1.9s" },
  { x: "88%",  y: "65%", r: 2.5, delay: "0.9s", dur: "2.6s" },
  { x: "6%",   y: "78%", r: 1.8, delay: "1.3s", dur: "2.0s" },
  { x: "52%",  y: "90%", r: 1.5, delay: "0.7s", dur: "2.4s" },
  { x: "35%",  y: "6%",  r: 1,   delay: "1.6s", dur: "2.1s" },
  { x: "93%",  y: "40%", r: 2,   delay: "0.3s", dur: "2.8s" },
  { x: "20%",  y: "50%", r: 1.2, delay: "1.1s", dur: "1.7s" },
  { x: "65%",  y: "28%", r: 1.8, delay: "0.8s", dur: "2.3s" },
  { x: "45%",  y: "72%", r: 1,   delay: "0.2s", dur: "3.0s" },
];

function Ghost({ mousePos, watching, size = 90, color = "#8b5cf6", animName, animDur = "3s", animDelay = "0s" }) {
  const ref = useRef(null);
  const [eye, setEye] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const angle = Math.atan2(mousePos.y - cy, mousePos.x - cx);
    const r = 4.5;
    if (watching) {
      setEye({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
    } else {
      setEye({ x: Math.cos(angle + Math.PI) * r * 0.6, y: -Math.abs(Math.sin(angle) * r) - 1.5 });
    }
  }, [mousePos, watching]);

  const dark = "#0d0b16";

  return (
    <div
      ref={ref}
      style={{ animation: `${animName} ${animDur} ease-in-out ${animDelay} infinite`, display: "inline-block" }}
    >
      <svg viewBox="0 0 80 96" width={size} height={size * 1.2} style={{ overflow: "visible", display: "block" }}>
        <ellipse cx="40" cy="97" rx="22" ry="5" fill={color} opacity="0.2" />
        <path
          d="M12,48 Q12,14 40,14 Q68,14 68,48 L68,76 Q62,69 56,76 Q50,83 44,76 Q38,69 32,76 Q26,83 20,76 Q14,69 12,76 Z"
          fill={color}
        />
        <ellipse cx="6"  cy="54" rx="5" ry="9" fill={color} transform="rotate(-22,6,54)" />
        <ellipse cx="74" cy="54" rx="5" ry="9" fill={color} transform="rotate(22,74,54)" />
        <ellipse cx="28" cy="44" rx="12" ry="12" fill="white" opacity="0.95" />
        <ellipse cx="52" cy="44" rx="12" ry="12" fill="white" opacity="0.95" />
        {!watching ? (
          <>
            <path d="M16,44 Q28,36 40,44" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M40,44 Q52,36 64,44" stroke={dark} strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx="19" cy="56" rx="8" ry="4" fill="#f472b6" opacity="0.5" />
            <ellipse cx="61" cy="56" rx="8" ry="4" fill="#f472b6" opacity="0.5" />
            {size > 110 && (
              <path d="M67,28 Q70,21 67,15 Q64,21 67,28 Z" fill="#a78bfa" opacity="0.85" />
            )}
          </>
        ) : (
          <>
            <circle cx={28 + eye.x} cy={44 + eye.y} r="7"   fill={dark} />
            <circle cx={28 + eye.x + 2.2} cy={44 + eye.y - 2.2} r="2.5" fill="white" opacity="0.85" />
            <circle cx={52 + eye.x} cy={44 + eye.y} r="7"   fill={dark} />
            <circle cx={52 + eye.x + 2.2} cy={44 + eye.y - 2.2} r="2.5" fill="white" opacity="0.85" />
          </>
        )}
      </svg>
    </div>
  );
}

export default function Login() {
  const [form, onChange] = useForm({ identifier: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const navigate = useNavigate();
  const { token, login, loading: authLoading } = useAuth();

  useEffect(() => { if (token) navigate("/"); }, [token, navigate]);

  useEffect(() => {
    const fn = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  if (authLoading) return null;

  async function handleLogin(e) {
    e.preventDefault();
    if (!form.identifier.trim() || !form.password.trim()) {
      swal.fire({ icon: "warning", title: "Campos obrigatórios", text: "Preencha sua matrícula e senha." });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { matricula: form.identifier, senha: form.password });
      login(res.data.token, res.data.usuario);
      navigate("/");
    } catch (err) {
      swal.fire({
        icon: "error",
        title: "Falha ao entrar",
        text: err.response?.data?.erro || err.response?.data?.mensagem || "Credenciais inválidas.",
      });
    } finally {
      setLoading(false);
    }
  }

  const watching = !showPass;

  return (
    <>
      <style>{`
        @keyframes ghost-float-a {
          0%,100% { transform: translateY(0px)  rotate(-3deg);   }
          50%      { transform: translateY(-20px) rotate(3deg);    }
        }
        @keyframes ghost-float-b {
          0%,100% { transform: translateY(0px)  rotate(2deg);    }
          50%      { transform: translateY(-13px) rotate(-2deg);   }
        }
        @keyframes ghost-float-c {
          0%,100% { transform: translateY(0px)  rotate(-1.5deg); }
          50%      { transform: translateY(-24px) rotate(2deg);    }
        }
        @keyframes ghost-float-d {
          0%,100% { transform: translateY(0px)  rotate(3deg);    }
          50%      { transform: translateY(-10px) rotate(-3deg);   }
        }
        @keyframes star-pulse {
          0%,100% { opacity: 0.15; }
          50%      { opacity: 0.9;  }
        }
        @keyframes glow-breathe {
          0%,100% { opacity: 0.35; transform: translate(-50%,-50%) scale(1);    }
          50%      { opacity: 0.55; transform: translate(-50%,-50%) scale(1.12); }
        }
        @keyframes bar-shimmer {
          0%   { background-position: 200% center;  }
          100% { background-position: -200% center; }
        }
        .login-left {
          display: none;
        }
        @media (min-width: 820px) {
          .login-left {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
          }
        }
      `}</style>

      <div style={{ minHeight: "100vh", display: "flex", background: "var(--bg-main)" }}>

        <div
          className="login-left"
          style={{ background: "linear-gradient(155deg, #0f0c1e 0%, #1b1838 55%, #0d0b16 100%)" }}
        >
          <div style={{
            position: "absolute", width: 520, height: 520,
            background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
            top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            animation: "glow-breathe 4s ease-in-out infinite",
            pointerEvents: "none",
          }} />

          <div style={{
            position: "absolute", width: 280, height: 280,
            background: "radial-gradient(circle, rgba(196,181,253,0.1) 0%, transparent 70%)",
            top: "22%", left: "28%",
            pointerEvents: "none",
          }} />

          <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            {STARS.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#c4b5fd"
                style={{ animation: `star-pulse ${s.dur} ${s.delay} ease-in-out infinite` }} />
            ))}
          </svg>

          <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
            <ellipse cx="50%" cy="50%" rx="40%" ry="28%" fill="none"
              stroke="rgba(139,92,246,0.07)" strokeWidth="1.5" strokeDasharray="9 7" />
            <ellipse cx="50%" cy="50%" rx="26%" ry="18%" fill="none"
              stroke="rgba(167,139,250,0.05)" strokeWidth="1" />
          </svg>

          <div style={{ position: "absolute", left: "14%", top: "16%" }}>
            <Ghost mousePos={mousePos} watching={watching} size={70}
              color="#a78bfa" animName="ghost-float-b" animDur="2.9s" animDelay="0.4s" />
          </div>

          <div style={{ position: "absolute", right: "10%", top: "20%" }}>
            <Ghost mousePos={mousePos} watching={watching} size={60}
              color="#c084fc" animName="ghost-float-d" animDur="2.4s" animDelay="1.2s" />
          </div>

          <div style={{ position: "absolute", left: "50%", top: "44%", transform: "translate(-50%, -50%)" }}>
            <Ghost mousePos={mousePos} watching={watching} size={145}
              color="#8b5cf6" animName="ghost-float-a" animDur="3.3s" animDelay="0s" />
          </div>

          <div style={{ position: "absolute", right: "16%", bottom: "20%" }}>
            <Ghost mousePos={mousePos} watching={watching} size={65}
              color="#7c3aed" animName="ghost-float-c" animDur="3.7s" animDelay="0.8s" />
          </div>

          <svg aria-hidden viewBox="0 0 320 24"
            style={{ position: "absolute", bottom: "8rem", width: "60%", pointerEvents: "none", left: "20%" }}>
            <ellipse cx="160" cy="12" rx="130" ry="8" fill="rgba(139,92,246,0.1)" />
            <ellipse cx="160" cy="9"  rx="85"  ry="4" fill="rgba(167,139,250,0.07)" />
          </svg>

          <p style={{
            position: "absolute", bottom: "2rem",
            fontFamily: "var(--font-mono)", fontSize: "0.8rem",
            color: "var(--text-2)", opacity: 0.75, letterSpacing: "0.02em",
            transition: "opacity 0.3s",
          }}>
            {watching ? "👀 te observando com atenção..." : "😳 não olhei nada, juro..."}
          </p>
        </div>

        <div style={{
          width: "100%", maxWidth: "440px",
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "3rem 2.5rem",
          background: "var(--bg-surface)",
          borderLeft: "1px solid rgba(255,255,255,0.05)",
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "3px",
            background: "linear-gradient(90deg, #7c3aed, #c084fc, #a78bfa, #7c3aed)",
            backgroundSize: "300% 100%",
            animation: "bar-shimmer 3s linear infinite",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "2.5rem" }}>
            <span style={{ fontSize: "1.4rem" }}>🎮</span>
            <span style={{ fontSize: "1.05rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
              TaTaKazim
            </span>
          </div>

          <h2 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.35rem", letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
            Entrar na conta
          </h2>
          <p style={{ fontSize: "0.84rem", color: "var(--text-muted)", marginBottom: "2rem", lineHeight: 1.5 }}>
            Use sua matrícula e senha institucional.
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
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
                  name="identifier"
                  placeholder="00-00000"
                  pattern="\d{2}-\d{5}"
                  title="Formato esperado: 00-00000"
                  value={form.identifier}
                  onChange={onChange}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Senha</label>
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
                  placeholder="••••••••"
                  value={form.password}
                  onChange={onChange}
                  autoComplete="current-password"
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
                  onMouseEnter={e => { if (!showPass) e.currentTarget.style.color = "var(--text-secondary)"; }}
                  onMouseLeave={e => { if (!showPass) e.currentTarget.style.color = "var(--text-muted)"; }}
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
                  Entrando...
                </>
              ) : "Entrar →"}
            </button>
          </form>

          <div style={{
            marginTop: "2rem", padding: "1rem",
            background: "var(--bg-card)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "var(--radius-sm)", textAlign: "center",
          }}>
            <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "0.4rem" }}>
              Primeiro acesso?
            </p>
            <Link
              to="/first-access"
              style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--accent-light)", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.color = "var(--indigo)"}
              onMouseLeave={e => e.currentTarget.style.color = "var(--accent-light)"}
            >
              Defina sua senha aqui →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
