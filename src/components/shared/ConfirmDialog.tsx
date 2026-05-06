"use client";

import { useState } from "react";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "warning";
}

const variantStyles = {
    danger: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    warning: "bg-amber-500 hover:bg-amber-600 focus:ring-amber-400",
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "danger",
}) => {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (loading) return;
        setLoading(true);
        try {
            await onConfirm();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
            <p className="mb-6 text-sm text-slate-600">{message}</p>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {cancelLabel}
                </button>

                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={loading}
                    className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${variantStyles[variant]}`}
                >
                    {loading && (
                        <span
                            className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                            aria-hidden="true"
                        />
                    )}
                    {loading ? "Processing…" : confirmLabel}
                </button>
            </div>
        </Modal>
    );
};
