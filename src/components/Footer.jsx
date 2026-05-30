import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "1.5rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "auto",
      }}
    >
      <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "1rem" }}>🎮</span>
        <span style={{ fontSize: "0.95rem", fontWeight: 800 }}>
          <span style={{ color: "var(--color-primary)" }}>TaTa</span>
          <span style={{ color: "var(--text-primary)" }}>Kazim</span>
        </span>
      </Link>
      <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "1px" }}>
        TATAKAZIM JOGOS · PROJETO ACADÊMICO · 2026
      </p>
    </footer>
  );
}
