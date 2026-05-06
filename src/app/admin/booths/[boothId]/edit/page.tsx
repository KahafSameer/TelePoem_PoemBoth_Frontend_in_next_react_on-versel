"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { boothAPI } from "@/lib/api/booths";
import { useFetch } from "@/lib/hooks/useFetch";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { BoothForm } from "@/components/admin/forms/BoothForm";

export default function EditBoothPage({ params }: { params: Promise<{ boothId: string }> }) {
  const { boothId } = use(params);
  const router = useRouter();
  const addNotification = useNotificationStore((s) => s.addNotification);

  const { data, loading, error } = useFetch(() => boothAPI.getById(boothId));

  const handleSubmit = async (payload: { location: string; theme: string }) => {
    try {
      await boothAPI.update(boothId, payload);
      addNotification("Booth updated successfully", "success");
      router.push("/admin/booths");
    } catch (err) {
      addNotification(getErrorMessage(err), "error");
      throw err;
    }
  };

  if (loading) {
    return (
      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-500">Loading booth...</p>
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
        <p className="text-sm text-slate-500">Booth not found.</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <h1 className="mb-6 text-2xl font-semibold">Edit Booth</h1>
      <BoothForm
        initialData={{ location: data.location, theme: data.theme }}
        onSubmit={handleSubmit}
        onCancel={() => router.push("/admin/booths")}
      />
    </section>
  );
}
