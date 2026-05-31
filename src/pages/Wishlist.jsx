import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import GameCard from '../components/GameCard';

export default function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        async function carregarDados() {
            try {
                const res = await api.get('/wishlist/me');
                setWishlist(res.data);
            } catch (error) {
                console.error('Erro ao carregar a wishlist:', error);
                try {
                    const res2 = await api.get('/wishlist');
                    setWishlist(res2.data);
                } catch (error2) {
                    setErro('Não foi possível carregar sua wishlist.');
                }
            } finally {
                setLoading(false);
            }
        }
        carregarDados();
    }, []);

    return (
        <Layout>
            <div style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Minha Wishlist</h1>
                {loading ? (
                    <p style={{ color: 'var(--text-muted)' }}>Carregando...</p>
                ) : erro ? (
                    <p style={{ color: 'var(--color-error)' }}>{erro}</p>
                ) : wishlist.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>Sua wishlist está vazia.</p>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
                        gap: '18px'
                    }}>
                        {wishlist.map((item) => {
                            const game = item.jogo || item;
                            return (
                                <GameCard key={game.id} game={game} variant="catalog" />
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
}
