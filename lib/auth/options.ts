import { refreshToken } from "@/lib/auth/refresh-token";
import Credentials from "next-auth/providers/credentials";
import { login } from "@/lib/api/auth";
import type { User } from "@/lib/api/types";
import type { Session, AuthOptions, SessionStrategy } from "next-auth";
import type { JWT } from "next-auth/jwt";

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
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.user = user;
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        return token;
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      return refreshToken(token);
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user = token.user as User;
      session.accessToken = token.accessToken as string;
      session.error = token.error as string | undefined;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
