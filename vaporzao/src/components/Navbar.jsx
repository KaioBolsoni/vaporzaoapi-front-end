import React from "react";

export default function Navbar({ user, onLogout }) {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #eee",
        paddingBottom: "10px",
        marginBottom: "30px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ margin: 0 }}>Vaporzão 🎮</h1>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ textAlign: "right", fontSize: "14px" }}>
            <div style={{ fontWeight: "bold" }}>{user.nome}</div>
            <div style={{ color: "#666" }}>
              Matriculation: {user.matricula} ({user.role})
            </div>
            {user._count && (
              <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
                Library: {user._count.biblioteca} | Wishlist: {user._count.wishlist}
              </div>
            )}
          </div>

          <button
            onClick={onLogout}
            style={{
              padding: "8px 16px",
              fontSize: "14px",
              cursor: "pointer",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "4px",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
