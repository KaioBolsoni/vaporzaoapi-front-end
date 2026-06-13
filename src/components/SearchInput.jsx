export default function SearchInput({ value, onChange, placeholder = "Buscar..." }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "7px",
        background: "var(--bg-surface)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "8px",
        padding: "0 12px",
        height: "36px",
        minWidth: "190px",
      }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        style={{ color: "var(--text-muted)", flexShrink: 0 }}
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: "none",
          border: "none",
          outline: "none",
          color: "var(--text-primary)",
          fontSize: "0.85rem",
          width: "100%",
          fontFamily: "var(--font-sans)",
        }}
      />
    </div>
  );
}
