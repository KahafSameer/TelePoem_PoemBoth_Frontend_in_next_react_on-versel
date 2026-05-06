"use client";

import { useState } from "react";
import { Input } from "@/components/shared/form/Input";
import { Button } from "@/components/shared/form/Button";

interface BoothFormProps {
    initialData?: { location: string; theme: string };
    onSubmit: (data: { location: string; theme: string }) => Promise<void>;
    onCancel: () => void;
}

export const BoothForm: React.FC<BoothFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
}) => {
    const [location, setLocation] = useState(initialData?.location ?? "");
    const [theme, setTheme] = useState(initialData?.theme ?? "");
    const [errors, setErrors] = useState<{ location?: string; theme?: string }>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = (): boolean => {
        const newErrors: { location?: string; theme?: string } = {};

        if (!location.trim()) {
            newErrors.location = "Location is required.";
        } else if (location.trim().length < 2) {
            newErrors.location = "Location must be at least 2 characters.";
        } else if (location.trim().length > 100) {
            newErrors.location = "Location must be at most 100 characters.";
        }

        if (!theme.trim()) {
            newErrors.theme = "Theme is required.";
        } else if (theme.trim().length < 2) {
            newErrors.theme = "Theme must be at least 2 characters.";
        } else if (theme.trim().length > 200) {
            newErrors.theme = "Theme must be at most 200 characters.";
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
            await onSubmit({ location: location.trim(), theme: theme.trim() });
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
                label="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                error={errors.location}
                required
                placeholder="e.g. Main Hall"
                disabled={isSubmitting}
            />

            <Input
                label="Theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                error={errors.theme}
                required
                placeholder="e.g. Classical Poetry"
                disabled={isSubmitting}
            />

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
                    {initialData ? "Save Changes" : "Create Booth"}
                </Button>
            </div>
        </form>
    );
};
