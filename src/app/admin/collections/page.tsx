"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { collectionAPI } from "@/lib/api/collections";
import { useFetch } from "@/lib/hooks/useFetch";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { Modal } from "@/components/shared/Modal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { CollectionForm } from "@/components/admin/forms/CollectionForm";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Collection } from "@/lib/types";

type ModalMode = "create" | "edit" | null;

export default function AdminCollectionsPage() {
  const { data, loading, error, refetch } = useFetch(collectionAPI.getAll);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCollections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data ?? [];
    return (data ?? []).filter((c) => c.name.toLowerCase().includes(q));
  }, [data, searchQuery]);

  // ── Create ──────────────────────────────────────────────────────────────────
  const openCreate = () => {
    setSelectedCollection(null);
    setModalMode("create");
  };

  const handleCreate = async (payload: { name: string }) => {
    await collectionAPI.create(payload);
    addNotification("Collection created successfully", "success");
    setModalMode(null);
    refetch();
  };

  // ── Edit ────────────────────────────────────────────────────────────────────
  const openEdit = (collection: Collection) => {
    setSelectedCollection(collection);
    setModalMode("edit");
  };

  const handleEdit = async (payload: { name: string }) => {
    if (!selectedCollection) return;
    await collectionAPI.update(selectedCollection.id, payload);
    addNotification("Collection updated successfully", "success");
    setModalMode(null);
    setSelectedCollection(null);
    refetch();
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await collectionAPI.remove(deleteTarget.id);
      addNotification("Collection deleted successfully", "success");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      addNotification(getErrorMessage(err), "error");
    }
  };

  // ── Form submit dispatcher ───────────────────────────────────────────────────
  const handleFormSubmit = async (payload: { name: string }) => {
    try {
      if (modalMode === "create") {
        await handleCreate(payload);
      } else if (modalMode === "edit") {
        await handleEdit(payload);
      }
    } catch (err) {
      addNotification(getErrorMessage(err), "error");
      throw err; // let CollectionForm show its own inline error too
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedCollection(null);
  };

  return (
    <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Collection Management</h1>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            + Create Collection
          </button>
        </div>

        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter by name…"
          className="mt-4 max-w-sm"
        />
      </div>

      {/* States */}
      {loading && <p className="px-4 py-3 text-sm text-slate-500">Loading collections...</p>}
      {error && <p className="px-4 py-3 text-sm text-rose-700">{error}</p>}

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Poems</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Booths</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCollections.map((collection) => (
              <tr key={collection.id} className="border-b last:border-0 even:bg-slate-50/50 hover:bg-indigo-50/30 transition-colors">
                <td className="py-2 px-4 font-medium text-slate-800">
                  {collection.name}
                </td>
                <td className="py-2 px-4 text-slate-600">
                  {collection.poems?.length ?? 0}
                </td>
                <td className="py-2 px-4 text-slate-600">
                  {collection.boothCollections?.length ?? 0}
                </td>
                <td className="py-2 px-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Manage poems / booths */}
                    <Link
                      href={`/admin/collections/${collection.id}/poems`}
                      className="rounded-md bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                    >
                      Manage
                    </Link>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => openEdit(collection)}
                      className="rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(collection)}
                      className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && filteredCollections.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <EmptyState
                    title={searchQuery ? `No collections match "${searchQuery}"` : "No collections found"}
                    description={searchQuery ? undefined : "Create one to get started."}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalMode !== null}
        onClose={closeModal}
        title={modalMode === "create" ? "Create Collection" : "Edit Collection"}
        size="md"
      >
        <CollectionForm
          key={selectedCollection?.id ?? "create"}
          initialData={
            selectedCollection ? { name: selectedCollection.name } : undefined
          }
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
        />
      </Modal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Collection"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </section>
  );
}
