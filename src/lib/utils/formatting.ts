import type { Poem } from "@/lib/types";

export const formatDateTime = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

export const truncate = (value: string | null | undefined, max = 80): string => {
  if (!value) return "";
  if (value.length <= max) return value;
  return `${value.slice(0, max)}...`;
};

/**
 * Returns a new array of poems sorted ascending by poemNo.
 * Does not mutate the input array.
 */
export const sortPoemsByNumber = (poems: Poem[]): Poem[] =>
  [...poems].sort((a, b) => a.poemNo - b.poemNo);
