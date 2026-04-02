import axios from 'axios';
import keycloak from '../config/keycloak';

const api = axios.create({
  // En dev local, on tape sur le port forwardé ou l'ingress. 
  // Pour l'instant, on pointe vers le backend Spring Boot (qui sera sur le port 8081)
  baseURL: '/api' 
});

// Intercepteur : Avant chaque requête, on injecte le Token JWT
api.interceptors.request.use(
  (config) => {
    if (keycloak.token) {
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;