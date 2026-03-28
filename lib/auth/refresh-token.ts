import { JWT } from "next-auth/jwt";
import { refreshTokens } from "@/lib/api/auth";

export const refreshToken = async (token: JWT): Promise<JWT> => {
  try {
    const response = await refreshTokens(token.refreshToken as string);

    return {
      ...token,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken ?? token.refreshToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };
  } catch (error) {
    console.error("Token refresh failed:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
};
