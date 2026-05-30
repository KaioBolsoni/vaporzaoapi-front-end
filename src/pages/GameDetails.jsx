import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";
import GameCover from "../components/GameCover";
import { getGameGradient, toTitleCase } from "../utils/gameColors";
import swal from "../utils/swal";

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [gameRes, statusRes] = await Promise.all([
          api.get(`/jogos/${id}`),
          api.get(`/jogos/${id}/status`),
        ]);
        setGame(gameRes.data);
        setStatus(statusRes.data);
      } catch (err) {
        console.error("GameDetails fetch error:", err);
        setError(
          err.response?.status === 404
            ? "Jogo não encontrado."
            : "Erro ao carregar detalhes do jogo.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  return (
    <Layout>
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "2rem 1.5rem 3rem",
        }}
      >
        {loading ? (
          <DetailsSkeleton />
        ) : error ? (
          <ErrorState
            message={error}
            onBack={() => navigate("/catalogo")}
            backLabel="Voltar ao catálogo"
          />
        ) : (
          <div className="animate-slide-up">
            <HeroSection game={game} status={status} />
            {game.imagens?.length > 0 && (
              <GallerySection images={game.imagens} />
            )}
            {game.conquistas?.length > 0 && (
              <AchievementsSection conquistas={game.conquistas} />
            )}
            {game.reviews?.length > 0 && (
              <ReviewsSection
                reviews={game.reviews}
                onUserClick={(matricula) => navigate(`/perfil/${matricula}`)}
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function HeroSection({ game, status }) {
  const navigate = useNavigate();
  const gradient = getGameGradient(game.id);

  const [naWishlist, setNaWishlist] = useState(false);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  useEffect(() => {
    if (status) {
      setNaWishlist(status.naWishlist);
    }
  }, [status]);

  async function toggleWishlist() {
    if (loadingWishlist) return;
    setLoadingWishlist(true);
    try {
      if (naWishlist) {
        await api.delete(`/wishlist/${game.id}`);
      } else {
        await api.post(`/wishlist/${game.id}`);
      }
      setNaWishlist((prev) => !prev);
    } catch (err) {
      swal.fire({
        icon: "error",
        title: "Erro",
        text:
          err.response?.data?.erro || "Não foi possível atualizar a wishlist.",
      });
    } finally {
      setLoadingWishlist(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        marginBottom: "2.5rem",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          width: "260px",
          height: "340px",
          borderRadius: "14px",
          overflow: "hidden",
          flexShrink: 0,
          boxShadow: `0 20px 60px rgba(0,0,0,0.5)`,
        }}
      >
        <GameCover game={game} fontSize="4rem" />
      </div>

      <div
        style={{
          flex: 1,
          minWidth: "240px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              margin: "0 0 4px",
              fontSize: "2rem",
              fontWeight: 800,
              lineHeight: 1.15,
            }}
          >
            {game.titulo}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.9rem",
              color: "var(--text-muted)",
            }}
          >
            por {game.desenvolvedora}
          </p>
        </div>

        {game.generos?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {game.generos.map((g) => (
              <span
                key={g.id}
                onClick={() =>
                  navigate("/catalogo", { state: { genreId: Number(g.id) } })
                }
                style={{
                  fontSize: "0.75rem",
                  background: "rgba(139,92,246,0.12)",
                  color: "var(--color-primary)",
                  border: "1px solid rgba(139,92,246,0.25)",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "background 0.15s, transform 0.1s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139,92,246,0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(139,92,246,0.12)";
                }}
              >
                {g.nome}
              </span>
            ))}
          </div>
        )}

        {game.mediaNotas !== undefined && game.mediaNotas !== null && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#f59e0b", fontSize: "1.3rem" }}>★</span>
            <span style={{ fontSize: "1.3rem", fontWeight: 700 }}>
              {Number(game.mediaNotas).toFixed(1)}
            </span>
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              /10
            </span>
          </div>
        )}

        <div>
          <span
            style={{
              fontSize: "1.8rem",
              fontWeight: 800,
              color:
                game.preco === 0
                  ? "var(--color-success)"
                  : "var(--text-primary)",
            }}
          >
            {game.preco === 0
              ? "Grátis"
              : `R$ ${Number(game.preco).toFixed(2)}`}
          </span>
        </div>

        {status && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            {status.naBiblioteca ? (
              <Badge
                color="#10b981"
                bg="rgba(16,185,129,0.1)"
                border="rgba(16,185,129,0.25)"
              >
                ✓ Na biblioteca
              </Badge>
            ) : (
              <Badge
                color="#64748b"
                bg="rgba(255,255,255,0.05)"
                border="rgba(255,255,255,0.1)"
              >
                ✕ Não na biblioteca
              </Badge>
            )}

            <button
              onClick={toggleWishlist}
              disabled={loadingWishlist}
              style={{
                background: naWishlist
                  ? "rgba(245,158,11,0.12)"
                  : "transparent",
                color: "#f59e0b",
                border: "1px solid rgba(245,158,11,0.35)",
                padding: "4px 12px",
                borderRadius: "20px",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "0.78rem",
                fontFamily: "var(--font-sans)",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.2s",
              }}
            >
              {naWishlist ? "♥ Na wishlist" : "♡ Adicionar à wishlist"}
            </button>

            {status.reviewFeita || status.temReview ? (
              <Badge
                color="var(--color-primary)"
                bg="rgba(139,92,246,0.1)"
                border="rgba(139,92,246,0.25)"
              >
                ★ Avaliado
              </Badge>
            ) : (
              <Badge
                color="#64748b"
                bg="rgba(255,255,255,0.05)"
                border="rgba(255,255,255,0.1)"
              >
                ☆ Não avaliado
              </Badge>
            )}
          </div>
        )}

        {game.descricao && (
          <p
            style={{
              margin: 0,
              color: "var(--text-secondary)",
              lineHeight: 1.75,
              fontSize: "0.93rem",
            }}
          >
            {game.descricao}
          </p>
        )}
      </div>
    </div>
  );
}

