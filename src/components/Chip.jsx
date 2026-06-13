export default function Chip({ children, onClick, variant = "default" }) {
  const variants = {
    default: {
      background: "rgba(0,0,0,0.3)",
      color: "rgba(255,255,255,0.9)",
      backdropFilter: "blur(4px)",
      border: "1px solid rgba(255,255,255,0.2)",
      fontSize: "0.78rem",
    },
    genre: {
      background: "rgba(139,92,246,0.12)",
      color: "var(--color-primary)",
      border: "1px solid rgba(139,92,246,0.25)",
      fontSize: "0.75rem",
      cursor: onClick ? "pointer" : "default",
    },
  };

  return (
    <span
      onClick={onClick}
      onMouseEnter={
        onClick && variant === "genre"
          ? (e) => { e.currentTarget.style.background = "rgba(139,92,246,0.22)"; }
          : undefined
      }
      onMouseLeave={
        onClick && variant === "genre"
          ? (e) => { e.currentTarget.style.background = "rgba(139,92,246,0.12)"; }
          : undefined
      }
      style={{
        padding: "3px 10px",
        borderRadius: "20px",
        fontWeight: 500,
        display: "inline-block",
        transition: "background 0.15s",
        ...variants[variant],
      }}
    >
      {children}
    </span>
  );
}
