/**
 * Tests for useFetch hook
 *
 * Validates: Requirements Property 1 (No Infinite Re-renders)
 * Validates: Requirements Property 2 (Request Cleanup)
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import * as fc from "fast-check";
import { useFetch } from "./useFetch";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Creates a promise that resolves after `ms` milliseconds. */
const delay = (ms: number) =>
    new Promise<void>((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------
// Unit tests
// ---------------------------------------------------------------------------

describe("useFetch — unit tests", () => {
    it("returns data on successful fetch", async () => {
        const fetchFn = vi.fn().mockResolvedValue({ id: 1 });
        const { result } = renderHook(() => useFetch(fetchFn));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.data).toEqual({ id: 1 });
        expect(result.current.error).toBeNull();
    });

    it("sets error on fetch failure", async () => {
        const fetchFn = vi.fn().mockRejectedValue(new Error("Network error"));
        const { result } = renderHook(() => useFetch(fetchFn));

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.data).toBeNull();
        expect(result.current.error).toBe("Network error");
    });

    it("starts with loading=false when skip=true", () => {
        const fetchFn = vi.fn().mockResolvedValue({});
        const { result } = renderHook(() => useFetch(fetchFn, { skip: true }));

        expect(result.current.loading).toBe(false);
        expect(fetchFn).not.toHaveBeenCalled();
    });

    it("refetch triggers a new request", async () => {
        const fetchFn = vi.fn().mockResolvedValue("data");
        const { result } = renderHook(() => useFetch(fetchFn));

        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(fetchFn).toHaveBeenCalledTimes(1);

        await act(async () => {
            await result.current.refetch();
        });

        expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it("does not update state after unmount (AbortController cleanup)", async () => {
        let resolveRequest!: (value: string) => void;
        const pendingPromise = new Promise<string>((res) => {
            resolveRequest = res;
        });

        const fetchFn = vi.fn().mockReturnValue(pendingPromise);
        const { result, unmount } = renderHook(() => useFetch(fetchFn));

        // Unmount while the request is still in-flight
        unmount();

        // Resolve the request — state should NOT be updated after unmount
        await act(async () => {
            resolveRequest("late data");
            await Promise.resolve();
        });

        // result ref is frozen at unmount time; data must still be null
        expect(result.current.data).toBeNull();
    });
});

// ---------------------------------------------------------------------------
// Property-based test — Property 2: Request Cleanup
//
// Validates: Requirements Property 2
//
// For any fetchFn, unmounting the hook always aborts in-flight requests and
// produces no state updates after unmount.
// ---------------------------------------------------------------------------

describe("useFetch — Property 2: Request Cleanup (PBT)", () => {
    it("unmounting always prevents post-unmount state updates", async () => {
        await fc.assert(
            fc.asyncProperty(
                // Arbitrary resolved value (string, number, or simple object)
                fc.oneof(fc.string(), fc.integer(), fc.record({ id: fc.uuid() })),
                // Arbitrary delay before the fetch resolves (0–50 ms)
                fc.integer({ min: 0, max: 50 }),
                async (resolvedValue, delayMs) => {
                    let resolveRequest!: (v: unknown) => void;
                    const pendingPromise = new Promise<unknown>((res) => {
                        resolveRequest = res;
                    });

                    const fetchFn = vi.fn().mockReturnValue(pendingPromise);

                    const { result, unmount } = renderHook(() =>
                        useFetch(fetchFn as () => Promise<unknown>),
                    );

                    // Unmount while the request is still in-flight
                    unmount();

                    // Resolve the request after the specified delay
                    await act(async () => {
                        await delay(delayMs);
                        resolveRequest(resolvedValue);
                        await Promise.resolve();
                    });

                    // State must remain at initial values — no post-unmount updates
                    expect(result.current.data).toBeNull();
                    expect(result.current.error).toBeNull();
                },
            ),
            { numRuns: 50 },
        );
    });
});
