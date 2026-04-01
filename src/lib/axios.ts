import axios from "axios";
import Cookies from "js-cookie";

const rawBaseUrl = import.meta.env.VITE_APP_API_URL || "https://61922923-4543-4ae3-859e-28b74ddf48b2-00-1u2a16gl0wq0x.pike.replit.dev/api/v1";
const API_BASE_URL = rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: add token to headers
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("access_token", { path: "/" });
      if (window.location.pathname !== "/auth/login") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
