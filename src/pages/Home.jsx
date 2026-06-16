import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import useRequestData from "../hooks/useRequestData";
import Layout from "../components/Layout";
import Chip from "../components/Chip";
import GameSection from "../components/GameSection";
import SidebarSection from "../components/SidebarSection";
import { getGameGradient, getGameInitials } from "../utils/gameColors";
import { GlobalStateContext } from "../global/GlobalStateContext";

export default function Home() {
  const { states } = useContext(GlobalStateContext);
  const { generos } = states;
  const { data: destaquesData, isLoading: loading } = useRequestData(
    () => api.get("/jogos/destaques").then((r) => r.data || {}),
    []
  );
  const recentes = destaquesData?.recentes || [];
  const topAvaliados = destaquesData?.topAvaliados || [];
  const populares = destaquesData?.populares || [];

  const heroGame = topAvaliados[0] || recentes[0] || null;
  const allGames = [...recentes, ...topAvaliados, ...populares];
  const destaques = topAvaliados.slice(0, 5);
  const totalJogos = [...new Map(allGames.map((g) => [g.id, g])).values()]
    .length;

  return (
    <Layout>
      <div className="home-layout">
        <LeftSidebar generos={generos} totalJogos={totalJogos} />

        <main className="home-main">
          {loading ? (
            <HomeSkeleton />
          ) : (
            <>
              {heroGame && <HeroBanner game={heroGame} />}
              {recentes.length > 0 && (
                <GameSection
                  title="Recentes"
                  subtitle="Lançamentos das últimas semanas"
                  games={recentes}
                />
              )}
              {topAvaliados.length > 0 && (
                <GameSection title="Mais Avaliados" games={topAvaliados} />
              )}
              {populares.length > 0 && (
                <GameSection title="Populares" games={populares} />
              )}
            </>
          )}
        </main>

        {!loading && destaques.length > 0 && (
          <div className="home-sidebar-right">
            <RightSidebar games={destaques} activeId={heroGame?.id} />
          </div>
        )}
      </div>
    </Layout>
  );
}

function LeftSidebar({ generos, totalJogos }) {
  const navigate = useNavigate();

  return (
    <aside className="home-sidebar-left">
      <SidebarSection label="Categorias">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <SidebarCategory
            label="Todos os jogos"
            count={totalJogos}
            active
            onClick={() => navigate("/catalogo")}
            icon="✦"
          />
          {generos.map((g) => (
            <SidebarCategory
              key={g.id}
              label={g.nome}
              count={g._count?.jogos}
              onClick={() =>
                navigate("/catalogo", { state: { genreId: Number(g.id) } })
              }
            />
          ))}
        </ul>
      </SidebarSection>

      <SidebarSection label="Atalhos">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <ShortcutLink
            icon="⊞"
            label="Biblioteca"
            onClick={() => navigate("/biblioteca")}
          />
          <ShortcutLink
            icon="♡"
            label="Wishlist"
            onClick={() => navigate("/wishlist")}
          />
          <ShortcutLink
            icon="+"
            label="Criar jogo"
            onClick={() => navigate("/criar-jogo")}
            accent
          />
        </ul>
      </SidebarSection>
    </aside>
  );
}

function SidebarCategory({ label, count, active, onClick, icon }) {
  return (
    <li>
      <button
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "7px 10px",
          background: active ? "rgba(139,92,246,0.15)" : "none",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          color: active ? "var(--text-primary)" : "var(--text-secondary)",
          fontSize: "0.875rem",
          fontWeight: active ? 600 : 400,
          fontFamily: "var(--font-sans)",
          textAlign: "left",
          marginBottom: "2px",
        }}
        onMouseEnter={(e) => {
          if (!active)
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.background = "none";
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {icon && (
            <span style={{ color: "var(--color-primary)", fontSize: "0.7rem" }}>
              {icon}
            </span>
          )}
          {label}
        </span>
        {count !== undefined && (
          <span
            style={{
              fontSize: "0.72rem",
              color: active ? "#fff" : "var(--text-muted)",
              background: active
                ? "var(--color-primary)"
                : "rgba(255,255,255,0.07)",
              padding: "1px 6px",
              borderRadius: "10px",
              fontWeight: 600,
            }}
          >
            {count}
          </span>
        )}
      </button>
    </li>
  );
}

