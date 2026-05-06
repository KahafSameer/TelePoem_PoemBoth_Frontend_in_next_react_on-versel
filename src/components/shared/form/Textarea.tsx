"use client";

import { useId } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
    id?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
    label,
    error,
    id: providedId,
    className,
    ...rest
}) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;

    return (
        <div className="flex flex-col gap-1">
            <label
                htmlFor={id}
                className="text-sm font-medium text-slate-700"
            >
                {label}
                {rest.required && (
                    <span className="ml-1 text-red-500" aria-hidden="true">
                        *
                    </span>
                )}
            </label>

            <textarea
                id={id}
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? `${id}-error` : undefined}
                className={`rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-50 disabled:text-slate-500 ${error
                        ? "border-red-400 focus:ring-red-400"
                        : "border-slate-300"
                    } ${className ?? ""}`}
                {...rest}
            />

            {error && (
                <p id={`${id}-error`} role="alert" className="text-xs text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};
