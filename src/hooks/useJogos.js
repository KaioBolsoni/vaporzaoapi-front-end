import { useState, useEffect } from 'react';
import api from '../services/api';

export function useJogos() {
  const [jogos, setJogos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/jogos?limite=100')
      .then((res) => {
        const raw = res.data;
        setJogos(Array.isArray(raw) ? raw : raw?.itens || []);
      })
      .catch((err) => {
        setJogos([]);
        setError(err.message || 'Erro ao carregar jogos');
      })
      .finally(() => setLoading(false));
  }, []);

  return { jogos, loading, error };
}
