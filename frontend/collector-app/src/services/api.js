import axios from 'axios';
import keycloak from '../config/keycloak';

const api = axios.create({
  baseURL: '/api' 
});

api.interceptors.request.use(
  (config) => {
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;