"use client";

import { useMemo, useState } from "react";
import { poemAPI } from "@/lib/api/poems";
import { collectionAPI } from "@/lib/api/collections";
import { poetAPI } from "@/lib/api/poets";
import { useFetch } from "@/lib/hooks/useFetch";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { truncate } from "@/lib/utils/formatting";
import { Modal } from "@/components/shared/Modal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { PoemForm } from "@/components/admin/forms/PoemForm";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import type { CreatePoemRequest, Poem } from "@/lib/types";

type ModalMode = "create" | "edit" | null;
type UpdatePoemPayload = Partial<
  Omit<CreatePoemRequest, "collection_id" | "poet_id">
>;

export default function AdminPoemsPage() {
  const { data: poems, loading, error, refetch } = useFetch(poemAPI.getAll);
  const { data: collections } = useFetch(collectionAPI.getAll);
  const { data: poets } = useFetch(poetAPI.getAll);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Poem | null>(null);
  const [activeAudioPoemId, setActiveAudioPoemId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPoems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return poems ?? [];
    return (poems ?? []).filter(
      (poem) =>
        poem.name.toLowerCase().includes(q) ||
        poem.text.toLowerCase().includes(q) ||
        (poem.description ?? "").toLowerCase().includes(q) ||
        (poem.collection?.name ?? "").toLowerCase().includes(q) ||
        (poem.poet?.name ?? "").toLowerCase().includes(q),
    );
  }, [poems, searchQuery]);

  const openCreate = () => {
    setSelectedPoem(null);
    setModalMode("create");
  };

  const handleCreate = async (payload: CreatePoemRequest) => {
    await poemAPI.create(payload);
    addNotification("Poem created successfully", "success");
    setModalMode(null);
    refetch();
  };

  const openEdit = (poem: Poem) => {
    setSelectedPoem(poem);
    setModalMode("edit");
  };

  const handleEdit = async (payload: CreatePoemRequest) => {
    if (!selectedPoem) return;
    const updatePayload: UpdatePoemPayload = {
      name: payload.name,
      text: payload.text,
      poemNo: payload.poemNo,
      description: payload.description,
      audio: payload.audio,
      image: payload.image,
    };
    await poemAPI.update(selectedPoem.id, updatePayload);
    addNotification("Poem updated successfully", "success");
    setModalMode(null);
    setSelectedPoem(null);
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await poemAPI.remove(deleteTarget.id);
      addNotification("Poem deleted successfully", "success");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      addNotification(getErrorMessage(err), "error");
    }
  };

  const handleFormSubmit = async (payload: CreatePoemRequest) => {
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
    setSelectedPoem(null);
  };

  const collectionList = (collections ?? []).map((c) => ({ id: c.id, name: c.name }));
  const poetList = (poets ?? []).map((p) => ({ id: p.id, name: p.name }));

  return (
    <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Poem Management</h1>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            + Create Poem
          </button>
        </div>

        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter by poem, poet, collection, or text…"
          className="mt-4 max-w-md"
        />
      </div>

      {/* States */}
      {loading && <p className="px-4 py-3 text-sm text-slate-500">Loading poems...</p>}
      {error && <p className="px-4 py-3 text-sm text-rose-700">{error}</p>}

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">#</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Name</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Collection</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Poet</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Description</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Audio</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPoems.map((poem) => (
              <tr key={poem.id} className="border-b last:border-0 even:bg-slate-50/50 hover:bg-indigo-50/30 transition-colors">
                <td className="py-2 px-4 text-slate-400">{poem.poemNo}</td>
                <td className="py-2 px-4 font-medium">{poem.name}</td>
                <td className="py-2 px-4 text-slate-600">{poem.collection?.name ?? "—"}</td>
                <td className="py-2 px-4 text-slate-600">{poem.poet?.name ?? "—"}</td>
                <td className="py-2 px-4 text-slate-500">
                  {truncate(poem.description, 60) || <span className="italic text-slate-300">—</span>}
                </td>
                <td className="py-2 px-4">
                  {poem.audio ? (
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveAudioPoemId((current) =>
                            current === poem.id ? null : poem.id,
                          )
                        }
                        className="rounded-md bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                      >
                        {activeAudioPoemId === poem.id ? "Hide Player" : "Listen"}
                      </button>
                      {activeAudioPoemId === poem.id && (
                        <audio controls preload="none" className="h-8 w-52 max-w-full">
                          <source src={poem.audio} />
                        </audio>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">No audio</span>
                  )}
                </td>
                <td className="py-2 px-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(poem)}
                      className="rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(poem)}
                      className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && filteredPoems.length === 0 && (
              <tr>
                <td colSpan={7}>
                  <EmptyState
                    title={searchQuery ? `No poems match "${searchQuery}"` : "No poems found"}
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
        title={modalMode === "create" ? "Create Poem" : "Edit Poem"}
        size="lg"
      >
        <PoemForm
          key={selectedPoem?.id ?? "create"}
          initialData={
            selectedPoem
              ? {
                name: selectedPoem.name,
                text: selectedPoem.text,
                poemNo: selectedPoem.poemNo,
                collection_id: selectedPoem.collectionId,
                poet_id: selectedPoem.poetId,
                description: selectedPoem.description ?? undefined,
                audio: selectedPoem.audio ?? undefined,
                image: selectedPoem.image ?? undefined,
              }
              : undefined
          }
          collections={collectionList}
          poets={poetList}
          onSubmit={handleFormSubmit}
          onCancel={closeModal}
          disableRelationFields={modalMode === "edit"}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Poem"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </section>
  );
}
