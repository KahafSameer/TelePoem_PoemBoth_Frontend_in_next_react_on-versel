"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function isActive(pathname: string, href: string): boolean {
  if (href === "/client") return pathname === "/client";
  return pathname.startsWith(href);
}

const navLinks = [
  { href: "/client", label: "Home" },
  { href: "/client/poets", label: "Poets" },
  { href: "/client/search", label: "Search" },
];

export default function TelegramLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/30 to-white">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          {/* Brand */}
          <Link
            href="/client"
            className="flex items-center gap-2 text-xl font-semibold text-indigo-700 hover:opacity-80 transition-opacity"
          >
            <span aria-hidden="true">📜</span>
            TelePoem
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${active
                      ? "border-b-2 border-indigo-600 text-indigo-700"
                      : "text-slate-600 hover:text-slate-900"
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/"
              className="ml-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors"
            >
              ← Home
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
