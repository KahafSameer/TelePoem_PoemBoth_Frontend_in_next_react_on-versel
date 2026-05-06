"use client";

import { useMemo, useState } from "react";

/**
 * Generic client-side search hook.
 * Returns a filtered subset of `items` where `predicate(item, query)` is true.
 * The query is trimmed and lowercased before comparison.
 */
export function useSearch<T>(
    items: T[],
    predicate: (item: T, query: string) => boolean,
) {
    const [query, setQuery] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return items;
        return items.filter((item) => predicate(item, q));
    }, [items, predicate, query]);

    return { query, setQuery, filtered, hasQuery: query.trim().length > 0 };
}
