import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://alunos-ads-api-production.up.railway.app',
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.token = token;
  }

  return config;
});

export default api;