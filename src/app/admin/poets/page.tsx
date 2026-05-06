"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { poetAPI } from "@/lib/api/poets";
import { useFetch } from "@/lib/hooks/useFetch";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { truncate } from "@/lib/utils/formatting";
import { Modal } from "@/components/shared/Modal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PoetForm } from "@/components/admin/forms/PoetForm";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Poet } from "@/lib/types";

type ModalMode = "create" | "edit" | null;

export default function AdminPoetsPage() {
  const { data, loading, error, refetch } = useFetch(poetAPI.getAll);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedPoet, setSelectedPoet] = useState<Poet | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Poet | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPoets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data ?? [];
    return (data ?? []).filter(
      (poet) =>
        poet.name.toLowerCase().includes(q) ||
        (poet.bio ?? "").toLowerCase().includes(q),
    );
  }, [data, searchQuery]);

  const openCreate = () => {
    setSelectedPoet(null);
    setModalMode("create");
  };

  const handleCreate = async (payload: { name: string; bio?: string; image?: string }) => {
    await poetAPI.create(payload);
    addNotification("Poet created successfully", "success");
    setModalMode(null);
    refetch();
  };

  const openEdit = (poet: Poet) => {
    setSelectedPoet(poet);
    setModalMode("edit");
  };

  const handleEdit = async (payload: { name: string; bio?: string; image?: string }) => {
    if (!selectedPoet) return;
    await poetAPI.update(selectedPoet.id, payload);
    addNotification("Poet updated successfully", "success");
    setModalMode(null);
    setSelectedPoet(null);
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await poetAPI.remove(deleteTarget.id);
      addNotification("Poet deleted successfully", "success");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      addNotification(getErrorMessage(err), "error");
    }
  };

  const handleFormSubmit = async (payload: { name: string; bio?: string; image?: string }) => {
    try {
      if (modalMode === "create") {
        await handleCreate(payload);
      } else if (modalMode === "edit") {
        await handleEdit(payload);
      }
    } catch (err) {
      addNotification(getErrorMessage(err), "error");
      throw err;
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedPoet(null);
  };

  return (
    <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Poet Management</h1>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            + Create Poet
          </button>
        </div>

        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter by poet name or bio…"
          className="mt-4 max-w-md"
        />
      </div>

      {/* States */}
      {loading && <p className="px-4 py-3 text-sm text-slate-500">Loading poets...</p>}
      {error && <p className="px-4 py-3 text-sm text-rose-700">{error}</p>}

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Image</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Bio</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Poems</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPoets.map((poet) => (
              <tr key={poet.id} className="border-b last:border-0 even:bg-slate-50/50 hover:bg-indigo-50/30 transition-colors">
                <td className="py-2 px-4">
                  {poet.image ? (
                    <Image
                      src={poet.image}
                      alt={poet.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-400">
                      N/A
                    </span>
                  )}
                </td>
                <td className="py-2 px-4 font-medium">{poet.name}</td>
                <td className="py-2 px-4 text-slate-500">
                  {truncate(poet.bio, 96) || <span className="italic text-slate-300">—</span>}
                </td>
                <td className="py-2 px-4">{poet.poems?.length ?? 0}</td>
                <td className="py-2 px-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(poet)}
                      className="rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(poet)}
                      className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && filteredPoets.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyState
                    title={searchQuery ? `No poets match "${searchQuery}"` : "No poets found"}
                    description={searchQuery ? undefined : "Create one to get started."}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalMode !== null}
        onClose={closeModal}
        title={modalMode === "create" ? "Create Poet" : "Edit Poet"}
        size="md"
      >
        <PoetForm
          key={selectedPoet?.id ?? "create"}
          initialData={
            selectedPoet
              ? {
                name: selectedPoet.name,
                bio: selectedPoet.bio ?? undefined,
                image: selectedPoet.image ?? undefined,
              }
              : undefined
          }
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Poet"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </section>
  );
}
