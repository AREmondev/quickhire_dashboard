"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { textVariants } from "@/components/ui/Text";
import Image from "next/image";
import { IMAGES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/jobs", label: "Find Jobs" },
  { href: "/applications", label: "My Applications" },
  { href: "/profile", label: "My Profile" },
  { href: "/resume", label: "Resume" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full fixed top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border py-[14px]">
      <div className="container flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src={IMAGES.LOGO}
            alt="QuickHire logo"
            width={120}
            height={40}
          />
        </Link>

        {/* Desktop nav */}
        {/* <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  textVariants({ variant: "body_md" }),
                  "px-4 py-2 transition-colors font-medium",
                  isActive
                    ? "text-primary bg-primary/5"
                    : "text-neutral-60 hover:text-neutral-100"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav> */}

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="transparent"
            className="text-neutral-60 hover:text-primary"
          >
            Login
          </Button>
          <div className="h-6 w-px bg-border" />
          <Button>Sign Up</Button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 bg-neutral-100 transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`w-6 h-0.5 bg-neutral-100 transition-all ${mobileOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`w-6 h-0.5 bg-neutral-100 transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-border animate-slideDown">
          <div className="container py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-4 py-3 font-medium text-[15px] transition-colors",
                    isActive ? "text-primary bg-primary/5" : "text-neutral-60",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="flex gap-3 mt-4 pt-4 border-t border-border">
              <Button variant="transparent" className="flex-1">
                Login
              </Button>
              <Button className="flex-1">Sign Up</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
