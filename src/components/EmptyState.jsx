export default function EmptyState({ message }) {
  return (
    <div
      style={{
        padding: "3rem",
        textAlign: "center",
        background: "var(--bg-surface)",
        borderRadius: "12px",
        border: "1px solid rgba(255,255,255,0.06)",
        color: "var(--text-muted)",
        fontSize: "0.9rem",
      }}
    >
      {message}
    </div>
  );
}
