"use client";
import AdminSidebar from "@/components/admin/Sidebar";
import AuthGuard from "@/components/auth/AuthGuard";
import RoleGuard from "@/components/auth/RoleGuard";
import { usePathname } from "next/navigation";
import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage =
    pathname === "/admin/login" || pathname === "/admin/register";
  return (
    <AuthGuard>
      {isAuthPage ? (
        <>{children}</>
      ) : (
        <div className="min-h-screen w-full bg-light-gray/30 flex">
          <AdminSidebar />
          <RoleGuard allow={["admin", "employer"]}>
            <div className="flex-1 min-w-0 flex flex-col">{children}</div>
          </RoleGuard>
        </div>
      )}
    </AuthGuard>
  );
}
