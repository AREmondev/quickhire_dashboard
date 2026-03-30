import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import { API_ENDPOINTS } from "./api/endpoints";

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

// Public instance for requests that don't need auth or handle it differently
export const publicApiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const apiClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.request.use(
  async (config) => {
    // Only get session on client-side
    if (typeof window !== "undefined") {
      const session = await getSession();
      const accessToken = (session as any)?.accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const session = await getSession();
        if (!session?.refreshToken) {
          throw new Error("No refresh token");
        }

        // Use publicApiClient to avoid interceptors and recursion
        const res = await publicApiClient.post(API_ENDPOINTS.AUTH.REFRESH, {
          refreshToken: session.refreshToken,
        });

        const newTokens = res.data.data;
        if (newTokens?.accessToken) {
          const newToken = newTokens.accessToken;
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
        throw new Error("No access token returned");
      } catch (refreshError) {
        processQueue(refreshError, null);
        await signOut({ redirect: false });
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
