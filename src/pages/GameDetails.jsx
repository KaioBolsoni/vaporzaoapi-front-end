import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useRequestData } from "../hooks/useRequestData";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/Layout";
import GameCover from "../components/GameCover";
import ReviewModal from "../components/ReviewModal";
import ErrorCard from "../components/ErrorCard";
import Chip from "../components/Chip";
import { getGameGradient, toTitleCase } from "../utils/gameColors";
import swal from "../utils/swal";

export default function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const { data, isLoading: loading, error, refetch: fetchData } = useRequestData(
    async () => {
      try {
        const [gameRes, statusRes] = await Promise.all([
          api.get(`/jogos/${id}`),
          api.get(`/jogos/${id}/status`),
        ]);
        return { game: gameRes.data, status: statusRes.data };
      } catch (err) {
        throw new Error(
          err.response?.status === 404
            ? "Jogo não encontrado."
            : "Erro ao carregar detalhes do jogo."
        );
      }
    },
    [id]
  );
  const game = data?.game ?? null;
  const status = data?.status ?? null;
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewEditando, setReviewEditando] = useState(null);

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
          <ErrorCard
            message={error}
            onAction={() => navigate("/catalogo")}
            actionLabel="Voltar ao catálogo"
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
                currentUser={currentUser}
                onEdit={(review) => {
                  setReviewEditando(review);
                  setShowReviewModal(true);
                }}
                onDelete={async (reviewId) => {
                  const confirmar = await swal.fire({
                    title: "Tem certeza?",
                    text: "Sua review será excluída permanentemente!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#ef4444",
                    cancelButtonColor: "#3b82f6",
                    confirmButtonText: "Sim, excluir!",
                    cancelButtonText: "Cancelar"
                  });

                  if (confirmar.isConfirmed) {
                    try {
                      await api.delete(`/reviews/${reviewId}`);
                      swal.fire("Excluída!", "Sua review foi removida.", "success");
                      fetchData();
                    } catch (err) {
                      swal.fire("Erro", "Não foi possível excluir a review.", "error");
                    }
                  }
                }}
              />
            )}

            {showReviewModal && (
              <ReviewModal
                gameId={id}
                gameTitle={game.titulo}
                reviewEditando={reviewEditando}
                onClose={() => {
                  setShowReviewModal(false);
                  setReviewEditando(null);
                }}
                onSuccess={() => {
                  setShowReviewModal(false);
                  setReviewEditando(null);
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


  const [naBiblioteca, setNaBiblioteca] = useState(false);
  const [loadingBiblioteca, setLoadingBiblioteca] = useState(false);


  useEffect(() => {
    if (status) {
      setNaWishlist(status.naWishlist);
      setNaBiblioteca(status.naBiblioteca);
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

  async function adicionarBiblioteca() {
    if (loadingBiblioteca) return;
    setLoadingBiblioteca(true);
    try {
      await api.post(`/biblioteca/${game.id}`);
      setNaBiblioteca(true);
      swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Jogo adicionado à sua biblioteca.",
      });
    } catch (err) {
      swal.fire({
        icon: "error",
        title: "Erro",
        text: err.response?.data?.erro || "Não foi possível adicionar à biblioteca.",
      });
    } finally {
      setLoadingBiblioteca(false);
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
              <Chip
                key={g.id}
                variant="genre"
                onClick={() =>
                  navigate("/catalogo", { state: { genreId: Number(g.id) } })
                }
              >
                {g.nome}
              </Chip>
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
            {naBiblioteca ? (
              <Badge
                color="#10b981"
                bg="rgba(16,185,129,0.1)"
                border="rgba(16,185,129,0.25)"
              >
                ✓ Na biblioteca
              </Badge>
            ) : (
              <button
                onClick={adicionarBiblioteca}
                disabled={loadingBiblioteca}
                style={{
                  background: "#10b981",
                  color: "#ffffff",
                  border: "1px solid #10b981",
                  padding: "10px 16px",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "1rem",
                  fontFamily: "var(--font-sans)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "4px",
                  transition: "all 0.2s",
                  width: "100%",
                }}
              >
                {loadingBiblioteca ? "Processando..." : "Comprar"}
              </button>
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

function ReviewsSection({ reviews, onUserClick, currentUser, onEdit, onDelete }) {
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <button
                onClick={() => r.autor?.matricula && onUserClick(r.autor.matricula)}
                style={{
                  background: "none", border: "none", cursor: r.autor?.matricula ? "pointer" : "default",
                  color: "var(--color-secondary)", fontWeight: 600, fontSize: "0.875rem", padding: 0, fontFamily: "var(--font-sans)",
                }}
              >
                {toTitleCase(r.autor?.nome ?? "Usuário")}
              </button>
              <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: "0.875rem" }}>
                ★ {r.nota}/10
              </span>
            </div>
            {r.texto && (
              <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                "{r.texto}"
              </p>
            )}


            {currentUser && r.autor?.matricula === currentUser.matricula && (
              <div style={{ display: "flex", gap: "8px", marginTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px" }}>
                <button onClick={() => onEdit(r)} style={{ background: "rgba(59, 130, 246, 0.1)", border: "1px solid #3b82f6", color: "#3b82f6", padding: "4px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}>
                  Editar
                </button>
                <button onClick={() => onDelete(r.id)} style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", color: "#ef4444", padding: "4px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "0.8rem" }}>
                  Excluir
                </button>
              </div>
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

