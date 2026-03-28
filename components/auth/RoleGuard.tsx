"use client";
import { useSession } from "next-auth/react";
import React from "react";

type Role = "candidate" | "employer" | "admin";

export default function RoleGuard({
    allow,
    children,
}: {
    allow: Role[] | Role;
    children: React.ReactNode;
}) {
    const { data } = useSession();
    const roles = Array.isArray(allow) ? allow : [allow];
    const role = data?.user?.role as Role | undefined;
    if (!role) return null;
    if (!roles.includes(role)) return null;
    return <>{children}</>;
}
