"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  fallbackHref?: string;
}

export function BackButton({ fallbackHref = "/" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      className="fixed left-4 top-4 z-50 inline-flex items-center gap-1 rounded-full border border-slate-300 bg-white/95 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      <svg
        aria-hidden="true"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      Back
    </button>
  );
}
