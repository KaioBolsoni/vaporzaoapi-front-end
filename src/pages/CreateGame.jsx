import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import swal from "../utils/swal";
import Layout from "../components/Layout";
import { useGeneros } from "../hooks/useGeneros";

export default function CreateGame() {
    const navigate = useNavigate();


    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [preco, setPreco] = useState("");
    const [desenvolvedora, setDesenvolvedora] = useState("");
    const [lancamento, setLancamento] = useState("");
    const [capaUrl, setCapaUrl] = useState("");
    const [generoIds, setGeneroIds] = useState([]);


    const { generos: generosDisponiveis, loading: loadingGeneros } = useGeneros();
    const [loading, setLoading] = useState(false);


    function handleGeneroToggle(id) {
        setGeneroIds((prevIds) =>
            prevIds.includes(id)
                ? prevIds.filter((genId) => genId !== id)
                : [...prevIds, id]
        );
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (generoIds.length === 0) {
            swal.fire({
                icon: "warning",
                title: "Atenção",
                text: "Selecione pelo menos um gênero para o jogo.",
            });
            return;
        }

        setLoading(true);

        try {

            const dataIso = new Date(lancamento + "T12:00:00").toISOString();

            const payload = {
                titulo,
                descricao,
                preco: parseFloat(preco),
                desenvolvedora,
                lancamento: dataIso,
                capaUrl: capaUrl || null,
                generoIds,
            };

            await api.post("/jogos", payload);

            swal.fire({
                icon: "success",
                title: "Sucesso!",
                text: "O jogo foi criado e publicado na Vaporzão!",
            }).then(() => {
                navigate("/catalogo");
            });

        } catch (error) {
            console.error("Erro ao criar jogo:", error);
            swal.fire({
                icon: "error",
                title: "Erro ao criar",
                text: error.response?.data?.erro || "Verifique os dados e tente novamente.",
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <Layout>
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" }}>

                <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem", color: "var(--text-primary, #fff)" }}>
                    Criar Novo Jogo
                </h1>
                <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
                    Preencha os detalhes abaixo para publicar um novo jogo no catálogo.
                </p>

                <form onSubmit={handleSubmit} style={{ background: "var(--bg-surface)", padding: "2rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Título do Jogo *</label>
                            <input
                                type="text"
                                required
                                maxLength={200}
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                placeholder="Ex: Counter-Tapa"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Desenvolvedora *</label>
                            <input
                                type="text"
                                required
                                maxLength={150}
                                value={desenvolvedora}
                                onChange={(e) => setDesenvolvedora(e.target.value)}
                                placeholder="Sua empresa ou seu nome"
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 150px", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Preço (R$) *</label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.01"
                                value={preco}
                                onChange={(e) => setPreco(e.target.value)}
                                placeholder="Ex: 29.90 (0 para grátis)"
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ flex: "1 1 150px", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Data de Lançamento *</label>
                            <input
                                type="date"
                                required
                                value={lancamento}
                                onChange={(e) => setLancamento(e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>URL da Capa</label>
                        <input
                            type="url"
                            value={capaUrl}
                            onChange={(e) => setCapaUrl(e.target.value)}
                            placeholder="https://exemplo.com/imagem.jpg"
                            style={inputStyle}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Descrição *</label>
                        <textarea
                            required
                            maxLength={5000}
                            rows={5}
                            value={descricao}
                            onChange={(e) => setDescricao(e.target.value)}
                            placeholder="Conte aos jogadores sobre o seu jogo..."
                            style={{ ...inputStyle, resize: "vertical" }}
                        />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)" }}>Gêneros *</label>
                        {loadingGeneros ? (
                            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Carregando gêneros...</p>
                        ) : (
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                                {generosDisponiveis.map((gen) => (
                                    <label key={gen.id} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                                        <input
                                            type="checkbox"
                                            checked={generoIds.includes(gen.id)}
                                            onChange={() => handleGeneroToggle(gen.id)}
                                            style={{ cursor: "pointer", width: "16px", height: "16px", accentColor: "var(--color-primary)" }}
                                        />
                                        {gen.nome}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem" }}>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            style={{ background: "transparent", color: "var(--text-secondary)", border: "1px solid rgba(255,255,255,0.2)", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: 600, transition: "0.2s" }}
                            onMouseEnter={(e) => e.target.style.background = "rgba(255,255,255,0.05)"}
                            onMouseLeave={(e) => e.target.style.background = "transparent"}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || loadingGeneros}
                            style={{ background: "var(--color-primary, #8b5cf6)", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: 600, transition: "0.2s", opacity: loading ? 0.7 : 1 }}
                            onMouseEnter={(e) => e.target.style.background = "#7c3aed"}
                            onMouseLeave={(e) => e.target.style.background = "var(--color-primary, #8b5cf6)"}
                        >
                            {loading ? "Criando..." : "Publicar Jogo"}
                        </button>
                    </div>

                </form>
            </div>
        </Layout>
    );
}


const inputStyle = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "var(--text-primary, #fff)",
    fontSize: "0.95rem",
    fontFamily: "var(--font-sans)",
    boxSizing: "border-box",
    outline: "none",
};