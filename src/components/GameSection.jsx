import GameCard from "./GameCard";

export default function GameSection({ title, subtitle, games }) {
  return (
    <section style={{ marginBottom: "36px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700 }}>
            {title}
          </h2>
          {subtitle && (
            <p
              style={{
                margin: "2px 0 0",
                fontSize: "0.8rem",
                color: "var(--text-muted)",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
          gap: "16px",
        }}
      >
        {games.map((game) => (
          <GameCard key={game.id} game={game} variant="compact" />
        ))}
      </div>
    </section>
  );
}
