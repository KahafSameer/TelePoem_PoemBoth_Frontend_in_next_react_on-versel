"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { semanticSearch, type SemanticSearchResult } from "@/lib/api/search";
import { SearchInput } from "@/components/shared/SearchInput";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function SearchPage() {
    const searchParams = useSearchParams();

    // Pre-fill from ?q= so the home page search box can redirect here with a query.
    const [query, setQuery] = useState(searchParams.get("q") ?? "");
    const [results, setResults] = useState<SemanticSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debounced search — fires 400 ms after the user stops typing.
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setError(null);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await semanticSearch(query.trim());
                setResults(data.results);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Search failed. Is the backend running?");
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [query]);

    const hasQuery = query.trim().length > 0;
    const hasResults = results.length > 0;

    return (
        <section className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Search</h2>
                <p className="mt-1 text-slate-600">
                    Semantic search — find poems, poets, and collections by meaning.
                </p>
            </div>

            <SearchInput
                value={query}
                onChange={setQuery}
                placeholder="e.g. longing for homeland, love and loss…"
                className="max-w-xl"
            />

            {loading && <LoadingSpinner />}

            {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            {!loading && !hasQuery && (
                <p className="py-8 text-center text-slate-400">Start typing to search…</p>
            )}

            {!loading && hasQuery && !hasResults && !error && (
                <p className="py-8 text-center text-slate-400">
                    No results for &ldquo;{query}&rdquo;
                </p>
            )}

            {hasResults && !loading && (
                <div className="space-y-4">
                    <p className="text-sm text-slate-500">
                        {results.length} result{results.length !== 1 ? "s" : ""} for{" "}
                        <span className="font-medium text-slate-700">&ldquo;{query}&rdquo;</span>
                    </p>

                    <ul className="space-y-2">
                        {results.map((poem) => (
                            <li key={poem.id}>
                                <Link
                                    href={`/client/poem/${poem.id}?collection=${poem.collectionId}`}
                                    className="flex items-start justify-between rounded-xl border bg-white p-4 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
                                >
                                    <div className="min-w-0">
                                        <p className="font-semibold text-slate-900">
                                            {poem.poemNo}. {poem.name}
                                        </p>
                                        {poem.poet && (
                                            <p className="mt-0.5 text-xs text-slate-500">{poem.poet.name}</p>
                                        )}
                                        {poem.description && (
                                            <p className="mt-1 truncate text-xs text-slate-400">{poem.description}</p>
                                        )}
                                    </div>

                                    <div className="ml-4 flex shrink-0 flex-col items-end gap-1.5">
                                        {poem.collection && (
                                            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                                                {poem.collection.name}
                                            </span>
                                        )}
                                        <span
                                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${poem.score >= 0.6
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : poem.score >= 0.4
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "bg-slate-100 text-slate-600"
                                                }`}
                                        >
                                            {Math.round(poem.score * 100)}% match
                                        </span>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
}
