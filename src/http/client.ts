import axios from "axios";
import { useAuthStore } from "../store";
import type { AxiosInstance } from "axios";

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const collectionApi = axios.create({
  baseURL: import.meta.env.VITE_COLLECTION_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const orderApi = axios.create({
  baseURL: import.meta.env.VITE_ORDER_API,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const refreshToken = async () => {
    await axios.post(
        `${import.meta.env.VITE_AUTH_API}/auth/refresh`,
        {},
        {
            withCredentials: true,
        }
    );
};

const addInterceptors = (apiInstance: AxiosInstance) => {
  apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
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

addInterceptors(authApi);
addInterceptors(collectionApi);
addInterceptors(orderApi);