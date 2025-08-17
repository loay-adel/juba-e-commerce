// lib/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.API_URL || "http://localhost:8000",
});

// Add request interceptor for auth token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
