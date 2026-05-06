"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { collectionAPI } from "@/lib/api/collections";
import { useFetch } from "@/lib/hooks/useFetch";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SearchInput } from "@/components/shared/SearchInput";
import { sortPoemsByNumber } from "@/lib/utils/formatting";

export default function CollectionPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = use(params);
  const { data, loading, error } = useFetch(() =>
    collectionAPI.getPoems(collectionId),
  );
  const [searchQuery, setSearchQuery] = useState("");

  const sortedPoems = useMemo(() => sortPoemsByNumber(data ?? []), [data]);
  const filteredPoems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sortedPoems;
    return sortedPoems.filter(
      (poem) =>
        poem.name.toLowerCase().includes(q) ||
        (poem.description ?? "").toLowerCase().includes(q) ||
        (poem.poet?.name ?? "").toLowerCase().includes(q),
    );
  }, [searchQuery, sortedPoems]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-rose-700">{error}</p>;

  return (
    <section>
      <h2 className="text-2xl font-semibold">Collection Poems</h2>
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by poem title, poet, or description..."
        className="mt-4 max-w-md"
      />
      <div className="mt-4 grid gap-3">
        {filteredPoems.map((poem) => (
          <Link
            key={poem.id}
            href={`/client/poem/${poem.id}?collection=${collectionId}`}
            className="rounded-lg border bg-white p-3"
          >
            {poem.poemNo}. {poem.name}
          </Link>
        ))}
      </div>
      {filteredPoems.length === 0 && (
        <p className="mt-4 text-sm text-slate-500">
          {searchQuery ? `No poems match "${searchQuery}"` : "No poems found in this collection."}
        </p>
      )}
    </section>
  );
}
