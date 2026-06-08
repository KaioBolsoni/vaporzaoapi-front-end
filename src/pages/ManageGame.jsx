import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import swal from "../utils/swal";
import Layout from "../components/Layout";

export default function ManageGame() {
    const { id } = useParams();
    const navigate = useNavigate();


    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [preco, setPreco] = useState("");
    const [desenvolvedora, setDesenvolvedora] = useState("");
    const [lancamento, setLancamento] = useState("");
    const [capaUrl, setCapaUrl] = useState("");
    const [generoIds, setGeneroIds] = useState([]);
    const [imagensAtuais, setImagensAtuais] = useState([]);
    const [conquistasAtuais, setConquistasAtuais] = useState([]);
    const [novaConquistaTitulo, setNovaConquistaTitulo] = useState("");
    const [novaConquistaDescricao, setNovaConquistaDescricao] = useState("");
    const [adicionandoConquista, setAdicionandoConquista] = useState(false);


    const [novaImagemUrl, setNovaImagemUrl] = useState("");
    const [novaImagemLegenda, setNovaImagemLegenda] = useState("");


    const [generosDisponiveis, setGenerosDisponiveis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [adicionandoImg, setAdicionandoImg] = useState(false);

    useEffect(() => {
        async function carregarDados() {
            try {
                const [jogoRes, generosRes] = await Promise.all([
                    api.get(`/jogos/${id}`),
                    api.get("/generos")
                ]);

                const jogo = jogoRes.data;
                setTitulo(jogo.titulo);
                setDescricao(jogo.descricao);
                setPreco(jogo.preco);
                setDesenvolvedora(jogo.desenvolvedora);

                setLancamento(jogo.lancamento ? jogo.lancamento.split("T")[0] : "");
                setCapaUrl(jogo.capaUrl || "");
                setGeneroIds(jogo.generos.map((g) => g.id));
                setImagensAtuais(jogo.imagens || []);
                setConquistasAtuais(jogo.conquistas || []);

                setGenerosDisponiveis(generosRes.data);
            } catch (error) {
                console.error("Erro ao carregar dados:", error);
                swal.fire("Erro", "Não foi possível carregar os dados do jogo.", "error");
                navigate("/");
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, [id, navigate]);

    function handleGeneroToggle(genId) {
        setGeneroIds((prev) =>
            prev.includes(genId) ? prev.filter((g) => g !== genId) : [...prev, genId]
        );
    }

    async function handleSalvarEdicao(e) {
        e.preventDefault();
        if (generoIds.length === 0) {
            swal.fire("Atenção", "Selecione pelo menos um gênero.", "warning");
            return;
        }
        setSalvando(true);
        try {
            const payload = {
                titulo,
                descricao,
                preco: parseFloat(preco),
                desenvolvedora,
                lancamento: new Date(lancamento).toISOString(),
                capaUrl: capaUrl || null,
                generoIds,
            };
            await api.put(`/jogos/${id}`, payload);
            swal.fire("Sucesso!", "Jogo atualizado com sucesso.", "success");
        } catch (error) {
            swal.fire("Erro", error.response?.data?.erro || "Não foi possível atualizar.", "error");
        } finally {
            setSalvando(false);
        }
    }
    async function handleAdicionarConquista(e) {
        e.preventDefault();
        if (!novaConquistaTitulo) return;
        setAdicionandoConquista(true);
        try {
            const response = await api.post(`/jogos/${id}/conquistas`, {
                titulo: novaConquistaTitulo,
                descricao: novaConquistaDescricao || null
            });

            setConquistasAtuais([...conquistasAtuais, response.data]);
            setNovaConquistaTitulo("");
            setNovaConquistaDescricao("");
            swal.fire("Sucesso!", "Conquista adicionada.", "success");
        } catch (error) {
            swal.fire("Erro", "Não foi possível adicionar a conquista.", "error");
        } finally {
            setAdicionandoConquista(false);
        }
    }
    async function handleAdicionarImagem(e) {
        e.preventDefault();
        if (!novaImagemUrl) return;
        setAdicionandoImg(true);
        try {
            const payload = {
                url: novaImagemUrl,
                legenda: novaImagemLegenda || null,
                ordem: imagensAtuais.length
            };
            const response = await api.post(`/jogos/${id}/imagens`, payload);


            setImagensAtuais([...imagensAtuais, ...response.data]);
            setNovaImagemUrl("");
            setNovaImagemLegenda("");
            swal.fire("Adicionada!", "Imagem adicionada à galeria.", "success");
        } catch (error) {
            swal.fire("Erro", "Não foi possível adicionar a imagem.", "error");
        } finally {
            setAdicionandoImg(false);
        }
    }

    if (loading) return <Layout><h2 style={{ textAlign: "center", marginTop: "50px", color: "#ccc" }}>Carregando jogo...</h2></Layout>;

    return (
        <Layout>
            <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem 1.5rem" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "2rem", color: "#fff" }}>
                    Gerenciar Jogo
                </h1>


                <form onSubmit={handleSalvarEdicao} style={formBoxStyle}>
                    <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "var(--color-primary, #a78bfa)" }}>Editar Dados Gerais</h2>

                    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={labelStyle}>Título *</label>
                            <input type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)} style={inputStyle} />
                        </div>
                        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={labelStyle}>Desenvolvedora *</label>
                            <input type="text" required value={desenvolvedora} onChange={(e) => setDesenvolvedora(e.target.value)} style={inputStyle} />
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                        <div style={{ flex: "1 1 150px", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={labelStyle}>Preço (R$) *</label>
                            <input type="number" required min="0" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} style={inputStyle} />
                        </div>
                        <div style={{ flex: "1 1 150px", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={labelStyle}>Lançamento *</label>
                            <input type="date" required value={lancamento} onChange={(e) => setLancamento(e.target.value)} style={inputStyle} />
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1rem" }}>
                        <label style={labelStyle}>URL da Capa</label>
                        <input type="url" value={capaUrl} onChange={(e) => setCapaUrl(e.target.value)} style={inputStyle} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1rem" }}>
                        <label style={labelStyle}>Descrição *</label>
                        <textarea required rows={4} value={descricao} onChange={(e) => setDescricao(e.target.value)} style={{ ...inputStyle, resize: "vertical" }} />
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1.5rem" }}>
                        <label style={labelStyle}>Gêneros *</label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", padding: "10px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                            {generosDisponiveis.map((gen) => (
                                <label key={gen.id} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontSize: "0.9rem", color: "#fff" }}>
                                    <input type="checkbox" checked={generoIds.includes(gen.id)} onChange={() => handleGeneroToggle(gen.id)} style={{ accentColor: "#8b5cf6" }} />
                                    {gen.nome}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={salvando} style={buttonStyle}>
                        {salvando ? "Salvando..." : "Salvar Alterações"}
                    </button>
                </form>

                <div style={{ ...formBoxStyle, marginTop: "2rem" }}>
                    <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#10b981" }}>Galeria de Imagens</h2>

                    <form onSubmit={handleAdicionarImagem} style={{ display: "flex", gap: "10px", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                        <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={labelStyle}>URL da Nova Imagem *</label>
                            <input type="url" required value={novaImagemUrl} onChange={(e) => setNovaImagemUrl(e.target.value)} placeholder="https://..." style={inputStyle} />
                        </div>
                        <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={labelStyle}>Legenda (Opcional)</label>
                            <input type="text" value={novaImagemLegenda} onChange={(e) => setNovaImagemLegenda(e.target.value)} placeholder="Descrição curta..." style={inputStyle} />
                        </div>
                        <button type="submit" disabled={adicionandoImg} style={{ ...buttonStyle, background: "#10b981" }}>
                            {adicionandoImg ? "Enviando..." : "Adicionar Imagem"}
                        </button>
                    </form>

                    {imagensAtuais.length > 0 ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px" }}>
                            {imagensAtuais.map((img, idx) => (
                                <div key={idx} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                                    <img src={img.url} alt="Screenshot" style={{ width: "100%", height: "100px", objectFit: "cover", display: "block" }} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: "#aaa", fontSize: "0.9rem" }}>Nenhuma imagem adicionada ainda.</p>
                    )}
                    <div style={{ ...formBoxStyle, marginTop: "2rem" }}>
                        <h2 style={{ fontSize: "1.3rem", marginBottom: "1rem", color: "#f59e0b" }}>Conquistas</h2>

                        <form onSubmit={handleAdicionarConquista} style={{ display: "flex", gap: "10px", alignItems: "flex-end", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                            <div style={{ flex: "1 1 200px" }}>
                                <label style={labelStyle}>Título *</label>
                                <input type="text" required value={novaConquistaTitulo} onChange={(e) => setNovaConquistaTitulo(e.target.value)} style={inputStyle} />
                            </div>
                            <div style={{ flex: "1 1 300px" }}>
                                <label style={labelStyle}>Descrição</label>
                                <input type="text" value={novaConquistaDescricao} onChange={(e) => setNovaConquistaDescricao(e.target.value)} style={inputStyle} />
                            </div>
                            <button type="submit" disabled={adicionandoConquista} style={{ ...buttonStyle, background: "#f59e0b" }}>
                                {adicionandoConquista ? "Salvando..." : "Adicionar"}
                            </button>
                        </form>

                        <div style={{ display: "grid", gap: "10px" }}>
                            {conquistasAtuais.map((c, idx) => (
                                <div key={idx} style={{ background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <span style={{ fontWeight: 600 }}>🏆 {c.titulo}</span>
                                    {c.descricao && <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#aaa" }}>{c.descricao}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}


const formBoxStyle = { background: "var(--bg-surface, #1e1e1e)", padding: "2rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.06)" };
const labelStyle = { fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary, #aaa)" };
const inputStyle = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", padding: "10px 14px", color: "#fff", outline: "none" };
const buttonStyle = { background: "var(--color-primary, #8b5cf6)", color: "#fff", border: "none", padding: "10px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: 600, alignSelf: "flex-end" };