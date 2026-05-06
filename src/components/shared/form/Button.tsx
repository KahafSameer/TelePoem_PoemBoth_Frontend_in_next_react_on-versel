"use client";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger";
    loading?: boolean;
    fullWidth?: boolean;
}

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
    primary:
        "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 border-transparent",
    secondary:
        "bg-white text-slate-700 hover:bg-slate-50 focus:ring-indigo-500 border-slate-300",
    danger:
        "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-transparent",
};

export const Button: React.FC<ButtonProps> = ({
    variant = "primary",
    loading = false,
    fullWidth = false,
    children,
    disabled,
    className,
    ...rest
}) => {
    return (
        <button
            disabled={disabled || loading}
            aria-busy={loading}
            className={`inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${variantClasses[variant]
                } ${fullWidth ? "w-full" : ""} ${className ?? ""}`}
            {...rest}
        >
            {loading && (
                <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    aria-hidden="true"
                />
            )}
            {children}
        </button>
    );
};
