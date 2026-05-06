"use client";

import Link from "next/link";
import Image from "next/image";
import { use, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { poemAPI } from "@/lib/api/poems";
import { collectionAPI } from "@/lib/api/collections";
import { useFetch } from "@/lib/hooks/useFetch";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { sortPoemsByNumber } from "@/lib/utils/formatting";

export default function PoemPage({ params }: { params: Promise<{ poemId: string }> }) {
  const { poemId } = use(params);
  const searchParams = useSearchParams();
  const collectionId = searchParams.get("collection");

  const { data: poem, loading, error } = useFetch(() => poemAPI.getById(poemId));
  const { data: audioData } = useFetch(() => poemAPI.getAudioById(poemId));
  const { data: collectionPoems } = useFetch(
    () => collectionAPI.getPoems(collectionId ?? ""),
    { skip: !collectionId },
  );

  const { prevId, nextId, index, total } = useMemo(() => {
    if (!collectionPoems?.length) return { prevId: null, nextId: null, index: 1, total: 1 };
    const sorted = sortPoemsByNumber(collectionPoems);
    const currentIndex = sorted.findIndex((item) => item.id === poemId);
    return {
      prevId: currentIndex > 0 ? sorted[currentIndex - 1].id : null,
      nextId:
        currentIndex >= 0 && currentIndex < sorted.length - 1
          ? sorted[currentIndex + 1].id
          : null,
      index: currentIndex + 1,
      total: sorted.length,
    };
  }, [collectionPoems, poemId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-rose-700">{error}</p>;
  if (!poem) return <p>Poem not found.</p>;

  const audioUrl = audioData?.audio ?? poem.audio;

  return (
    <section className="space-y-5">
      {/* Top bar: back link + progress pill */}
      <div className="flex items-center justify-between">
        <Link href="/client" className="text-sm text-indigo-700 hover:underline">
          ← Back
        </Link>
        {/* 8.6 Progress indicator as pill badge */}
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
          {index}/{total}
        </span>
      </div>

      {/* 8.1 Article card: bg-amber-50/30, rounded-2xl */}
      <article className="rounded-2xl border bg-amber-50/30 shadow-sm ring-1 ring-indigo-50 overflow-hidden">
        {/* Poem image banner — shown only when poem.image is set */}
        {poem.image && (
          <div className="relative h-56 w-full">
            <Image
              src={poem.image}
              alt={poem.name}
              fill
              className="object-cover"
              unoptimized
            />
            {/* subtle gradient overlay so text below is readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-50/60" />
          </div>
        )}

        <div className="p-6">
          {/* 8.2 Poem title */}
          <h2 className="text-4xl font-bold tracking-tight">{poem.name}</h2>

          {/* 8.3 Poet byline as "— {poet.name}" with Link */}
          {poem.poet ? (
            <Link
              href={`/client/poet/${poem.poet.id}`}
              className="mt-2 inline-flex text-slate-600 hover:text-indigo-700 hover:underline"
            >
              — {poem.poet.name}
            </Link>
          ) : (
            <p className="mt-2 text-slate-600">— Unknown poet</p>
          )}

          {/* 8.5 Decorative opening quote mark + 8.4 poem body with .poetry-text */}
          <div className="mt-6 relative">
            <span
              className="text-8xl font-serif text-indigo-200 leading-none select-none"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="poetry-text whitespace-pre-wrap">{poem.text}</p>
          </div>
        </div>
      </article>

      {/* 8.8 Audio player wrapped in styled container */}
      {audioUrl && (
        <div className="rounded-xl border bg-white p-4 shadow-sm flex items-center gap-3">
          {/* Waveform SVG icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 flex-shrink-0 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-500 mb-1">Listen to this poem</p>
            <audio controls className="w-full">
              <source src={audioUrl} />
            </audio>
          </div>
        </div>
      )}

      {/* 8.7 Previous/Next navigation with chevron icons */}
      <div className="flex gap-3">
        <Link
          className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${!prevId
            ? "opacity-40 cursor-not-allowed pointer-events-none border-slate-200 text-slate-400"
            : "border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
            }`}
          href={prevId ? `/client/poem/${prevId}?collection=${collectionId ?? ""}` : "#"}
        >
          {/* Left chevron */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </Link>
        <Link
          className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${!nextId
            ? "opacity-40 cursor-not-allowed pointer-events-none border-slate-200 text-slate-400"
            : "border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
            }`}
          href={nextId ? `/client/poem/${nextId}?collection=${collectionId ?? ""}` : "#"}
        >
          Next
          {/* Right chevron */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
