"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { poetAPI } from "@/lib/api/poets";
import { useFetch } from "@/lib/hooks/useFetch";
import { SearchInput } from "@/components/shared/SearchInput";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function ClientPoetsPage() {
  const { data: poets, loading, error } = useFetch(poetAPI.getAll);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPoets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return poets ?? [];
    return (poets ?? []).filter(
      (poet) =>
        poet.name.toLowerCase().includes(q) || (poet.bio ?? "").toLowerCase().includes(q),
    );
  }, [poets, searchQuery]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-rose-700">{error}</p>;

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Select Poet</h2>
        <p className="mt-1 text-slate-600">
          Choose a poet and listen to their poems.
        </p>
      </div>

      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by poet name or bio..."
        className="max-w-md"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPoets.map((poet) => (
          <Link
            key={poet.id}
            href={`/client/poet/${poet.id}`}
            className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{poet.name}</h3>
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700">
                {poet.poems?.length ?? 0} poems
              </span>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-slate-600">
              {poet.bio ?? "No biography available."}
            </p>
          </Link>
        ))}
      </div>

      {filteredPoets.length === 0 && (
        <p className="text-sm text-slate-500">
          {searchQuery ? `No poets match "${searchQuery}"` : "No poets available."}
        </p>
      )}
    </section>
  );
}
