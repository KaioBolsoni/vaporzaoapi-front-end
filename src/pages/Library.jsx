import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import swal from '../utils/swal';
import Layout from '../components/Layout';
import PageTitle from '../components/PageTitle';
import EmptyState from '../components/EmptyState';
import ErrorCard from '../components/ErrorCard';

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
            } catch {
                setErro('Não foi possível carregar os seus jogos salvos.');
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, []);



    async function salvarHoras(jogoId) {
        const horas = parseInt(horasInput, 10);

        if (isNaN(horas) || horas < 0 || horas > 99999) {
            swal.fire({
                icon: 'warning',
                title: 'Valor inválido',
                text: 'Insira um número de horas válido (entre 0 e 99999).',
            });
            return;
        }

        try {
            await api.patch(`/biblioteca/${jogoId}`, { horasJogadas: horas });

            setBiblioteca((prevBiblio) =>
                prevBiblio.map((item) =>
                    item.jogo.id === jogoId ? { ...item, horasJogadas: horas } : item
                )
            );

            setEditandoId(null);

            swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Horas atualizadas com sucesso.',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            swal.fire({
                icon: 'error',
                title: 'Erro',
                text: error.response?.data?.erro || 'Não foi possível atualizar as horas.',
            });
        }
    }

    async function removerBiblioteca(jogoId) {
        const itemBiblioteca = biblioteca.find((item) => item.jogo.id === jogoId);
        
        if (itemBiblioteca && itemBiblioteca.jogo.preco > 0) {
            swal.fire({
                icon: 'warning',
                title: 'Não permitido',
                text: 'Apenas jogos gratuitos podem ser removidos da biblioteca.',
            });
            return;
        }

        const confirmacao = await swal.fire({
            title: 'Tem certeza?',
            text: 'Você realmente deseja remover este jogo da sua biblioteca?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#888',
            confirmButtonText: 'Sim, remover',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmacao.isConfirmed) {
            return;
        }

        try {
            await api.delete(`/biblioteca/${jogoId}`);
            setBiblioteca((prev) => prev.filter((item) => item.jogo.id !== jogoId));
            swal.fire({
                icon: 'success',
                title: 'Removido',
                text: 'Jogo removido da sua biblioteca.',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            swal.fire({
                icon: 'error',
                title: 'Erro',
                text: error.response?.data?.erro || 'Não foi possível remover da biblioteca.',
            });
        }
    }

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

                <PageTitle divider>Minha Biblioteca</PageTitle>


                {loading ? (
                    <LibrarySkeleton />
                ) : erro ? (
                    <ErrorCard message={erro} />
                ) : biblioteca.length === 0 ? (
                    <EmptyState message="Você ainda não adicionou nenhum jogo à sua biblioteca." />
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
                                                <div style={{ display: 'flex', gap: '8px' }}>
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
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => removerBiblioteca(item.jogo.id)}
                                                        style={{
                                                            background: 'rgba(239,68,68,0.1)',
                                                            color: '#ef4444',
                                                            border: '1px solid rgba(239,68,68,0.3)',
                                                            padding: '4px 8px',
                                                            borderRadius: '6px',
                                                            cursor: 'pointer',
                                                            fontSize: '0.8rem',
                                                        }}
                                                    >
                                                        Remover
                                                    </button>
                                                </div>
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

function LibrarySkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: '380px', borderRadius: '12px' }} />
      ))}
    </div>
  );
}