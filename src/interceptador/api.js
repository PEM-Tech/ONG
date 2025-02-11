// interceptador/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/usuarios"; // URL base do backend

const api = axios.create({ baseURL: API_URL });

// Interceptor para adicionar o token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
