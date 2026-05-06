"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { boothAPI } from "@/lib/api/booths";
import { poetAPI } from "@/lib/api/poets";
import { useFetch } from "@/lib/hooks/useFetch";
import { UI_CONSTANTS } from "@/lib/constants/ui";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";

const MapPinIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="h-4 w-4 shrink-0 text-indigo-400"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-2.003 3.5-4.697 3.5-8.327a8 8 0 0 0-16 0c0 3.63 1.556 6.324 3.5 8.327a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      clipRule="evenodd"
    />
  </svg>
);

export default function TelegramHomePage() {
  const router = useRouter();
  const { data, loading, error, refetch } = useFetch(boothAPI.getAll, {
    refetchInterval: UI_CONSTANTS.clientRefreshMs,
  });
  const { data: poets, loading: poetsLoading, error: poetsError } = useFetch(poetAPI.getAll);
  const [searchQuery, setSearchQuery] = useState("");

  // When the user types, filter booths locally.
  // When they press Enter or click the search icon, redirect to the full search page.
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/client/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const booths = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const activeBooths = (data ?? []).filter((booth) => booth.status === "ACTIVE");
    if (!q) return activeBooths;
    return activeBooths.filter(
      (booth) =>
        booth.location.toLowerCase().includes(q) || booth.theme.toLowerCase().includes(q),
    );
  }, [data, searchQuery]);

  const topPoets = useMemo(() => {
    return [...(poets ?? [])]
      .sort((a, b) => (b.poems?.length ?? 0) - (a.poems?.length ?? 0))
      .slice(0, 6);
  }, [poets]);

  return (
    <section className="space-y-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Select Booth</h2>
        <p className="mt-1 text-slate-600">Active booth locations refresh every 30 seconds.</p>
      </div>

      {/* Global search — filters booths locally, Enter redirects to full search */}
      <form onSubmit={handleSearchSubmit} className="mt-4 max-w-md">
        <SearchInput
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search poems, poets, collections, booths…"
        />
        {searchQuery.trim() && (
          <p className="mt-1.5 text-xs text-slate-500">
            Press{" "}
            <kbd className="rounded border border-slate-200 bg-slate-100 px-1 py-0.5 font-mono text-xs">
              Enter
            </kbd>{" "}
            to search everything, or browse booths below.
          </p>
        )}
      </form>

      {loading && (
        <div className="mt-6">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
          <p>{error}</p>
          <button
            type="button"
            className="mt-3 rounded-md bg-rose-600 px-3 py-2 text-white"
            onClick={() => void refetch()}
          >
            Retry
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {booths.map((booth) => (
          <Link
            key={booth.id}
            href={`/client/booth/${booth.id}`}
            className="rounded-2xl border border-indigo-100 bg-white shadow-sm overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            {/* 7.1 Gradient accent bar */}
            <div className="bg-gradient-to-r from-indigo-500 to-violet-500 h-1 rounded-t-2xl" />

            <div className="p-4">
              <div className="flex items-center justify-between">
                {/* 7.2 Map-pin icon beside location name */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <MapPinIcon />
                  <h3 className="text-xl font-semibold truncate">{booth.location}</h3>
                </div>
                <span className="ml-2 shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  Active
                </span>
              </div>

              {/* 7.3 Theme as styled badge */}
              <div className="mt-2">
                <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                  {booth.theme}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-500">
                Collections: {booth.boothCollections?.length ?? 0}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* 7.8 EmptyState for booths */}
      {!loading && !error && booths.length === 0 && (
        <EmptyState
          title={searchQuery ? `No booths match "${searchQuery}"` : "No active booths found."}
          description={searchQuery ? "Try a different search term." : "Check back later for active booths."}
        />
      )}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Poets</h2>
            <p className="mt-1 text-sm text-slate-600">
              Select a poet and listen to their poems.
            </p>
          </div>
          <Link
            href="/client/poets"
            className="rounded-md border border-indigo-200 bg-white px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
          >
            View all poets
          </Link>
        </div>

        {poetsLoading && <LoadingSpinner />}
        {poetsError && <p className="text-sm text-rose-700">{poetsError}</p>}

        {!poetsLoading && !poetsError && (
          <>
            {topPoets.length === 0 ? (
              /* 7.8 EmptyState for poets */
              <EmptyState
                title="No poets found."
                description="Poets will appear here once they are added."
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topPoets.map((poet) => (
                  <Link
                    key={poet.id}
                    href={`/client/poet/${poet.id}`}
                    className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      {/* 7.5 Gradient initial circle or image */}
                      {poet.image ? (
                        <Image
                          src={poet.image}
                          alt={poet.name}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center">
                          <span className="text-sm font-semibold text-white">
                            {poet.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-lg font-semibold text-slate-900 truncate">{poet.name}</h3>
                          {/* 7.6 Amber poem count badge */}
                          <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                            {poet.poems?.length ?? 0} poems
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 7.7 Bio with line-clamp-2 */}
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                      {poet.bio ?? "No biography available."}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </section>
  );
}
