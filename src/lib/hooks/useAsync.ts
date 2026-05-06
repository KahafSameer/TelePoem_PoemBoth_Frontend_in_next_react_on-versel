"use client";

import { useState } from "react";
import { getErrorMessage } from "@/lib/utils/errorHandler";

export const useAsync = <T,>(asyncFn: () => Promise<T>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      return await asyncFn();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { run, loading, error };
};
