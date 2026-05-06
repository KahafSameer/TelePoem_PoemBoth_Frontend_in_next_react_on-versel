interface LoadingSpinnerProps {
  variant?: "inline" | "page";
  label?: string;
}

export const LoadingSpinner = ({ variant = "inline", label }: LoadingSpinnerProps = {}) => {
  if (variant === "page") {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        {label && (
          <p className="mt-3 text-sm text-slate-600">{label}</p>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 text-sm text-slate-600">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
      Loading...
    </div>
  );
};
