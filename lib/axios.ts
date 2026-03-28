import axios from "axios";
import { getSession, signIn } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const publicClient = axios.create({
  baseURL,
});

const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    // getSession() can be slow or problematic on server-side if not handled correctly.
    // For client-side, it's fine.
    if (typeof window !== "undefined") {
      const session = await getSession();
      const accessToken = (
        session as unknown as { accessToken?: string } | null
      )?.accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      originalRequest._retry = true;
      const session = await getSession();
      if (session?.error === "RefreshAccessTokenError") {
        await signIn("credentials", { redirect: false });
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
