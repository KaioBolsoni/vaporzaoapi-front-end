import { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";
import GameCard from "../components/GameCard";

const SORT_OPTIONS = [
  { value: "titulo", label: "A–Z" },
  { value: "preco_asc", label: "Menor preço" },
  { value: "preco_desc", label: "Maior preço" },
  { value: "recentes", label: "Mais recentes" },
];

const PRICE_OPTIONS = [
  { value: "todos", label: "Todos" },
  { value: "gratis", label: "Grátis" },
  { value: "pago", label: "Pago" },
];

export default function Catalog() {
  const [jogos, setJogos] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [priceFilter, setPriceFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("titulo");

  useEffect(() => {
    async function fetchData() {
      try {
        const [jogosRes, generosRes] = await Promise.all([
          api.get("/jogos?limite=100"),
          api.get("/generos"),
        ]);

        // API returns { pagina, limite, total, paginas, itens: [...] }
        const raw = jogosRes.data;
        const jogosArray = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.itens)
          ? raw.itens
          : [];

        setJogos(jogosArray);
        setGeneros(Array.isArray(generosRes.data) ? generosRes.data : []);
      } catch (err) {
        console.error("Catalog fetch error:", err);
        setError("Erro ao carregar o catálogo.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function toggleGenre(id) {
    setSelectedGenres((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]
    );
  }

  const filtered = jogos
    .filter((j) => (j.titulo || "").toLowerCase().includes(search.toLowerCase()))
    .filter((j) => {
      if (selectedGenres.length === 0) return true;
      if (!j.generos?.length) return false;
      return j.generos.some((g) => selectedGenres.includes(Number(g.id)));
    })
    .filter((j) => {
      if (priceFilter === "gratis") return (j.preco || 0) === 0;
      if (priceFilter === "pago") return (j.preco || 0) > 0;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "preco_asc":
          return (a.preco || 0) - (b.preco || 0);
        case "preco_desc":
          return (b.preco || 0) - (a.preco || 0);
        case "recentes":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return (a.titulo || "").localeCompare(b.titulo || "");
      }
    });

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          padding: "28px 1.5rem 3rem",
          maxWidth: "1400px",
          margin: "0 auto",
          width: "100%",
          gap: "0",
        }}
      >
        {/* Sidebar */}
        <aside style={{ width: "190px", flexShrink: 0 }}>
          <SidebarSection label="Gêneros">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: "22px", borderRadius: "4px" }} />
                ))
              : generos.map((g) => (
                  <label
                    key={g.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "5px 6px",
                      cursor: "pointer",
                      borderRadius: "5px",
                      transition: "background 0.1s",
                      background: selectedGenres.includes(Number(g.id))
                        ? "rgba(139,92,246,0.1)"
                        : "transparent",
                    }}
                    onMouseEnter={(e) => { if (!selectedGenres.includes(Number(g.id))) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { if (!selectedGenres.includes(Number(g.id))) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="checkbox"
                        checked={selectedGenres.includes(Number(g.id))}
                        onChange={() => toggleGenre(Number(g.id))}
                        style={{ accentColor: "var(--color-primary)", width: "13px", height: "13px", cursor: "pointer" }}
                      />
                      <span style={{ fontSize: "0.85rem", color: selectedGenres.includes(Number(g.id)) ? "var(--text-primary)" : "var(--text-secondary)" }}>
                        {g.nome}
                      </span>
                    </span>
                    {g._count?.jogos !== undefined && (
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        {g._count.jogos}
                      </span>
                    )}
                  </label>
                ))}
          </SidebarSection>

          <SidebarSection label="Preço">
            {PRICE_OPTIONS.map((opt) => {
              const active = priceFilter === opt.value;
              return (
                <label
                  key={opt.value}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "5px 6px",
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    borderRadius: "5px",
                    background: active ? "rgba(139,92,246,0.1)" : "transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="price"
                    checked={active}
                    onChange={() => setPriceFilter(opt.value)}
                    style={{ accentColor: "var(--color-primary)", cursor: "pointer" }}
                  />
                  {opt.label}
                </label>
              );
            })}
          </SidebarSection>

          {(selectedGenres.length > 0 || priceFilter !== "todos") && (
            <button
              onClick={() => { setSelectedGenres([]); setPriceFilter("todos"); }}
              style={{
                marginTop: "4px",
                width: "100%",
                padding: "6px",
                background: "none",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--text-muted)",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.75rem",
                fontFamily: "var(--font-sans)",
              }}
            >
              Limpar filtros
            </button>
          )}
        </aside>

        {/* Main */}
        <main style={{ flex: 1, minWidth: 0, paddingLeft: "36px" }}>
          {loading ? (
            <CatalogSkeleton />
          ) : error ? (
            <ErrorCard message={error} onRetry={() => window.location.reload()} />
          ) : (
            <>
              <p
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  margin: "0 0 6px",
                }}
              >
                Catálogo
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 800 }}>
                  Explorar todos os jogos{" "}
                  <span style={{ fontSize: "0.95rem", fontWeight: 400, color: "var(--text-muted)" }}>
                    {filtered.length} itens
                  </span>
                </h1>

                <div style={{ display: "flex", gap: "8px" }}>
                  <SearchInput value={search} onChange={setSearch} />
                  <SortSelect value={sortBy} onChange={setSortBy} />
                </div>
              </div>

              {filtered.length === 0 ? (
                <div
                  style={{
                    padding: "4rem",
                    textAlign: "center",
                    background: "var(--bg-surface)",
                    borderRadius: "12px",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "var(--text-muted)",
                    fontSize: "0.9rem",
                  }}
                >
                  Nenhum jogo encontrado para os filtros selecionados.
                </div>
              ) : (
                <div
                  className="animate-slide-up"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
                    gap: "18px",
                  }}
                >
                  {filtered.map((game) => (
                    <GameCard key={game.id} game={game} variant="catalog" />
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </Layout>
  );
}

function SidebarSection({ label, children }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      <p
        style={{
          fontSize: "0.62rem",
          fontWeight: 700,
          color: "var(--text-muted)",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          margin: "0 0 8px 6px",
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>{children}</div>
    </div>
  );
}

function SearchInput({ value, onChange }) {
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
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar título..."
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

function SortSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "0 12px",
        height: "36px",
        background: "var(--bg-surface)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: "8px",
        color: "var(--text-primary)",
        fontSize: "0.85rem",
        cursor: "pointer",
        fontFamily: "var(--font-sans)",
        outline: "none",
      }}
    >
      {SORT_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function ErrorCard({ message, onRetry }) {
  return (
    <div style={{ padding: "3rem", textAlign: "center", background: "var(--bg-surface)", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" }}>
      <p style={{ color: "var(--color-error)", marginBottom: "1rem" }}>{message}</p>
      <button className="btn btn-outline" onClick={onRetry}>Tentar novamente</button>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <>
      <div className="skeleton" style={{ height: "36px", width: "320px", borderRadius: "8px", marginBottom: "20px" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "18px" }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: "270px", borderRadius: "10px" }} />
        ))}
      </div>
    </>
  );
}
