import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-main)",
        gap: "16px",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <span style={{ fontSize: "4rem" }}>👾</span>
      <h1
        style={{
          fontSize: "5rem",
          fontWeight: 800,
          color: "var(--color-primary)",
          margin: 0,
          lineHeight: 1,
        }}
      >
        404
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "1rem", margin: 0 }}>
        Essa página não existe ou foi removida.
      </p>
      <button
        onClick={() => navigate("/")}
        className="btn btn-primary"
        style={{ marginTop: "8px" }}
      >
        Voltar à loja
      </button>
    </div>
  );
}
