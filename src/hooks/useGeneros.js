import { useState, useEffect } from 'react';
import api from '../services/api';

export function useGeneros() {
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/generos')
      .then((res) => setGeneros(res.data || []))
      .catch((err) => {
        setGeneros([]);
        setError(err.message || 'Erro ao carregar gêneros');
      })
      .finally(() => setLoading(false));
  }, []);

  return { generos, loading, error };
}
