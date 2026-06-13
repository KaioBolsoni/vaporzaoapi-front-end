import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import GameCard from '../components/GameCard';
import PageTitle from '../components/PageTitle';
import EmptyState from '../components/EmptyState';
import ErrorCard from '../components/ErrorCard';
import swal from '../utils/swal';

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    async function removerWishlist(jogoId) {
        const confirmacao = await swal.fire({
            title: 'Tem certeza?',
            text: 'Deseja remover este jogo da sua wishlist?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#888',
            confirmButtonText: 'Sim, remover',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmacao.isConfirmed) return;

        try {
            await api.delete(`/wishlist/${jogoId}`);
            setWishlist(prev => prev.filter(item => (item.jogo?.id || item.id) !== jogoId));
            swal.fire({
                icon: 'success',
                title: 'Removido',
                text: 'Jogo removido da sua wishlist.',
                timer: 1500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Erro ao remover jogo da wishlist:', error);
            swal.fire({
                icon: 'error',
                title: 'Erro',
                text: error.response?.data?.erro || 'Não foi possível remover da wishlist.',
            });
        }
    }

    useEffect(() => {
        async function carregarDados() {
            try {
                const res = await api.get('/wishlist/me');
                setWishlist(res.data);
            } catch (error) {
                console.error('Erro ao carregar a wishlist:', error);
                setErro('Não foi possível carregar sua wishlist.');
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, []);

    return (
        <Layout>
            <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
                <PageTitle>Minha Wishlist</PageTitle>
                {loading ? (
                    <WishlistSkeleton />
                ) : erro ? (
                    <ErrorCard message={erro} />
                ) : wishlist.length === 0 ? (
                    <EmptyState message="Sua wishlist está vazia." />
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                        gap: '18px'
                    }}>
                        {wishlist.map((item) => {
                            const game = item.jogo || item;
                            return (
                                <div key={game.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <GameCard game={game} variant="catalog" />
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            removerWishlist(game.id);
                                        }}
                                        style={{
                                            background: 'rgba(239,68,68,0.1)',
                                            color: '#ef4444',
                                            border: '1px solid rgba(239,68,68,0.3)',
                                            padding: '8px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            width: '100%',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                                    >
                                        Remover
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
}

function WishlistSkeleton() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '18px' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: '310px', borderRadius: '10px' }} />
      ))}
    </div>
  );
}
