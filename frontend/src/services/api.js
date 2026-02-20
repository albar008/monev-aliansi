import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.PROD ? 'https://monev-aliansi-api.entliven.com/api' : '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

let isRedirecting = false;

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const currentPath = window.location.pathname;
    
    if (error.response?.status === 401) {
      const isAuthRoute = currentPath === '/login';
      const hasToken = !!localStorage.getItem('token');
      
      if (!isAuthRoute && hasToken && !isRedirecting) {
        isRedirecting = true;
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?reason=idle';
      }
    }
    if (error.response?.status === 403 && !isRedirecting) {
      isRedirecting = true;
      window.location.href = '/unauthorized';
    }
    return Promise.reject(error);
  }
);

export const getCaptcha = async () => {
  const response = await api.get('/captcha');
  return response.data;
};

export default api;
