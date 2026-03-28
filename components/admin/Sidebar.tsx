"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
    RiDashboardLine,
    RiBriefcaseLine,
    RiUserLine,
    RiBuilding2Line,
    RiPriceTag3Line,
    RiFileList3Line,
    RiSettingsLine,
    RiLogoutBoxLine,
    RiMenuFoldLine,
    RiMenuUnfoldLine,
} from "react-icons/ri";
import { useState } from "react";
import Image from "next/image";
import { IMAGES } from "@/lib/constants";

const NAV = [
    { href: "/admin", label: "Dashboard", icon: RiDashboardLine },
    { href: "/admin/jobs", label: "Jobs", icon: RiBriefcaseLine },
    { href: "/admin/applications", label: "Applications", icon: RiFileList3Line },
    { href: "/admin/companies", label: "Companies", icon: RiBuilding2Line },
    { href: "/admin/categories", label: "Categories", icon: RiPriceTag3Line },
    { href: "/admin/experience-levels", label: "Experience Levels", icon: RiFileList3Line },
    { href: "/admin/job-types", label: "Job Types", icon: RiFileList3Line },
];

const SETTINGS_NAV = [
    { href: "/admin/settings", label: "Settings", icon: RiSettingsLine },
];

function NavItem({
    href,
    label,
    icon: Icon,
    collapsed,
    active,
}: {
    href: string;
    label: string;
    icon: React.ElementType;
    collapsed: boolean;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            title={label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative
        ${active
                    ? "bg-primary text-white shadow-sm"
                    : "text-neutral-60 hover:bg-light-gray hover:text-neutral-100"
                }
      `}
        >
            <Icon
                className={`text-[18px] shrink-0 ${active ? "text-white" : "text-neutral-60 group-hover:text-primary"}`}
            />
            {!collapsed && <span>{label}</span>}
            {collapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 bg-neutral-100 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    {label}
                </span>
            )}
        </Link>
    );
}

export default function AdminSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const user = session?.user as any;
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        signOut({ callbackUrl: "/login" });
    };

    const isActive = (href: string) =>
        href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

    return (
        <aside
            className={`flex flex-col h-screen bg-white border-r border-border sticky top-0 transition-all duration-300 ${collapsed ? "w-[68px]" : "w-[240px]"}`}
        >
            {/* Logo */}
            <div className={`flex items-center gap-2 px-4 py-5 border-b border-border ${collapsed ? "justify-center" : ""}`}>
                <Image
                    src={IMAGES.LOGO}
                    alt="QuickHire"
                    width={28}
                    height={28}
                    className="shrink-0"
                />
                {!collapsed && (
                    <span className="font-bold text-neutral-100 font-clash text-[15px] tracking-tight">
                        QuickHire
                    </span>
                )}
            </div>

            {/* Collapse toggle */}
            <button
                onClick={() => setCollapsed((c) => !c)}
                className="mx-auto mt-3 mb-1 p-1.5 rounded-md text-neutral-60 hover:bg-light-gray hover:text-primary transition-colors"
                title={collapsed ? "Expand" : "Collapse"}
            >
                {collapsed ? (
                    <RiMenuUnfoldLine className="text-[18px]" />
                ) : (
                    <RiMenuFoldLine className="text-[18px]" />
                )}
            </button>

            {/* Main nav */}
            <nav className="flex-1 px-3 pt-2 space-y-1 overflow-y-auto scrollbar-hide">
                {!collapsed && (
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-60 px-2 mb-2">
                        Main
                    </p>
                )}
                {NAV.map((item) => (
                    <NavItem
                        key={item.href}
                        {...item}
                        collapsed={collapsed}
                        active={isActive(item.href)}
                    />
                ))}

                {!collapsed && (
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-60 px-2 mb-2 mt-4">
                        Settings
                    </p>
                )}
                {collapsed && <div className="my-3 border-t border-border" />}
                {SETTINGS_NAV.map((item) => (
                    <NavItem
                        key={item.href}
                        {...item}
                        collapsed={collapsed}
                        active={isActive(item.href)}
                    />
                ))}
            </nav>

            {/* User + logout */}
            <div className={`p-3 border-t border-border ${collapsed ? "flex justify-center" : ""}`}>
                {user && !collapsed && (
                    <div className="mb-2 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <RiUserLine className="text-primary text-[14px]" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-neutral-100 truncate">{user.name}</p>
                            <p className="text-[10px] capitalize text-neutral-60 truncate">{user.role}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    title="Logout"
                    className={`flex items-center gap-2.5 w-full text-sm font-medium text-neutral-60 hover:text-accent-red hover:bg-red-50 px-3 py-2 rounded-lg transition-colors ${collapsed ? "justify-center" : ""}`}
                >
                    <RiLogoutBoxLine className="text-[18px] shrink-0" />
                    {!collapsed && "Logout"}
                </button>
            </div>
        </aside>
    );
}
