import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import Layout from "../components/Layout";
import GameCard from "../components/GameCard";
import { useAuth } from "../context/AuthContext";
import {
  getGameGradient,
  getGameInitials,
  toTitleCase,
} from "../utils/gameColors";

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getUserInitials(nome = "") {
  const parts = nome.split(" ").filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function PublicProfile() {
  const { matricula } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get(`/usuarios/${matricula}`);
        setProfile(res.data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(
          err.response?.status === 404
            ? "Usuário não encontrado."
            : "Erro ao carregar o perfil.",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [matricula]);

  const isOwnProfile = user?.matricula === matricula;

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
          <ProfileSkeleton />
        ) : error ? (
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
              {error}
            </p>
            <button className="btn btn-outline" onClick={() => navigate(-1)}>
              Voltar
            </button>
          </div>
        ) : (
          <div className="animate-slide-up">
            <ProfileCard profile={profile} isOwnProfile={isOwnProfile} />
            <StatsRow profile={profile} />

            {profile.jogosCriados?.length > 0 && (
              <GamesSection
                jogos={profile.jogosCriados}
                isOwnProfile={isOwnProfile}
              />
            )}

            {profile.reviews?.length > 0 && (
              <ReviewsSection
                reviews={profile.reviews}
                onGameClick={(gameId) => navigate(`/jogos/${gameId}`)}
              />
            )}

            {!profile.jogosCriados?.length && !profile.reviews?.length && (
              <div
                style={{
                  padding: "3rem",
                  textAlign: "center",
                  background: "var(--bg-surface)",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "var(--text-muted)",
                }}
              >
                Este usuário ainda não possui atividade pública.
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}

function ProfileCard({ profile, isOwnProfile }) {
  const displayName = toTitleCase(profile.nome || "");
  const initials = getUserInitials(displayName);

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "16px",
        padding: "2rem",
        marginBottom: "2px",
      }}
    >
      <p
        style={{
          margin: "0 0 16px",
          fontSize: "0.65rem",
          fontWeight: 700,
          color: "var(--text-muted)",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
        }}
      >
        Perfil Público
      </p>

      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, var(--color-primary), #6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            fontWeight: 800,
            color: "#fff",
            flexShrink: 0,
            boxShadow: "var(--shadow-primary)",
          }}
        >
          {initials}
        </div>

        <div style={{ flex: 1, minWidth: "200px" }}>
          <h1
            style={{ margin: "0 0 6px", fontSize: "1.6rem", fontWeight: 800 }}
          >
            {displayName}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            <span
              style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
            >
              @{displayName.split(" ")[0]?.toLowerCase()}.
              {profile.matricula?.slice(-4)}
            </span>
            <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
            <span
              style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}
            >
              {profile.matricula}
            </span>
            {profile.createdAt && (
              <>
                <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  membro desde {formatDate(profile.createdAt)}
                </span>
              </>
            )}
          </div>
          {profile.bio && (
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {isOwnProfile && (
          <button
            className="btn btn-outline"
            style={{ fontSize: "0.85rem", flexShrink: 0 }}
          >
            ⚙ Editar perfil
          </button>
        )}
      </div>
    </div>
  );
}

