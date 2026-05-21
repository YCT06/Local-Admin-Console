import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const client = axios.create({ baseURL: "/api" });

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  const locale = localStorage.getItem("i18nextLng") ?? "zh-TW";
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else if (!config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["Accept-Language"] = locale;
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? "";
      if (!url.includes("/auth/login")) {
        useAuthStore.getState().logout();
      }
    }
    return Promise.reject(error);
  },
);

export default client;
