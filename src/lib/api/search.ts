// ─────────────────────────────────────────────────────────────────────────────
// src/lib/api/search.ts
//
// Thin API client for the semantic search endpoint.
// ─────────────────────────────────────────────────────────────────────────────

import { API_BASE_URL } from "@/lib/constants/api";

// ── Response types ────────────────────────────────────────────────────────────

/** A single poem returned by the semantic search endpoint. */
export interface SemanticSearchResult {
    id: string;
    name: string;
    text: string;
    description: string | null;
    poemNo: number;
    audio: string | null;
    image: string | null;
    collectionId: string;
    poetId: string;
    /** Cosine similarity score between 0 and 1.  Higher = more relevant. */
    score: number;
    poet: { id: string; name: string } | null;
    collection: { id: string; name: string } | null;
}

/** The full response envelope from GET /api/v1/search */
export interface SemanticSearchResponse {
    query: string;
    count: number;
    results: SemanticSearchResult[];
}

// ── API function ──────────────────────────────────────────────────────────────

/**
 * Call the backend semantic search endpoint.
 *
 * @param query  The user's search string.
 * @param topK   Maximum number of results (default 10, max 50).
 * @returns      The parsed JSON response.
 * @throws       An Error if the HTTP response is not OK.
 */
export async function semanticSearch(
    query: string,
    topK = 10,
): Promise<SemanticSearchResponse> {
    // URLSearchParams encodes special characters (spaces → %20, etc.) safely.
    const params = new URLSearchParams({
        q: query,
        top_k: String(topK),
    });

    const res = await fetch(`${API_BASE_URL}/search?${params.toString()}`, {
        headers: {
            "ngrok-skip-browser-warning": "true",
        },
    });

    if (!res.ok) {
        throw new Error(`Semantic search failed: ${res.status} ${res.statusText}`);
    }

    return res.json() as Promise<SemanticSearchResponse>;
}
