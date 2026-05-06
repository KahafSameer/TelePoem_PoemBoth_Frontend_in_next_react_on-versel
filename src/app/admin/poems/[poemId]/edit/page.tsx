"use client";

import { use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { poemAPI } from "@/lib/api/poems";
import { collectionAPI } from "@/lib/api/collections";
import { poetAPI } from "@/lib/api/poets";
import { useFetch } from "@/lib/hooks/useFetch";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { PoemForm } from "@/components/admin/forms/PoemForm";
import type { CreatePoemRequest } from "@/lib/types";

type UpdatePoemPayload = Partial<
  Omit<CreatePoemRequest, "collection_id" | "poet_id">
>;

export default function EditPoemPage({ params }: { params: Promise<{ poemId: string }> }) {
  const { poemId } = use(params);
  const router = useRouter();
  const addNotification = useNotificationStore((s) => s.addNotification);

  const { data, loading, error } = useFetch(
    useCallback(() => poemAPI.getById(poemId), [poemId]),
  );
  const { data: collections } = useFetch(collectionAPI.getAll);
  const { data: poets } = useFetch(poetAPI.getAll);

  const handleSubmit = async (payload: CreatePoemRequest) => {
    try {
      const updatePayload: UpdatePoemPayload = {
        name: payload.name,
        text: payload.text,
        poemNo: payload.poemNo,
        description: payload.description,
        audio: payload.audio,
        image: payload.image,
      };
      await poemAPI.update(poemId, updatePayload);
      addNotification("Poem updated successfully", "success");
      router.push("/admin/poems");
    } catch (err) {
      addNotification(getErrorMessage(err), "error");
      throw err;
    }
  };

  if (loading) {
    return (
      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Loading poem...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-rose-700">{error}</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Poem not found.</p>
      </section>
    );
  }

  const collectionList = (collections ?? []).map((c) => ({ id: c.id, name: c.name }));
  const poetList = (poets ?? []).map((p) => ({ id: p.id, name: p.name }));

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <h1 className="mb-6 text-2xl font-semibold">Edit Poem</h1>
      <PoemForm
        initialData={{
          name: data.name,
          text: data.text,
          poemNo: data.poemNo,
          collection_id: data.collectionId,
          poet_id: data.poetId,
          description: data.description ?? undefined,
          audio: data.audio ?? undefined,
          image: data.image ?? undefined,
        }}
        collections={collectionList}
        poets={poetList}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/admin/poems")}
        disableRelationFields
      />
    </section>
  );
}
