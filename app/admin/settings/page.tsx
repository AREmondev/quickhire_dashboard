"use client";

import AdminTopbar from "@/components/admin/Topbar";
import { useSession, signOut } from "next-auth/react";
import { AdminButton } from "@/components/admin/AdminButton";
import {
    RiUserLine,
    RiKeyLine,
    RiServerLine,
    RiLogoutBoxLine,
} from "react-icons/ri";

export default function AdminSettingsPage() {
    const { data: session } = useSession();
    const user = session?.user as any;

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    return (
        <>
            <AdminTopbar title="Settings" subtitle="Account and system settings" />
            <main className="flex-1 p-6 max-w-2xl space-y-5">
                {/* Profile info */}
                <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-border">
                        <RiUserLine className="text-primary text-xl" />
                        <h2 className="text-sm font-bold text-neutral-100">Profile</h2>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <p className="text-xs font-medium text-neutral-60 uppercase tracking-wider mb-1">Name</p>
                            <p className="text-sm font-semibold text-neutral-100">{user?.name ?? "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-neutral-60 uppercase tracking-wider mb-1">Email</p>
                            <p className="text-sm font-semibold text-neutral-100">{user?.email ?? "—"}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium text-neutral-60 uppercase tracking-wider mb-1">Role</p>
                            <p className="text-sm font-semibold text-neutral-100 capitalize">{user?.role ?? "—"}</p>
                        </div>
                        {user?.companyId && (
                            <div>
                                <p className="text-xs font-medium text-neutral-60 uppercase tracking-wider mb-1">Company ID</p>
                                <p className="text-sm font-mono text-neutral-60">{user.companyId}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* API Info */}
                <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-border">
                        <RiServerLine className="text-accent-blue text-xl" />
                        <h2 className="text-sm font-bold text-neutral-100">Backend Connection</h2>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-neutral-60 uppercase tracking-wider mb-1">API Base URL</p>
                        <p className="text-sm font-mono text-neutral-80">
                            {process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}
                        </p>
                    </div>
                    <p className="text-xs text-neutral-60">
                        Configure <code className="bg-light-gray px-1 py-0.5 rounded text-neutral-80">NEXT_PUBLIC_API_URL</code> in your{" "}
                        <code className="bg-light-gray px-1 py-0.5 rounded text-neutral-80">.env.local</code> file.
                    </p>
                </div>

                {/* Security */}
                <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-border">
                        <RiKeyLine className="text-accent-yellow text-xl" />
                        <h2 className="text-sm font-bold text-neutral-100">Security</h2>
                    </div>
                    <p className="text-xs text-neutral-60 leading-relaxed">
                        Your session is stored in localStorage. The admin API key is kept server-side in
                        <code className="bg-light-gray px-1 py-0.5 rounded text-neutral-80 mx-1">ADMIN_API_KEY</code>
                        and is never exposed to the browser.
                    </p>
                </div>

                {/* Sign out */}
                <AdminButton
                    variant="danger"
                    leftIcon={<RiLogoutBoxLine />}
                    onClick={handleLogout}
                >
                    Sign Out
                </AdminButton>
            </main>
        </>
    );
}
