import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function SearchBar() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [games, setGames] = useState([]);

  useEffect(() => {
    api.get("/jogos?limite=100")
      .then((res) => {
        const raw = res.data;
        const list = Array.isArray(raw) ? raw : raw?.itens || [];
        setGames(list);
      })
      .catch((err) => console.error(err));
  }, []);

  const filtered = query.trim()
    ? games
        .filter((g) => (g.titulo || "").toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)
    : [];

  function handleSearch(e) {
    e.preventDefault();
    navigate("/catalogo", { state: { search: query } });
    setQuery("");
  }

  function handleItemClick(id) {
    navigate(`/jogos/${id}`);
    setQuery("");
  }

  return (
    <div style={{ flex: 1, maxWidth: "460px", position: "relative" }}>
      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "var(--bg-surface)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "8px",
          padding: "0 12px",
          height: "36px",
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: "var(--text-muted)", flexShrink: 0 }}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar jogos..."
          style={{
            background: "none",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontSize: "0.85rem",
            width: "100%",
            fontFamily: "var(--font-sans)",
          }}
        />
      </form>

      {filtered.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "42px",
            left: 0,
            right: 0,
            background: "var(--bg-surface)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
            zIndex: 100,
            overflow: "hidden",
          }}
        >
          {filtered.map((g) => (
            <div
              key={g.id}
              onClick={() => handleItemClick(g.id)}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                fontSize: "0.85rem",
                color: "var(--text-primary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "none";
              }}
            >
              {g.titulo}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
