"use client";

import { useState } from "react";
import { Input } from "@/components/shared/form/Input";
import { Textarea } from "@/components/shared/form/Textarea";
import { Button } from "@/components/shared/form/Button";
import { isValidUrl } from "@/lib/utils/validation";

interface PoetFormProps {
    initialData?: { name: string; bio?: string; image?: string };
    onSubmit: (data: { name: string; bio?: string; image?: string }) => Promise<void>;
    onCancel: () => void;
}

export const PoetForm: React.FC<PoetFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
}) => {
    const [name, setName] = useState(initialData?.name ?? "");
    const [bio, setBio] = useState(initialData?.bio ?? "");
    const [image, setImage] = useState(initialData?.image ?? "");
    const [errors, setErrors] = useState<{ name?: string; bio?: string; image?: string }>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validate = (): boolean => {
        const newErrors: { name?: string; bio?: string; image?: string } = {};

        if (!name.trim()) {
            newErrors.name = "Name is required.";
        } else if (name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters.";
        } else if (name.trim().length > 100) {
            newErrors.name = "Name must be at most 100 characters.";
        }

        if (bio && bio.length > 2000) {
            newErrors.bio = "Bio must be at most 2000 characters.";
        }

        if (image && image.trim()) {
            const trimmedImage = image.trim();
            if (!isValidUrl(trimmedImage)) {
                newErrors.image = "Image must be a valid URL.";
            } else {
                try {
                    const url = new URL(trimmedImage);
                    if (url.protocol !== "http:" && url.protocol !== "https:") {
                        newErrors.image = "Image URL must use http or https.";
                    }
                } catch {
                    newErrors.image = "Image must be a valid URL.";
                }
            }
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
            await onSubmit({
                name: name.trim(),
                bio: bio.trim() || undefined,
                image: image.trim() || undefined,
            });
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
                placeholder="e.g. Rumi"
                disabled={isSubmitting}
            />

            <Textarea
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                error={errors.bio}
                placeholder="A short biography of the poet (optional)"
                rows={4}
                disabled={isSubmitting}
            />

            <Input
                label="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                error={errors.image}
                placeholder="https://example.com/image.jpg (optional)"
                type="url"
                disabled={isSubmitting}
            />

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
                    {initialData ? "Save Changes" : "Create Poet"}
                </Button>
            </div>
        </form>
    );
};
