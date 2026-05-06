"use client";

import Link from "next/link";
import { use, useMemo, useState } from "react";
import { boothAPI } from "@/lib/api/booths";
import { useFetch } from "@/lib/hooks/useFetch";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SearchInput } from "@/components/shared/SearchInput";
import { sortPoemsByNumber } from "@/lib/utils/formatting";

export default function BoothViewPage({
  params,
}: {
  params: Promise<{ boothId: string }>;
}) {
  const { boothId } = use(params);
  const { data: booth, loading, error } = useFetch(() => boothAPI.getById(boothId));
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const collections = useMemo(
    () =>
      (booth?.boothCollections ?? [])
        .map((item) => item.collection)
        .filter((collection) => collection !== null),
    [booth],
  );

  const selectedCollection =
    collections.find((item) => item.id === selectedCollectionId) ?? collections[0];

  const sortedPoems = useMemo(
    () => sortPoemsByNumber(selectedCollection?.poems ?? []),
    [selectedCollection],
  );
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
  if (!booth) return <p>No booth found.</p>;

  return (
    <section className="space-y-5">
      <div>
        <Link href="/client" className="text-sm text-indigo-700 hover:underline">
          ← Back to booths
        </Link>
        <h2 className="mt-2 text-3xl font-bold">{booth.location}</h2>
        <p className="text-slate-600">{booth.theme}</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {collections.map((collection) => (
          <button
            key={collection.id}
            type="button"
            className={`rounded-full px-4 py-2 text-sm ${selectedCollection?.id === collection.id
              ? "bg-indigo-600 text-white"
              : "bg-white text-slate-700"
              } border`}
            onClick={() => setSelectedCollectionId(collection.id)}
          >
            {collection.name} ({collection.poems?.length ?? 0})
          </button>
        ))}
      </div>

      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search poems in this collection..."
        className="max-w-md"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {filteredPoems.map((poem) => (
          <Link
            key={poem.id}
            href={`/client/poem/${poem.id}?collection=${selectedCollection.id}`}
            className="rounded-xl border bg-white shadow-sm overflow-hidden transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* Poem image thumbnail — shown only when poem.image is set */}
            {poem.image && (
              <div className="relative h-36 w-full">
                <img
                  src={poem.image}
                  alt={poem.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-semibold">
                {poem.poemNo}. {poem.name}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{poem.description ?? "No description"}</p>
            </div>
          </Link>
        ))}
      </div>
      {filteredPoems.length === 0 && (
        <p className="text-sm text-slate-500">
          {searchQuery ? `No poems match "${searchQuery}"` : "No poems found in this collection."}
        </p>
      )}
    </section>
  );
}
