import { useState } from "react";
import api from "../services/api";
import swal from "../utils/swal";

export default function ReviewModal({ gameId, gameTitle, reviewEditando, onClose, onSuccess }) {
  const [nota, setNota] = useState(reviewEditando ? reviewEditando.nota : null);
  const [texto, setTexto] = useState(reviewEditando ? reviewEditando.texto : "");
  const [recomenda, setRecomenda] = useState(reviewEditando ? reviewEditando.recomenda : null);
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
      if (reviewEditando) {
        await api.patch(`/reviews/${reviewEditando.id}`, { nota, texto, recomenda });
      } else {
        await api.post(`/jogos/${gameId}/reviews`, { nota, texto, recomenda });
      }
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
            <h2 style={{ margin: "0 0 4px", fontSize: "1.2rem", fontWeight: 800 }}>
              {reviewEditando ? "Editar review" : "Escrever review"}
            </h2>
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
