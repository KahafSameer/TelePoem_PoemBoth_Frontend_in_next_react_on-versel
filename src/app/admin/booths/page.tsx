"use client";

import { useState, useMemo } from "react";
import { boothAPI } from "@/lib/api/booths";
import { useFetch } from "@/lib/hooks/useFetch";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { Modal } from "@/components/shared/Modal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { BoothForm } from "@/components/admin/forms/BoothForm";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Booth, BoothStatus } from "@/lib/types";

type ModalMode = "create" | "edit" | null;

export default function AdminBoothsPage() {
  const { data, loading, error, refetch } = useFetch(boothAPI.getAll);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Booth | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBooths = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return data ?? [];
    return (data ?? []).filter(
      (b) =>
        b.location.toLowerCase().includes(q) ||
        b.theme.toLowerCase().includes(q) ||
        b.status.toLowerCase().includes(q),
    );
  }, [data, searchQuery]);

  // ── Create ──────────────────────────────────────────────────────────────────
  const openCreate = () => {
    setSelectedBooth(null);
    setModalMode("create");
  };

  const handleCreate = async (payload: { location: string; theme: string }) => {
    await boothAPI.create(payload);
    addNotification("Booth created successfully", "success");
    setModalMode(null);
    refetch();
  };

  // ── Edit ────────────────────────────────────────────────────────────────────
  const openEdit = (booth: Booth) => {
    setSelectedBooth(booth);
    setModalMode("edit");
  };

  const handleEdit = async (payload: { location: string; theme: string }) => {
    if (!selectedBooth) return;
    await boothAPI.update(selectedBooth.id, payload);
    addNotification("Booth updated successfully", "success");
    setModalMode(null);
    setSelectedBooth(null);
    refetch();
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await boothAPI.remove(deleteTarget.id);
      addNotification("Booth deleted successfully", "success");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      addNotification(getErrorMessage(err), "error");
    }
  };

  // ── Toggle Status ────────────────────────────────────────────────────────────
  const handleToggleStatus = async (booth: Booth) => {
    const nextStatus: BoothStatus = booth.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await boothAPI.updateStatus(booth.id, nextStatus);
      addNotification(
        `Booth status changed to ${nextStatus.toLowerCase()}`,
        "success",
      );
      refetch();
    } catch (err) {
      addNotification(getErrorMessage(err), "error");
    }
  };

  // ── Form submit dispatcher ───────────────────────────────────────────────────
  const handleFormSubmit = async (payload: { location: string; theme: string }) => {
    try {
      if (modalMode === "create") {
        await handleCreate(payload);
      } else if (modalMode === "edit") {
        await handleEdit(payload);
      }
    } catch (err) {
      addNotification(getErrorMessage(err), "error");
      throw err; // let BoothForm show its own inline error too
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedBooth(null);
  };

  return (
    <section className="rounded-2xl border bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Booth Management</h1>
          <button
            type="button"
            onClick={openCreate}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            + Create Booth
          </button>
        </div>

        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Filter by location, theme, or status…"
          className="mt-4 max-w-sm"
        />
      </div>

      {/* States */}
      {loading && <p className="px-4 py-3 text-sm text-slate-500">Loading booths...</p>}
      {error && <p className="px-4 py-3 text-sm text-rose-700">{error}</p>}

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Location</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Theme</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Collections</th>
              <th className="py-3 px-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooths.map((booth) => (
              <tr key={booth.id} className="border-b last:border-0 even:bg-slate-50/50 hover:bg-indigo-50/30 transition-colors">
                <td className="py-2 px-4">{booth.location}</td>
                <td className="py-2 px-4">{booth.theme}</td>
                <td className="py-2 px-4">
                  <StatusBadge status={booth.status} />
                </td>
                <td className="py-2 px-4">{booth.boothCollections?.length ?? 0}</td>
                <td className="py-2 px-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Toggle Status */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(booth)}
                      className="rounded-md bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                    >
                      {booth.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>

                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() => openEdit(booth)}
                      className="rounded-md bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(booth)}
                      className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && filteredBooths.length === 0 && (
              <tr>
                <td colSpan={5}>
                  <EmptyState
                    title={searchQuery ? `No booths match "${searchQuery}"` : "No booths found"}
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
        title={modalMode === "create" ? "Create Booth" : "Edit Booth"}
        size="md"
      >
        <BoothForm
          key={selectedBooth?.id ?? "create"}
          initialData={
            selectedBooth
              ? { location: selectedBooth.location, theme: selectedBooth.theme }
              : undefined
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
        title="Delete Booth"
        message={`Are you sure you want to delete the booth at "${deleteTarget?.location}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </section>
  );
}

// ── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: BoothStatus }) {
  const isActive = status === "ACTIVE";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${isActive
        ? "bg-green-100 text-green-800"
        : "bg-slate-100 text-slate-600"
        }`}
    >
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}
