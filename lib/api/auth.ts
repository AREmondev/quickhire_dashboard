import type { AuthUser, User } from "./types";
import apiClient, { publicApiClient } from "@/lib/axios";
import { API_ENDPOINTS } from "./endpoints";

export async function login(
  email: string,
  password: string,
): Promise<AuthUser> {
  try {
    const response = await publicApiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

export async function register(
  email: string,
  password: string,
  name: string,
  role: "candidate" | "employer" | "admin" = "employer",
  companyId?: string,
): Promise<AuthUser> {
  const res = await publicApiClient.post<{ success: true; data: AuthUser }>(
    API_ENDPOINTS.AUTH.REGISTER,
    {
      email,
      password,
      name,
      role,
      companyId,
    },
  );
  return res.data.data;
}

export async function refreshTokens(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const res = await publicApiClient.post<{
    success: true;
    data: { accessToken: string; refreshToken: string };
  }>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
  return res.data.data;
}

export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
}

export async function getMe(): Promise<User> {
  const res = await apiClient.get<{ success: true; data: User }>(
    API_ENDPOINTS.AUTH.ME,
  );
  return res.data.data;
}
