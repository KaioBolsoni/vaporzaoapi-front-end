export default function SidebarSection({ label, children }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <p
        style={{
          fontSize: "0.65rem",
          fontWeight: 700,
          color: "var(--text-muted)",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginBottom: "10px",
        }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}
