import { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';

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
            <div style={{ padding: '2rem' }}>
                <h1>Minha Wishlist</h1>
                {loading ? (
                    <p>Carregando...</p>
                ) : erro ? (
                    <p>{erro}</p>
                ) : wishlist.length === 0 ? (
                    <p>Sua wishlist está vazia.</p>
                ) : (
                    <ul>
                        {wishlist.map((item) => (
                            <li key={item.jogo?.id || item.id}>
                                {item.jogo ? item.jogo.titulo : item.titulo}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </Layout>
    );
}
