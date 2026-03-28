import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth/options";
// import NextAuth from "next-auth";
// import { authOptions } from "@/lib/auth";

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
