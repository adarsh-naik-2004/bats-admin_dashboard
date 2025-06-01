import axios from "axios";
import { useAuthStore } from "../store";
import type { AxiosInstance } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_GATEWAY,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

const refreshToken = async () => {
  await api.post('/auth/refresh', {}, {
            withCredentials: true,
        });
};

const addInterceptors = (apiInstance: AxiosInstance) => {
  apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      const authStore = useAuthStore.getState();
      
      const isAuthenticated = authStore.isAuthenticated;

      if (error.response?.status === 401 && !originalRequest._retry && isAuthenticated) {
        try {
          originalRequest._retry = true;
          await refreshToken();
          return apiInstance.request(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh error', refreshError);
          useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

addInterceptors(api);