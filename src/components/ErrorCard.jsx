export default function ErrorCard({ message, actionLabel, onAction }) {
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
      {onAction && (
        <button className="btn btn-outline" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
