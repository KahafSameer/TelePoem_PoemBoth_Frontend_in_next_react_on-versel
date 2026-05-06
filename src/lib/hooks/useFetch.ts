"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getErrorMessage } from "@/lib/utils/errorHandler";

export const useFetch = <T>(
  fetchFn: () => Promise<T>,
  options?: { skip?: boolean; refetchInterval?: number },
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!options?.skip);
  const [error, setError] = useState<string | null>(null);

  // Hold the latest fetchFn in a ref so it's always current without
  // being a dependency of useCallback — prevents infinite re-render loops.
  const fetchFnRef = useRef(fetchFn);
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const run = useCallback(async () => {
    if (options?.skip) return;

    const abortController = new AbortController();
    setLoading(true);
    setError(null);

    try {
      const result = await fetchFnRef.current();

      if (!abortController.signal.aborted) {
        setData(result);
      }
    } catch (err) {
      // Ignore errors caused by intentional abort
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      if (!abortController.signal.aborted) {
        setError(getErrorMessage(err));
      }
    } finally {
      if (!abortController.signal.aborted) {
        setLoading(false);
      }
    }

    return () => abortController.abort();
  }, [options?.skip]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    const cleanupPromise = run();

    if (!options?.refetchInterval) {
      return () => {
        void cleanupPromise.then((fn) => fn?.());
      };
    }

    const timer = setInterval(() => void run(), options.refetchInterval);
    return () => {
      clearInterval(timer);
      void cleanupPromise.then((fn) => fn?.());
    };
  }, [run, options?.refetchInterval]);

  return { data, loading, error, refetch: run };
};
