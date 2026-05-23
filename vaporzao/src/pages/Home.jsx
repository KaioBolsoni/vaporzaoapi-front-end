import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Home() {
  const [recentes, setRecentes] = useState([]);
  const [topAvaliados, setTopAvaliados] = useState([]);
  const [populares, setPopulares] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        setError("");
        const [highlightsRes, userRes] = await Promise.all([
          api.get("/jogos/destaques"),
          api.get("/auth/me"),
        ]);

        const { recentes, topAvaliados, populares } = highlightsRes.data;
        setRecentes(recentes || []);
        setTopAvaliados(topAvaliados || []);
        setPopulares(populares || []);

        setUser(userRes.data);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(
          "Failed to load highlights or user info. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  if (loading) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        <h2>Loading highlights and user profile...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif", color: "red" }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{ padding: "10px" }}
        >
          Retry
        </button>
      </div>
    );
  }

  const renderGameCard = (game, showRating = false) => {
    return (
      <div
        key={game.id}
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          backgroundColor: "#f9f9f9",
          color: "#333",
        }}
      >
        {game.capaUrl && (
          <img
            src={game.capaUrl}
            alt={game.titulo}
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "4px",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&auto=format&fit=crop";
            }}
          />
        )}
        <h3 style={{ margin: "0", fontSize: "18px" }}>{game.titulo}</h3>

        <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
          <strong>Developer:</strong> {game.desenvolvedora}
        </p>

        {game.generos && game.generos.length > 0 && (
          <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
            <strong>Genres:</strong>{" "}
            {game.generos.map((g) => g.nome).join(", ")}
          </p>
        )}

        {showRating && game.mediaNotas !== undefined && (
          <p style={{ margin: "0", fontSize: "14px", color: "orange" }}>
            <strong>Rating:</strong> ★ {game.mediaNotas.toFixed(1)} / 10
          </p>
        )}

        <div
          style={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: "bold" }}>
            {game.preco === 0 ? "Free" : `R$ ${game.preco.toFixed(2)}`}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <Navbar user={user} onLogout={handleLogout} />

      <section style={{ marginBottom: "40px" }}>
        <h2
          style={{
            borderBottom: "1px solid #ccc",
            paddingBottom: "5px",
            marginBottom: "15px",
          }}
        >
          Recent Releases
        </h2>
        {recentes.length === 0 ? (
          <p>No recent games found.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {recentes.map((game) => renderGameCard(game))}
          </div>
        )}
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2
          style={{
            borderBottom: "1px solid #ccc",
            paddingBottom: "5px",
            marginBottom: "15px",
          }}
        >
          Top Rated
        </h2>
        {topAvaliados.length === 0 ? (
          <p>No highly rated games found.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {topAvaliados.map((game) => renderGameCard(game, true))}
          </div>
        )}
      </section>

      {/* Populares */}
      <section style={{ marginBottom: "40px" }}>
        <h2
          style={{
            borderBottom: "1px solid #ccc",
            paddingBottom: "5px",
            marginBottom: "15px",
          }}
        >
          Popular
        </h2>
        {populares.length === 0 ? (
          <p>No popular games found.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {populares.map((game) => renderGameCard(game))}
          </div>
        )}
      </section>
    </div>
  );
}
