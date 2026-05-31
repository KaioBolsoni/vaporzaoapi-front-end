import { useNavigate } from "react-router-dom";
import GameCover from "./GameCover";

function isWithin30Days(date) {
  if (!date) return false;
  const diff = Date.now() - new Date(date).getTime();
  return diff >= 0 && diff < 30 * 24 * 60 * 60 * 1000;
}

export default function GameCard({ game, variant = "catalog" }) {
  const navigate = useNavigate();
  const reviewCount = game._count?.reviews ?? game.contagens?.reviews ?? 0;
  const libCount = game._count?.bibliotecas ?? game.contagens?.bibliotecas ?? 0;

  return (
    <div
      onClick={() => navigate(`/jogos/${game.id}`)}
      style={{
        cursor: "pointer",
        borderRadius: "10px",
        overflow: "hidden",
        background: "var(--bg-surface)",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.5)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
      }}
    >
      {/* Cover image */}
      <div style={{ position: "relative", height: "180px", width: "100%" }}>
        <GameCover game={game} />
        <div style={{ position: "absolute", top: "8px", left: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {isWithin30Days(game.createdAt) && (
            <span style={{
              background: "var(--color-primary)",
              color: "#fff",
              fontSize: "0.6rem",
              fontWeight: 800,
              padding: "2px 7px",
              borderRadius: "20px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              NOVO
            </span>
          )}
          {isWithin30Days(game.lancamento) && (
            <span style={{
              background: "#10b981",
              color: "#fff",
              fontSize: "0.6rem",
              fontWeight: 800,
              padding: "2px 7px",
              borderRadius: "20px",
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>
              LANÇAMENTO
            </span>
          )}
        </div>
        {game.mediaNotas !== undefined && game.mediaNotas !== null && (
          <span
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(6px)",
              color: "#f59e0b",
              fontSize: "0.72rem",
              fontWeight: 700,
              padding: "2px 7px",
              borderRadius: "20px",
            }}
          >
            ★ {Number(game.mediaNotas).toFixed(1)}
          </span>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px", flex: 1, display: "flex", flexDirection: "column", gap: "5px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "6px" }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "var(--text-primary)",
              lineHeight: 1.3,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {game.titulo}
          </span>
        </div>

        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--text-muted)" }}>
          {game.desenvolvedora}
        </p>

        {variant === "catalog" && (
          <>
            {game.generos?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "3px" }}>
                {game.generos.slice(0, 3).map((g) => (
                  <span
                    key={g.id}
                    style={{
                      fontSize: "0.67rem",
                      background: "rgba(255,255,255,0.06)",
                      color: "var(--text-secondary)",
                      padding: "2px 7px",
                      borderRadius: "20px",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    {g.nome}
                  </span>
                ))}
              </div>
            )}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "auto",
                paddingTop: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  background: game.preco === 0 ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.07)",
                  color: game.preco === 0 ? "#10b981" : "var(--text-primary)",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  border: `1px solid ${game.preco === 0 ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {game.preco === 0
                  ? "Grátis"
                  : `R$ ${Number(game.preco).toFixed(2).replace(".", ",")}`}
              </span>

              <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                {reviewCount > 0 ? `${reviewCount}` : "—"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