function Badge({ color, bg, border, children }) {
  return (
    <span
      style={{
        fontSize: "0.78rem",
        fontWeight: 600,
        color,
        background: bg,
        border: `1px solid ${border}`,
        padding: "4px 12px",
        borderRadius: "20px",
      }}
    >
      {children}
    </span>
  );
}

function GallerySection({ images }) {
  return (
    <SectionBlock title="Galeria">
      <div
        style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingBottom: "8px",
        }}
      >
        {images.map((img, i) => (
          <img
            key={img.id ?? i}
            src={img.url}
            alt={`Screenshot ${i + 1}`}
            onError={(e) => {
              e.target.style.display = "none";
            }}
            style={{
              height: "190px",
              borderRadius: "8px",
              flexShrink: 0,
              objectFit: "cover",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          />
        ))}
      </div>
    </SectionBlock>
  );
}

function AchievementsSection({ conquistas }) {
  return (
    <SectionBlock title={`Conquistas · ${conquistas.length}`}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "10px",
        }}
      >
        {conquistas.map((c) => (
          <div
            key={c.id}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px",
              padding: "14px",
            }}
          >
            <div
              style={{
                fontWeight: 600,
                fontSize: "0.875rem",
                marginBottom: "4px",
                display: "flex",
                gap: "8px",
              }}
            >
              🏆 {c.titulo}
            </div>
            {c.descricao && (
              <p
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                }}
              >
                {c.descricao}
              </p>
            )}
          </div>
        ))}
      </div>
    </SectionBlock>
  );
}

function ReviewsSection({ reviews, onUserClick }) {
  return (
    <SectionBlock title={`Reviews · ${reviews.length}`}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {reviews.map((r) => (
          <div
            key={r.id}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px",
              padding: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <button
                onClick={() =>
                  r.autor?.matricula && onUserClick(r.autor.matricula)
                }
                style={{
                  background: "none",
                  border: "none",
                  cursor: r.autor?.matricula ? "pointer" : "default",
                  color: "var(--color-secondary)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  padding: 0,
                  fontFamily: "var(--font-sans)",
                }}
              >
                {toTitleCase(r.autor?.nome ?? "Usuário")}
              </button>
              <span
                style={{
                  color: "#f59e0b",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                }}
              >
                ★ {r.nota}/10
              </span>
            </div>
            {r.texto && (
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.65,
                }}
              >
                "{r.texto}"
              </p>
            )}
          </div>
        ))}
      </div>
    </SectionBlock>
  );
}

function SectionBlock({ title, children }) {
  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <h2
        style={{
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "14px",
          paddingBottom: "10px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function ErrorState({ message, onBack, backLabel }) {
  return (
    <div
      style={{
        padding: "3rem",
        textAlign: "center",
        background: "var(--bg-surface)",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <p style={{ color: "var(--color-error)", marginBottom: "1rem" }}>
        {message}
      </p>
      <button className="btn btn-outline" onClick={onBack}>
        {backLabel}
      </button>
    </div>
  );
}

function DetailsSkeleton() {
  return (
    <div style={{ display: "flex", gap: "2rem", marginBottom: "2.5rem" }}>
      <div
        className="skeleton"
        style={{
          width: "260px",
          height: "340px",
          borderRadius: "14px",
          flexShrink: 0,
        }}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {[200, 120, 80, 60, 300].map((w, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ width: `${w}px`, height: "18px", borderRadius: "6px" }}
          />
        ))}
      </div>
    </div>
  );
}