function ShortcutLink({ icon, label, onClick, accent }) {
  return (
    <li>
      <button
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          padding: "7px 10px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: accent ? "var(--color-primary)" : "var(--text-secondary)",
          fontSize: "0.875rem",
          fontFamily: "var(--font-sans)",
          textAlign: "left",
          borderRadius: "6px",
          marginBottom: "2px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "none";
        }}
      >
        <span style={{ fontSize: "0.85rem" }}>{icon}</span>
        {label}
      </button>
    </li>
  );
}

function HeroBanner({ game }) {
  const navigate = useNavigate();
  const initials = getGameInitials(game.titulo);
  const gradient = getGameGradient(game.id);

  return (
    <div
      style={{
        borderRadius: "16px",
        background: gradient,
        padding: "36px 40px",
        position: "relative",
        overflow: "hidden",
        marginBottom: "32px",
        minHeight: "240px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: "-10px",
          top: "50%",
          transform: "translateY(-50%)",
          fontSize: "200px",
          fontWeight: 800,
          color: "rgba(255,255,255,0.12)",
          userSelect: "none",
          lineHeight: 1,
          fontFamily: "var(--font-sans)",
          letterSpacing: "-8px",
        }}
      >
        {initials}
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "60%" }}>
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <Chip>⭐ Destaque</Chip>
          {game.generos?.slice(0, 2).map((g) => (
            <Chip key={g.id}>{g.nome}</Chip>
          ))}
        </div>

        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 800,
            color: "#fff",
            margin: "0 0 10px",
            lineHeight: 1.1,
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          {game.titulo}
        </h1>

        {game.descricao && (
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              margin: "0 0 22px",
              fontSize: "0.95rem",
              lineHeight: 1.5,
              maxWidth: "480px",
            }}
          >
            {game.descricao}
          </p>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => navigate(`/jogos/${game.id}`)}
            className="btn btn-primary"
            style={{ fontSize: "0.9rem" }}
          >
            🛒 Ver na loja
          </button>
          {game.mediaNotas !== undefined && game.mediaNotas !== null && (
            <span
              style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.9rem" }}
            >
              ★ {Number(game.mediaNotas).toFixed(1)}
              {game.contagens?.reviews || game._count?.reviews
                ? ` · ${(game.contagens?.reviews ?? game._count?.reviews).toLocaleString("pt-BR")} reviews`
                : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


function RightSidebar({ games, activeId }) {
  const navigate = useNavigate();

  return (
    <aside style={{ width: "100%" }}>
      <p
        style={{
          fontSize: "0.65rem",
          fontWeight: 700,
          color: "var(--text-muted)",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginBottom: "12px",
        }}
      >
        Em Destaque
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {games.map((game) => {
          const active = game.id === activeId;
          return (
            <button
              key={game.id}
              onClick={() => navigate(`/jogos/${game.id}`)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                borderRadius: "10px",
                background: active
                  ? "rgba(139,92,246,0.1)"
                  : "rgba(255,255,255,0.03)",
                border: active
                  ? "1px solid rgba(139,92,246,0.3)"
                  : "1px solid rgba(255,255,255,0.06)",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.15s, border-color 0.15s",
                fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                }
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: getGameGradient(game.id),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  color: "rgba(255,255,255,0.85)",
                  flexShrink: 0,
                }}
              >
                {getGameInitials(game.titulo)}
              </div>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {game.titulo}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.75rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {game.desenvolvedora}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function HomeSkeleton() {
  return (
    <>
      <div
        className="skeleton"
        style={{ height: "240px", borderRadius: "16px", marginBottom: "32px" }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: "220px", borderRadius: "12px" }}
          />
        ))}
      </div>
    </>
  );
}
