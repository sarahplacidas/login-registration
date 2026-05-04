import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // send session cookie with every request
});

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
  checkPasswordStrength: (password) => api.post('/auth/password-strength', { password }),
};

export default api;
