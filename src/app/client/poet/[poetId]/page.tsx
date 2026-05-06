"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useMemo, useState } from "react";
import { poetAPI } from "@/lib/api/poets";
import { useFetch } from "@/lib/hooks/useFetch";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { sortPoemsByNumber } from "@/lib/utils/formatting";

export default function PoetProfilePage({
  params,
}: {
  params: Promise<{ poetId: string }>;
}) {
  const { poetId } = use(params);
  const { data: poet, loading, error } = useFetch(() => poetAPI.getById(poetId));
  const [activeAudioPoemId, setActiveAudioPoemId] = useState<string | null>(null);

  const poems = useMemo(() => sortPoemsByNumber(poet?.poems ?? []), [poet?.poems]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-rose-700">{error}</p>;
  if (!poet) return <p>Poet not found.</p>;

  return (
    <section className="space-y-6">
      {/* 9.7 Breadcrumb back link */}
      <Link
        href="/client/poets"
        className="text-sm text-indigo-700 hover:underline flex items-center gap-1"
      >
        ← Back to poets
      </Link>

      {/* Profile card: gradient banner + avatar + bio */}
      <article className="rounded-2xl border bg-white shadow-sm ring-1 ring-indigo-50 overflow-hidden">
        {/* 9.1 Gradient banner with poet name */}
        <div className="relative bg-gradient-to-r from-indigo-600 to-violet-700 h-15 rounded-t-2xl">
          {/* 9.3 Poet name on the banner */}
          <h1 className="absolute bottom-4 left-4 text-white text-3xl font-bold drop-shadow-sm">
            {poet.name}
          </h1>
        </div>

        {/* 9.2 Avatar overlapping the banner bottom */}
        <div className="px-6 pb-6">
          <div className="-mt-14 mb-4">
            {poet.image ? (
              <Image
                src={poet.image}
                alt={poet.name}
                width={112}
                height={150}
                className="h-[112px] w-[112px] rounded-full object-cover ring-4 ring-white shadow-lg"
                unoptimized
              />
            ) : (
              /* 9.4 Gradient fallback circle with initial */
              <div className="flex h-[112px] w-[112px] items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 ring-4 ring-white shadow-lg text-3xl font-semibold text-white">
                {poet.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* 9.5 Bio section */}
          <p className="text-slate-600">
            {poet.bio ?? "Biography not available."}
          </p>
        </div>
      </article>

      {/* 9.6 Poems section */}
      <div>
        <h2 className="text-xl font-semibold">Poems by {poet.name}</h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {poems.map((poem) => (
            <li key={poem.id}>
              <div className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Amber poem number badge */}
                      <span className="bg-amber-100 text-amber-700 rounded-full px-2 py-0.5 text-xs font-bold shrink-0">
                        {poem.poemNo}
                      </span>
                      {/* Title as a link */}
                      <Link
                        href={`/client/poem/${poem.id}?collection=${poem.collectionId}`}
                        className="font-medium text-slate-900 hover:text-indigo-700 hover:underline truncate"
                      >
                        {poem.name}
                      </Link>
                    </div>
                    {/* Collection tag */}
                    <p className="mt-1 text-sm text-slate-500">
                      {poem.collection?.name ?? "Collection unavailable"}
                    </p>
                  </div>
                  {/* Listen button */}
                  {poem.audio ? (
                    <button
                      type="button"
                      onClick={() =>
                        setActiveAudioPoemId((current) =>
                          current === poem.id ? null : poem.id,
                        )
                      }
                      className="shrink-0 rounded-md border border-indigo-300 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                    >
                      {activeAudioPoemId === poem.id ? "Hide Player" : "Listen"}
                    </button>
                  ) : (
                    <span className="shrink-0 text-xs text-slate-400">No audio</span>
                  )}
                </div>

                {activeAudioPoemId === poem.id && poem.audio && (
                  <audio controls preload="none" className="mt-3 h-8 w-full">
                    <source src={poem.audio} />
                  </audio>
                )}
              </div>
            </li>
          ))}
        </ul>

        {/* 9.8 EmptyState for no poems */}
        {poems.length === 0 && (
          <EmptyState
            title="No poems available"
            description={`${poet.name} has no poems yet.`}
          />
        )}
      </div>
    </section>
  );
}
