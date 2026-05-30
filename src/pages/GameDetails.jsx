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
  const [showReviewModal, setShowReviewModal] = useState(false);

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

  useEffect(() => {
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
            <HeroSection
              game={game}
              status={status}
              onOpenReview={() => setShowReviewModal(true)}
            />
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
            {showReviewModal && (
              <ReviewModal
                gameId={id}
                gameTitle={game.titulo}
                onClose={() => setShowReviewModal(false)}
                onSuccess={() => {
                  setShowReviewModal(false);
                  setLoading(true);
                  fetchData();
                }}
              />
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function HeroSection({ game, status, onOpenReview }) {
  const navigate = useNavigate();
  const gradient = getGameGradient(game.id);

  const mediaNotas =
    game.reviews?.length > 0
      ? game.reviews.reduce((sum, r) => sum + r.nota, 0) / game.reviews.length
      : null;

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
        className="game-details-cover"
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

        {mediaNotas !== null && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ color: "#f59e0b", fontSize: "1.3rem" }}>★</span>
            <span style={{ fontSize: "1.3rem", fontWeight: 700 }}>
              {mediaNotas.toFixed(1)}
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

            {status.reviewFeita ? (
              <Badge
                color="var(--color-primary)"
                bg="rgba(139,92,246,0.1)"
                border="rgba(139,92,246,0.25)"
              >
                ★ Avaliado
              </Badge>
            ) : (
              <button
                onClick={onOpenReview}
                style={{
                  background: "rgba(139,92,246,0.12)",
                  color: "var(--color-primary)",
                  border: "1px solid rgba(139,92,246,0.35)",
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
                ★ Escrever review
              </button>
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

function ReviewModal({ gameId, gameTitle, onClose, onSuccess }) {
  const [nota, setNota] = useState(null);
  const [texto, setTexto] = useState("");
  const [recomenda, setRecomenda] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (nota === null) {
      swal.fire({ icon: "warning", title: "Nota obrigatória", text: "Selecione uma nota de 0 a 10." });
      return;
    }
    if (!texto.trim()) {
      swal.fire({ icon: "warning", title: "Texto obrigatório", text: "Escreva algo sobre o jogo." });
      return;
    }
    if (recomenda === null) {
      swal.fire({ icon: "warning", title: "Recomendação obrigatória", text: "Indique se você recomenda o jogo." });
      return;
    }
    setLoading(true);
    try {
      await api.post(`/jogos/${gameId}/reviews`, { nota, texto, recomenda });
      onSuccess();
    } catch (err) {
      swal.fire({
        icon: "error",
        title: "Erro",
        text: err.response?.data?.erro || "Não foi possível publicar a review.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-surface)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "2rem",
          width: "100%",
          maxWidth: "480px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: "1.2rem", fontWeight: 800 }}>Escrever review</h2>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>{gameTitle}</p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1.2rem", lineHeight: 1, padding: "4px" }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <p style={{ margin: "0 0 8px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Nota
            </p>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setNota(i)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    border: nota === i ? "2px solid var(--color-primary)" : "1px solid rgba(255,255,255,0.1)",
                    background: nota === i ? "rgba(139,92,246,0.2)" : "rgba(255,255,255,0.04)",
                    color: nota === i ? "var(--color-primary)" : "var(--text-secondary)",
                    fontWeight: nota === i ? 700 : 400,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    transition: "all 0.15s",
                  }}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p style={{ margin: "0 0 8px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Texto
            </p>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={2000}
              placeholder="Conte o que você achou do jogo..."
              rows={4}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "10px 12px",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
                fontFamily: "var(--font-sans)",
                resize: "vertical",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <p style={{ margin: "4px 0 0", fontSize: "0.72rem", color: "var(--text-muted)", textAlign: "right" }}>
              {texto.length}/2000
            </p>
          </div>

          <div>
            <p style={{ margin: "0 0 8px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Você recomenda?
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setRecomenda(true)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  border: recomenda === true ? "2px solid #10b981" : "1px solid rgba(255,255,255,0.1)",
                  background: recomenda === true ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.04)",
                  color: recomenda === true ? "#10b981" : "var(--text-secondary)",
                  fontWeight: recomenda === true ? 700 : 400,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  transition: "all 0.15s",
                }}
              >
                👍 Sim
              </button>
              <button
                type="button"
                onClick={() => setRecomenda(false)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "8px",
                  border: recomenda === false ? "2px solid #ef4444" : "1px solid rgba(255,255,255,0.1)",
                  background: recomenda === false ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
                  color: recomenda === false ? "#ef4444" : "var(--text-secondary)",
                  fontWeight: recomenda === false ? 700 : 400,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  fontFamily: "var(--font-sans)",
                  transition: "all 0.15s",
                }}
              >
                👎 Não
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "0.25rem" }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              style={{ flex: 1 }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {loading ? "Publicando..." : "Publicar review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
