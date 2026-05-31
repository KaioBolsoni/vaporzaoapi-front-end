import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import swal from '../utils/swal';
import Layout from '../components/Layout';

export default function Library() {
    const [biblioteca, setBiblioteca] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);
    const [matricula, setMatricula] = useState("");

    const [editandoId, setEditandoId] = useState(null);
    const [horasInput, setHorasInput] = useState("");

    useEffect(() => {
        async function carregarDados() {
            try {

                const [biblioRes, userRes] = await Promise.all([
                    api.get('/biblioteca/me'),
                    api.get('/auth/me')
                ]);

                setBiblioteca(biblioRes.data);
                setMatricula(userRes.data.matricula);
            } catch (error) {
                console.error('Erro ao carregar os dados:', error);
                setErro('Não foi possível carregar os seus jogos salvos.');
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, []);
    return (
        <Layout>
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem 3rem' }}>

                {/* BOTÕES DE NAVEGAÇÃO EM CIMA */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '2rem' }}>
                    <Link
                        to="/"
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--text-primary, #fff)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            transition: 'background 0.2s'
                        }}
                    >
                        ← Voltar ao Catálogo
                    </Link>
                    <Link
                        to={matricula ? `/perfil/${matricula}` : "#"}
                        style={{
                            background: 'rgba(139,92,246,0.15)',
                            color: 'var(--color-primary, #a78bfa)',
                            border: '1px solid rgba(139,92,246,0.3)',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            transition: 'background 0.2s',

                            pointerEvents: matricula ? 'auto' : 'none',
                            opacity: matricula ? 1 : 0.5
                        }}
                    >
                        Meu Perfil 👤
                    </Link>
                </div>


                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    marginBottom: '2rem',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    paddingBottom: '15px',
                    color: 'var(--text-primary, #fff)'
                }}>
                    Minha Biblioteca
                </h1>

                {/* JOGOS NA PARTE DE BAIXO */}
                {loading ? (
                    <h2 style={{ color: 'var(--text-muted, #888)', textAlign: 'center' }}>Carregando sua biblioteca...</h2>
                ) : erro ? (
                    <h2 style={{ color: 'var(--color-error, #ef4444)', textAlign: 'center' }}>{erro}</h2>
                ) : biblioteca.length === 0 ? (
                    <p style={{ color: 'var(--text-muted, #888)', fontSize: '1.1rem' }}>
                        Você ainda não adicionou nenhum jogo à sua biblioteca.
                    </p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: '20px'
                    }}>
                        {biblioteca.map((item) => (
                            <div
                                key={item.jogo.id}
                                style={{
                                    background: 'var(--bg-surface, #1e1e1e)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                                }}
                            >
                                <img
                                    src={item.jogo.capaUrl || 'https://via.placeholder.com/240x300?text=Sem+Capa'}
                                    alt={item.jogo.titulo}
                                    style={{ width: '100%', height: '280px', objectFit: 'cover' }}
                                />
                                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                    <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary, #fff)' }}>
                                        {item.jogo.titulo}
                                    </h3>
                                    <p style={{ margin: '0 0 16px 0', fontSize: '0.85rem', color: 'var(--text-muted, #888)' }}>
                                        {item.jogo.desenvolvedora}
                                    </p>


                                    <div style={{
                                        marginTop: 'auto',
                                        paddingTop: '12px',
                                        borderTop: '1px solid rgba(255,255,255,0.06)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        {editandoId === item.jogo.id ? (
                                            <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="99999"
                                                    value={horasInput}
                                                    onChange={(e) => setHorasInput(e.target.value)}
                                                    style={{
                                                        width: '60px',
                                                        padding: '6px',
                                                        borderRadius: '6px',
                                                        border: '1px solid rgba(255,255,255,0.2)',
                                                        background: 'rgba(0,0,0,0.2)',
                                                        color: '#fff',
                                                        outline: 'none',
                                                        fontFamily: 'inherit'
                                                    }}
                                                />
                                                <button
                                                    onClick={() => salvarHoras(item.jogo.id)}
                                                    style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                                                >
                                                    Salvar
                                                </button>
                                                <button
                                                    onClick={() => setEditandoId(null)}
                                                    style={{ background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.5)', padding: '0 8px', borderRadius: '6px', cursor: 'pointer' }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <span style={{ fontWeight: 700, color: '#10b981', fontSize: '0.9rem' }}>
                                                    {item.horasJogadas} hrs
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        setEditandoId(item.jogo.id);
                                                        setHorasInput(item.horasJogadas);
                                                    }}
                                                    style={{
                                                        background: 'transparent',
                                                        color: 'var(--text-secondary, #aaa)',
                                                        border: '1px solid rgba(255,255,255,0.1)',
                                                        padding: '4px 8px',
                                                        borderRadius: '6px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    ✏️ Editar
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}