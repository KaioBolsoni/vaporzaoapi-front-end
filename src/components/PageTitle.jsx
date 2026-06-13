export default function PageTitle({ children, subtitle, divider = false }) {
  return (
    <div
      style={{
        marginBottom: "2rem",
        ...(divider && {
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          paddingBottom: "15px",
        }),
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 800,
          margin: subtitle ? "0 0 0.5rem" : "0",
          color: "var(--text-primary, #fff)",
        }}
      >
        {children}
      </h1>
      {subtitle && (
        <p style={{ color: "var(--text-muted)", margin: 0 }}>{subtitle}</p>
      )}
    </div>
  );
}