function StatsRow({ profile }) {
  const jogosCriados = profile._count?.jogosCriados ?? profile.jogosCriados?.length ?? 0;
  const limitAtingido = jogosCriados >= 3;

  const stats = [
    {
      icon: "+",
      label: "JOGOS CRIADOS",
      value: jogosCriados,
      suffix: `/ 3`,
    },
    {
      icon: "✏",
      label: "REVIEWS ESCRITAS",
      value: profile._count?.reviews ?? profile.reviews?.length ?? 0,
    },
    {
      icon: "⊞",
      label: "NA BIBLIOTECA",
      value: profile._count?.biblioteca ?? 0,
    },
    {
      icon: "♡",
      label: "NA WISHLIST",
      value: profile._count?.wishlist ?? 0,
    },
  ];

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderTop: "none",
        borderRadius: "0 0 16px 16px",
        padding: "1.25rem 2rem",
        marginBottom: "2rem",
        display: "flex",
        gap: "2rem",
        flexWrap: "wrap",
      }}
    >
      {stats.map((s) => (
        <div key={s.label}>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "0.62rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              letterSpacing: "1px",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>{s.icon}</span> {s.label}
          </p>
          <p style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800 }}>
            {s.value}
            {s.suffix && (
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-muted)",
                  fontWeight: 400,
                }}
              >
                {" "}
                {s.suffix}
              </span>
            )}
          </p>
          {s.label === "JOGOS CRIADOS" && limitAtingido && (
            <span style={{
              display: "inline-block",
              marginTop: "4px",
              fontSize: "0.65rem",
              fontWeight: 700,
              color: "#ef4444",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              padding: "2px 8px",
              borderRadius: "20px",
            }}>
              limite atingido
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function GamesSection({ jogos, isOwnProfile }) {
  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
            Jogos criados
          </h2>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: "0.8rem",
              color: "var(--text-muted)",
            }}
          >
            {jogos.length} jogo(s)
          </p>
        </div>
        {isOwnProfile && (
          <button
            className="btn btn-outline"
            style={{ fontSize: "0.8rem", padding: "6px 14px" }}
          >
            + Criar novo
          </button>
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        {jogos.map((game) => (
          <GameCard key={game.id} game={game} variant="catalog" />
        ))}
      </div>
    </section>
  );
}

function ReviewsSection({ reviews, onGameClick }) {
  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
          Últimas reviews
        </h2>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          {reviews.length} total
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {reviews.map((r) => (
          <ReviewCard key={r.id} review={r} onGameClick={onGameClick} />
        ))}
      </div>
    </section>
  );
}

function ReviewCard({ review: r, onGameClick }) {
  const initials = getGameInitials(r.jogo?.titulo || "");
  const gradient = getGameGradient(r.jogo?.id);

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "10px",
        padding: "16px",
        display: "flex",
        gap: "14px",
        alignItems: "center",
      }}
    >
      <div
        onClick={() => r.jogo && onGameClick(r.jogo.id)}
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "8px",
          background: gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.85rem",
          fontWeight: 800,
          color: "rgba(255,255,255,0.85)",
          flexShrink: 0,
          cursor: r.jogo ? "pointer" : "default",
          fontFamily: "var(--font-sans)",
        }}
      >
        {initials}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
            marginBottom: "4px",
          }}
        >
          <button
            onClick={() => r.jogo && onGameClick(r.jogo.id)}
            style={{
              background: "none",
              border: "none",
              cursor: r.jogo ? "pointer" : "default",
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: "0.9rem",
              padding: 0,
              fontFamily: "var(--font-sans)",
            }}
          >
            {r.jogo?.titulo ?? "Jogo removido"}
          </button>
          <span
            style={{ color: "#f59e0b", fontWeight: 700, fontSize: "0.85rem" }}
          >
            ★ {r.nota}/10
          </span>
          {r.recomenda && (
            <span
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "var(--color-success)",
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.25)",
                padding: "2px 8px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              ✓ Recomenda
            </span>
          )}
          {r.createdAt && (
            <span
              style={{
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                marginLeft: "auto",
              }}
            >
              {new Date(r.createdAt).toLocaleDateString("pt-BR")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <>
      <div
        className="skeleton"
        style={{
          height: "160px",
          borderRadius: "16px 16px 0 0",
          marginBottom: "2px",
        }}
      />
      <div
        className="skeleton"
        style={{
          height: "80px",
          borderRadius: "0 0 16px 16px",
          marginBottom: "2rem",
        }}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: "280px", borderRadius: "12px" }}
          />
        ))}
      </div>
    </>
  );
}
