import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const client = axios.create({ baseURL: '/api' });

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  const locale = localStorage.getItem('i18nextLng') ?? 'zh-TW';
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['Accept-Language'] = locale;
  return config;
});

export default client;
