import "next-auth";
import { DefaultSession } from "next-auth";
import { User as AppUser } from "@/lib/api/types";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: AppUser;
    accessToken: string;
    refreshToken: string;
    error?: string;
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: AppUser["role"];
    companyId?: string;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    error?: string;
    user?: AppUser;
  }
}

