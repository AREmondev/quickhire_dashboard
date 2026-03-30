import Credentials from "next-auth/providers/credentials";
import { login, refreshTokens } from "@/lib/api/auth";
import type { User } from "@/lib/api/types";
import type { AuthOptions, SessionStrategy } from "next-auth";

const ACCESS_TOKEN_EXPIRES_MINUTES = parseInt(
  process.env.NEXT_PUBLIC_ACCESS_TOKEN_EXPIRES_MINUTES || "1440",
);
const ACCESS_TOKEN_EXPIRES_MS = ACCESS_TOKEN_EXPIRES_MINUTES * 60 * 1000;

export const authConfig: AuthOptions = {
  session: { strategy: "jwt" as SessionStrategy },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials as unknown as {
          email: string;
          password: string;
        };
        const { user, tokens } = await login(String(email), String(password));
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        const u = user as any;
        token.user = {
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role,
          companyId: u.companyId,
        } as User;
        token.accessToken = u.accessToken;
        token.refreshToken = u.refreshToken;
        token.accessTokenExpires = Date.now() + ACCESS_TOKEN_EXPIRES_MS;
      }

      // Handle manual session updates
      if (trigger === "update" && session?.user) {
        token.user = { ...token.user, ...session.user };
        if (session.user.accessToken)
          token.accessToken = session.user.accessToken;
        if (session.user.refreshToken)
          token.refreshToken = session.user.refreshToken;
      }

      // If the access token has not expired yet, just return the token
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // If the access token has expired, try to refresh it
      if (token.error === "RefreshAccessTokenError") {
        return token;
      }

      try {
        if (!token.refreshToken) {
          throw new Error("No refresh token available");
        }
        const newTokens = await refreshTokens(token.refreshToken as string);
        if (newTokens?.accessToken) {
          return {
            ...token,
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken ?? token.refreshToken,
            accessTokenExpires: Date.now() + ACCESS_TOKEN_EXPIRES_MS,
            error: undefined,
          };
        }
        throw new Error("Failed to refresh tokens");
      } catch (error) {
        console.error("Error refreshing access token", error);
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }
    },
    async session({ session, token }) {
      session.user = token.user as User;
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.error = token.error as string | undefined;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
