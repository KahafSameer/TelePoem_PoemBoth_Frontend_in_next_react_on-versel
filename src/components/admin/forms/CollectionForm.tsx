"use client";

import { useState } from "react";
import { Input } from "@/components/shared/form/Input";
import { Button } from "@/components/shared/form/Button";

interface CollectionFormProps {
    initialData?: { name: string };
    onSubmit: (data: { name: string }) => Promise<void>;
    onCancel: () => void;
}

export const CollectionForm: React.FC<CollectionFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
}) => {
    const [name, setName] = useState(initialData?.name ?? "");
    const [errors, setErrors] = useState<{ name?: string }>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = (): boolean => {
        const newErrors: { name?: string } = {};

        if (!name.trim()) {
            newErrors.name = "Name is required.";
        } else if (name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters.";
        } else if (name.trim().length > 100) {
            newErrors.name = "Name must be at most 100 characters.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setGeneralError(null);

        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await onSubmit({ name: name.trim() });
        } catch (err) {
            setGeneralError(
                err instanceof Error ? err.message : "An unexpected error occurred."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {generalError && (
                <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                    {generalError}
                </p>
            )}

            <Input
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={errors.name}
                required
                placeholder="e.g. Spring Anthology"
                disabled={isSubmitting}
            />

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
                    {initialData ? "Save Changes" : "Create Collection"}
                </Button>
            </div>
        </form>
    );
};
