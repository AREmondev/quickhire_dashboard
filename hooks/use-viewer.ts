
import { useQuery } from "@tanstack/react-query";
import { get } from "@/lib/api";
import { User } from "@/lib/api/types";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { signIn } from "next-auth/react";

export const useViewer = () => {
  const { data: session } = useSession();
  const { data, ...rest } = useQuery<User>({
    queryKey: ["viewer"],
    queryFn: () => get<User>("/auth/me"),
    enabled: !!session,
  });

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      signIn("credentials", { redirect: false });
    }
  }, [session]);

  return { user: data, ...rest };
};
