import { useState, useEffect } from 'react';
import api from '../services/api';

export function useGeneros() {
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/generos')
      .then((res) => setGeneros(res.data || []))
      .catch(() => setGeneros([]))
      .finally(() => setLoading(false));
  }, []);

  return { generos, loading };
}
