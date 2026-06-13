import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../components/Layout";
import GameCard from "../components/GameCard";
import ErrorCard from "../components/ErrorCard";
import EmptyState from "../components/EmptyState";
import SidebarSection from "../components/SidebarSection";
import SearchInput from "../components/SearchInput";
import { GlobalStateContext } from "../global/GlobalStateContext";

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
  const location = useLocation();
  const { states } = useContext(GlobalStateContext);
  const { jogos, jogosLoading: loadingJogos, generos, generosLoading: loadingGeneros } = states;
  const loading = loadingJogos || loadingGeneros;
  const [error] = useState("");
  const [search, setSearch] = useState(() => {
    return location.state?.search || "";
  });
  const [selectedGenres, setSelectedGenres] = useState(() => {
    if (location.state?.genreId) {
      return [Number(location.state.genreId)];
    }
    return [];
  });
  const [priceFilter, setPriceFilter] = useState("todos");
  const [sortBy, setSortBy] = useState("titulo");

  const [prevGenreId, setPrevGenreId] = useState(location.state?.genreId);
  if (location.state?.genreId !== prevGenreId) {
    setPrevGenreId(location.state?.genreId);
    setSelectedGenres(location.state?.genreId ? [Number(location.state.genreId)] : []);
  }

  const [prevSearch, setPrevSearch] = useState(location.state?.search);
  if (location.state?.search !== prevSearch) {
    setPrevSearch(location.state?.search);
    setSearch(location.state?.search || "");
  }

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

      const gameGenreIds = j.generos.map((g) => Number(g.id));
      return selectedGenres.every((id) => gameGenreIds.includes(id));
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
          return new Date(b.lancamento || 0) - new Date(a.lancamento || 0);
        default:
          return (a.titulo || "").localeCompare(b.titulo || "");
      }
    });

  return (
    <Layout>
      <div className="catalog-layout">
        {/* Sidebar */}
        <aside className="catalog-sidebar">
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
        <main className="catalog-main">
          {loading ? (
            <CatalogSkeleton />
          ) : error ? (
            <ErrorCard message={error} onAction={() => window.location.reload()} actionLabel="Tentar novamente" />
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
                  <SearchInput value={search} onChange={setSearch} placeholder="Buscar título..." />
                  <SortSelect value={sortBy} onChange={setSortBy} />
                </div>
              </div>

              {filtered.length === 0 ? (
                <EmptyState message="Nenhum jogo encontrado para os filtros selecionados." />
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
