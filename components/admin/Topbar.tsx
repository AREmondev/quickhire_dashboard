"use client";
import { RiNotification3Line, RiSearchLine } from "react-icons/ri";
import { useSession } from "next-auth/react";

interface AdminTopbarProps {
  title: string;
  subtitle?: string;
}

export default function AdminTopbar({ title, subtitle }: AdminTopbarProps) {
  const { data: session } = useSession();
  const user = session?.user;

    return (
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-border px-6 py-3 flex items-center justify-between gap-4">
            <div>
                <h1 className="text-[17px] font-bold text-neutral-100 font-clash">{title}</h1>
                {subtitle && <p className="text-xs text-neutral-60 mt-0.5">{subtitle}</p>}
            </div>

            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="hidden md:flex items-center gap-2 bg-light-gray border border-border rounded-lg px-3 py-2 text-sm text-neutral-60 w-48 focus-within:border-primary transition-colors">
                    <RiSearchLine className="shrink-0 text-[15px]" />
                    <input
                        placeholder="Search…"
                        className="bg-transparent outline-none w-full text-neutral-100 placeholder:text-neutral-60 text-sm"
                    />
                </div>

                {/* Bell */}
                <button className="relative p-2 rounded-lg hover:bg-light-gray transition-colors">
                    <RiNotification3Line className="text-[20px] text-neutral-60" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-red rounded-full" />
                </button>

                {/* Avatar */}
                <div className="flex items-center gap-2 pl-2 border-l border-border">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                        {user?.name?.[0]?.toUpperCase() ?? "A"}
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-xs font-semibold text-neutral-100 leading-tight">{user?.name ?? "Admin"}</p>
                        <p className="text-[10px] text-neutral-60 capitalize">{user?.role ?? "admin"}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
