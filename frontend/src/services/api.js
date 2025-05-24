// src/services/api.js
import axios from 'axios';
import { BASE_URL, getToken } from '../utils';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // jika backend pakai cookie
});

// Tambahkan interceptor (jika pakai token)
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
