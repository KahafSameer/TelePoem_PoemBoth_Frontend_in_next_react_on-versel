"use client";

import { useState } from "react";
import { Input } from "@/components/shared/form/Input";
import { Textarea } from "@/components/shared/form/Textarea";
import { Select } from "@/components/shared/form/Select";
import { Button } from "@/components/shared/form/Button";
import { isValidUrl } from "@/lib/utils/validation";
import { CreatePoemRequest } from "@/lib/types";

interface PoemFormProps {
    initialData?: {
        name: string;
        text: string;
        poemNo: number;
        collection_id: string;
        poet_id: string;
        description?: string;
        audio?: string;
        image?: string;
    };
    collections: Array<{ id: string; name: string }>;
    poets: Array<{ id: string; name: string }>;
    onSubmit: (data: CreatePoemRequest) => Promise<void>;
    onCancel: () => void;
    disableRelationFields?: boolean;
}

interface PoemFormErrors {
    name?: string;
    text?: string;
    poemNo?: string;
    collection_id?: string;
    poet_id?: string;
    description?: string;
    audio?: string;
    image?: string;
}

export const PoemForm: React.FC<PoemFormProps> = ({
    initialData,
    collections,
    poets,
    onSubmit,
    onCancel,
    disableRelationFields = false,
}) => {
    const [name, setName] = useState(initialData?.name ?? "");
    const [text, setText] = useState(initialData?.text ?? "");
    const [poemNo, setPoemNo] = useState(
        initialData?.poemNo !== undefined ? String(initialData.poemNo) : ""
    );
    const [collectionId, setCollectionId] = useState(initialData?.collection_id ?? "");
    const [poetId, setPoetId] = useState(initialData?.poet_id ?? "");
    const [description, setDescription] = useState(initialData?.description ?? "");
    const [audio, setAudio] = useState(initialData?.audio ?? "");
    const [image, setImage] = useState(initialData?.image ?? "");

    const [errors, setErrors] = useState<PoemFormErrors>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateUrl = (value: string, fieldLabel: string): string | undefined => {
        if (!value.trim()) return undefined;
        const trimmed = value.trim();
        if (!isValidUrl(trimmed)) return `${fieldLabel} must be a valid URL.`;
        try {
            const url = new URL(trimmed);
            if (url.protocol !== "http:" && url.protocol !== "https:") {
                return `${fieldLabel} URL must use http or https.`;
            }
        } catch {
            return `${fieldLabel} must be a valid URL.`;
        }
        return undefined;
    };

    const validate = (): boolean => {
        const newErrors: PoemFormErrors = {};

        if (!name.trim()) {
            newErrors.name = "Name is required.";
        }

        if (!text.trim()) {
            newErrors.text = "Text is required.";
        } else if (text.trim().length < 10) {
            newErrors.text = "Text must be at least 10 characters.";
        } else if (text.trim().length > 10000) {
            newErrors.text = "Text must be at most 10,000 characters.";
        }

        const poemNoNum = Number(poemNo);
        if (!poemNo.trim()) {
            newErrors.poemNo = "Poem number is required.";
        } else if (!Number.isInteger(poemNoNum) || poemNoNum < 1) {
            newErrors.poemNo = "Poem number must be a positive integer.";
        }

        if (!collectionId) {
            newErrors.collection_id = "Collection is required.";
        }

        if (!poetId) {
            newErrors.poet_id = "Poet is required.";
        }

        if (description && description.length > 2000) {
            newErrors.description = "Description must be at most 2000 characters.";
        }

        const audioError = validateUrl(audio, "Audio");
        if (audioError) newErrors.audio = audioError;

        const imageError = validateUrl(image, "Image");
        if (imageError) newErrors.image = imageError;

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
                text: text.trim(),
                poemNo: Number(poemNo),
                collection_id: collectionId,
                poet_id: poetId,
                description: description.trim() || undefined,
                audio: audio.trim() || undefined,
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

    const collectionOptions = [
        { value: "", label: "— select —" },
        ...collections.map((c) => ({ value: c.id, label: c.name })),
    ];

    const poetOptions = [
        { value: "", label: "— select —" },
        ...poets.map((p) => ({ value: p.id, label: p.name })),
    ];

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
                placeholder="e.g. The Road Not Taken"
                disabled={isSubmitting}
            />

            <Textarea
                label="Text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                error={errors.text}
                required
                placeholder="Enter the full poem text..."
                rows={8}
                disabled={isSubmitting}
            />

            <Input
                label="Poem Number"
                type="number"
                value={poemNo}
                onChange={(e) => setPoemNo(e.target.value)}
                error={errors.poemNo}
                required
                min={1}
                placeholder="e.g. 1"
                disabled={isSubmitting}
            />

            <Select
                label="Collection"
                options={collectionOptions}
                value={collectionId}
                onChange={(e) => setCollectionId(e.target.value)}
                error={errors.collection_id}
                required
                disabled={isSubmitting || disableRelationFields}
            />

            <Select
                label="Poet"
                options={poetOptions}
                value={poetId}
                onChange={(e) => setPoetId(e.target.value)}
                error={errors.poet_id}
                required
                disabled={isSubmitting || disableRelationFields}
            />

            <Textarea
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                error={errors.description}
                placeholder="Optional description or notes about the poem"
                rows={3}
                disabled={isSubmitting}
            />

            <Input
                label="Audio URL"
                type="url"
                value={audio}
                onChange={(e) => setAudio(e.target.value)}
                error={errors.audio}
                placeholder="https://example.com/audio.mp3 (optional)"
                disabled={isSubmitting}
            />

            <Input
                label="Image URL"
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                error={errors.image}
                placeholder="https://example.com/image.jpg (optional)"
                disabled={isSubmitting}
            />

            <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
                    {initialData ? "Save Changes" : "Create Poem"}
                </Button>
            </div>
        </form>
    );
};
