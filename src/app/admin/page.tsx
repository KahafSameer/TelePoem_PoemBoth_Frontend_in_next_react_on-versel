"use client";

import Link from "next/link";
import { useFetch } from "@/lib/hooks/useFetch";
import { boothAPI } from "@/lib/api/booths";
import { collectionAPI } from "@/lib/api/collections";
import { poemAPI } from "@/lib/api/poems";
import { poetAPI } from "@/lib/api/poets";

// Inline SVG icons
function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function DocumentTextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

interface StatCardConfig {
  label: string;
  value: number;
  href: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  linkColor: string;
}

export default function AdminOverviewPage() {
  const booths = useFetch(boothAPI.getAll);
  const collections = useFetch(collectionAPI.getAll);
  const poems = useFetch(poemAPI.getAll);
  const poets = useFetch(poetAPI.getAll);

  const statCards: StatCardConfig[] = [
    {
      label: "Booths",
      value: booths.data?.length ?? 0,
      href: "/admin/booths",
      icon: <MapPinIcon className="h-6 w-6" />,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-700",
      linkColor: "text-indigo-600 hover:text-indigo-800",
    },
    {
      label: "Collections",
      value: collections.data?.length ?? 0,
      href: "/admin/collections",
      icon: <BookOpenIcon className="h-6 w-6" />,
      iconBg: "bg-violet-50",
      iconColor: "text-violet-700",
      linkColor: "text-violet-600 hover:text-violet-800",
    },
    {
      label: "Poems",
      value: poems.data?.length ?? 0,
      href: "/admin/poems",
      icon: <DocumentTextIcon className="h-6 w-6" />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-700",
      linkColor: "text-amber-600 hover:text-amber-800",
    },
    {
      label: "Poets",
      value: poets.data?.length ?? 0,
      href: "/admin/poets",
      icon: <UserIcon className="h-6 w-6" />,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-700",
      linkColor: "text-emerald-600 hover:text-emerald-800",
    },
  ];

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
          >
            {/* Icon circle */}
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${card.iconBg} ${card.iconColor}`}
            >
              {card.icon}
            </div>

            {/* Count */}
            <p className="mt-3 text-4xl font-bold text-slate-900">{card.value}</p>

            {/* Label */}
            <p className="mt-1 text-sm text-slate-500">{card.label}</p>

            {/* View all link */}
            <Link
              href={card.href}
              className={`mt-3 inline-block text-xs font-medium ${card.linkColor} transition-colors`}
            >
              View all →
            </Link>
          </div>
        ))}
      </div>

      {/* Quick-action buttons — outlined, color-matched */}
      <div className="flex flex-wrap gap-3">
        <Link
          className="rounded-md border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
          href="/admin/booths"
        >
          + Add Booth
        </Link>
        <Link
          className="rounded-md border border-violet-600 px-4 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 transition-colors"
          href="/admin/collections"
        >
          + Add Collection
        </Link>
        <Link
          className="rounded-md border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
          href="/admin/poets"
        >
          + Add Poet
        </Link>
        <Link
          className="rounded-md border border-amber-600 px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 transition-colors"
          href="/admin/poems"
        >
          + Add Poem
        </Link>
      </div>
    </section>
  );
}
