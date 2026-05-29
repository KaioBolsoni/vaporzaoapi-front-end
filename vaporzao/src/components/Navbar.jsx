import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SearchBar from "./SearchBar";

function getUserHandle(nome = "") {
  const parts = nome.toLowerCase().split(" ").filter(Boolean);
  if (parts.length === 0) return "user";
  const first = parts[0];
  if (parts.length === 1) return first;
  const last = parts[parts.length - 1];
  return `${first}.${last.slice(0, 3)}`;
}

function getUserInitials(nome = "") {
  const parts = nome.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const NAV_LINKS = [
    { to: "/", label: "Loja" },
    { to: "/catalogo", label: "Catálogo" },
    { to: "/biblioteca", label: "Biblioteca" },
  ];

  return (
    <nav
      style={{
        height: "58px",
        background: "var(--bg-main)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        padding: "0 1.5rem",
        gap: "1.5rem",
        position: "sticky",
        top: 0,
        zIndex: 200,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "7px",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "1.05rem" }}>🎮</span>
        <span style={{ fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.5px" }}>
          <span style={{ color: "var(--color-primary)" }}>TaTa</span>
          <span style={{ color: "var(--text-primary)" }}>Kazim</span>
        </span>
      </Link>

      {/* Nav links */}
      <div style={{ display: "flex", gap: "0" }}>
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              style={{
                textDecoration: "none",
                fontSize: "0.88rem",
                fontWeight: isActive ? 600 : 400,
                color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                padding: "0 12px",
                height: "58px",
                display: "flex",
                alignItems: "center",
                borderBottom: isActive
                  ? "2px solid var(--color-primary)"
                  : "2px solid transparent",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* Search bar */}
      <SearchBar />

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginLeft: "auto" }}>
        {user && (
          <Link
            to={`/perfil/${user.matricula}`}
            style={{
              color: "var(--text-muted)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              padding: "6px",
              borderRadius: "6px",
            }}
            title="Wishlist"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </Link>
        )}

        {user && (
          <div ref={dropdownRef} style={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "8px",
                color: "var(--text-primary)",
                fontFamily: "var(--font-sans)",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--color-primary), #6366f1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                {getUserInitials(user.nome)}
              </div>
              <span style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                {getUserHandle(user.nome)}
              </span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  right: 0,
                  background: "var(--bg-surface)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "10px",
                  padding: "4px",
                  minWidth: "170px",
                  boxShadow: "var(--shadow-lg)",
                  zIndex: 300,
                }}
              >
                <DropdownItem onClick={() => { navigate(`/perfil/${user.matricula}`); setDropdownOpen(false); }}>
                  👤 Meu Perfil
                </DropdownItem>
                <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0" }} />
                <DropdownItem onClick={handleLogout} danger>
                  🚪 Sair
                </DropdownItem>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

function DropdownItem({ onClick, children, danger }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "block",
        width: "100%",
        padding: "8px 12px",
        background: "none",
        border: "none",
        textAlign: "left",
        cursor: "pointer",
        color: danger ? "var(--color-error)" : "var(--text-primary)",
        fontSize: "0.875rem",
        borderRadius: "6px",
        fontFamily: "var(--font-sans)",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
    >
      {children}
    </button>
  );
}
