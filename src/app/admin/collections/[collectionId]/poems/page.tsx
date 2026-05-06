"use client";

import { use, useState, useCallback } from "react";
import Link from "next/link";
import { collectionAPI } from "@/lib/api/collections";
import { boothAPI } from "@/lib/api/booths";
import { boothCollectionAPI } from "@/lib/api/boothCollections";
import { useFetch } from "@/lib/hooks/useFetch";
import { useNotificationStore } from "@/lib/store/notificationStore";
import { getErrorMessage } from "@/lib/utils/errorHandler";
import { Modal } from "@/components/shared/Modal";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Select } from "@/components/shared/form/Select";
import { Button } from "@/components/shared/form/Button";
import type { Booth } from "@/lib/types";

export default function ManageCollectionPoemsPage({
  params,
}: {
  params: Promise<{ collectionId: string }>;
}) {
  const { collectionId } = use(params);
  const addNotification = useNotificationStore((s) => s.addNotification);

  const {
    data: collection,
    loading: collectionLoading,
    error: collectionError,
    refetch: refetchCollection,
  } = useFetch(useCallback(() => collectionAPI.getById(collectionId), [collectionId]));

  const {
    data: poems,
    loading: poemsLoading,
    error: poemsError,
  } = useFetch(useCallback(() => collectionAPI.getPoems(collectionId), [collectionId]));

  const { data: allBooths, loading: boothsLoading } = useFetch(boothAPI.getAll);

  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [selectedBoothId, setSelectedBoothId] = useState<string>("");
  const [isLinking, setIsLinking] = useState(false);
  const [unlinkTarget, setUnlinkTarget] = useState<Booth | null>(null);
  const [activeAudioPoemId, setActiveAudioPoemId] = useState<string | null>(null);

  const linkedBooths: Booth[] =
    (collection?.boothCollections ?? [])
      .map((bc) => bc.booth)
      .filter((b): b is Booth => b !== null) ?? [];

  const linkedBoothIds = new Set(linkedBooths.map((b) => b.id));
  const availableBooths = (allBooths ?? []).filter((b) => !linkedBoothIds.has(b.id));

  const openLinkModal = () => {
    setSelectedBoothId(availableBooths[0]?.id ?? "");
    setLinkModalOpen(true);
  };

  const handleLink = async () => {
    if (!selectedBoothId) return;
    setIsLinking(true);
    try {
      await boothCollectionAPI.link({ booth_id: selectedBoothId, collection_id: collectionId });
      addNotification("Booth linked successfully", "success");
      setLinkModalOpen(false);
      refetchCollection();
    } catch (err) {
      addNotification(getErrorMessage(err), "error");
    } finally {
      setIsLinking(false);
    }
  };

  const handleUnlink = async () => {
    if (!unlinkTarget) return;
    try {
      await boothCollectionAPI.unlink(unlinkTarget.id, collectionId);
      addNotification("Booth unlinked successfully", "success");
      setUnlinkTarget(null);
      refetchCollection();
    } catch (err) {
      addNotification(getErrorMessage(err), "error");
    }
  };

  const isLoading = collectionLoading || poemsLoading;
  const pageError = collectionError ?? poemsError;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/collections"
        className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:underline"
      >
        ← Back to Collections
      </Link>

      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {collectionLoading ? "Loading…" : collection ? collection.name : "Collection"}
        </h1>
        <p className="mt-1 text-sm text-slate-500">Manage poems and linked booths</p>
      </div>

      {isLoading && <p className="text-sm text-slate-500">Loading...</p>}
      {pageError && <p className="text-sm text-rose-700">{pageError}</p>}

      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-800">Poems</h2>
        {poemsLoading && <p className="mt-2 text-sm text-slate-500">Loading poems...</p>}
        {!poemsLoading && (poems ?? []).length === 0 && (
          <p className="mt-2 text-sm text-slate-400">No poems in this collection.</p>
        )}
        <ul className="mt-3 space-y-2">
          {(poems ?? []).map((poem) => (
            <li
              key={poem.id}
              className="flex items-center justify-between gap-4 rounded-md border border-slate-200 px-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <span className="text-slate-700">
                  <span className="mr-2 font-medium text-slate-400">#{poem.poemNo}</span>
                  {poem.name}
                </span>
                {poem.poet && (
                  <p className="text-xs text-slate-400">{poem.poet.name}</p>
                )}
              </div>
              <div className="shrink-0">
                {poem.audio ? (
                  <div className="space-y-2 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveAudioPoemId((current) =>
                          current === poem.id ? null : poem.id,
                        )
                      }
                      className="rounded-md border border-indigo-300 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">Linked Booths</h2>
          <Button
            type="button"
            onClick={openLinkModal}
            disabled={boothsLoading || availableBooths.length === 0}
          >
            + Link Booth
          </Button>
        </div>

        {boothsLoading && <p className="mt-2 text-sm text-slate-500">Loading booths...</p>}
        {!boothsLoading && linkedBooths.length === 0 && (
          <p className="mt-3 text-sm text-slate-400">No booths linked to this collection yet.</p>
        )}

        <ul className="mt-3 space-y-2">
          {linkedBooths.map((booth) => (
            <li
              key={booth.id}
              className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-sm"
            >
              <div>
                <span className="font-medium text-slate-800">{booth.location}</span>
                <span className="ml-2 text-xs text-slate-400">{booth.theme}</span>
              </div>
              <button
                type="button"
                onClick={() => setUnlinkTarget(booth)}
                className="rounded-md border border-red-300 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Unlink
              </button>
            </li>
          ))}
        </ul>
      </section>

      <Modal
        isOpen={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        title="Link Booth"
        size="sm"
      >
        <div className="flex flex-col gap-4">
          {availableBooths.length === 0 ? (
            <p className="text-sm text-slate-500">All booths are already linked to this collection.</p>
          ) : (
            <Select
              label="Select Booth"
              required
              value={selectedBoothId}
              onChange={(e) => setSelectedBoothId(e.target.value)}
              options={availableBooths.map((b) => ({
                value: b.id,
                label: `${b.location} — ${b.theme}`,
              }))}
            />
          )}
          <div className="flex justify-end gap-3 pt-1">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setLinkModalOpen(false)}
              disabled={isLinking}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleLink}
              loading={isLinking}
              disabled={isLinking || availableBooths.length === 0}
            >
              Link
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={unlinkTarget !== null}
        onClose={() => setUnlinkTarget(null)}
        onConfirm={handleUnlink}
        title="Unlink Booth"
        message={`Are you sure you want to unlink "${unlinkTarget?.location}" from this collection?`}
        confirmLabel="Unlink"
        variant="warning"
      />
    </div>
  );
}
