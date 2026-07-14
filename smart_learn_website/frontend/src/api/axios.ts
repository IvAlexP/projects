import axios from "axios";

declare const __BACKEND_PORT__: number;
declare const __BACKEND_HOST__: string;
const BACKEND_URL = `${__BACKEND_HOST__}:${__BACKEND_PORT__}`;

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh" &&
      originalRequest.url !== "/auth/login" &&
      originalRequest.url !== "/auth/verifyEmail" &&
      !originalRequest.url?.includes("/auth/verifyEmail")
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        window.dispatchEvent(new Event("force-logout"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
