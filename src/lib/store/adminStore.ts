"use client";

import { create } from "zustand";
import type { BoothStatus } from "@/lib/types";

type ModalType = "booth" | "collection" | "poem" | "link" | null;

interface AdminState {
  boothFilter: { status?: BoothStatus };
  collectionSearch: string;
  poemFilter: { collectionId?: string };
  sortBy: "name" | "date" | "count";
  sortOrder: "asc" | "desc";
  selectedBoothForEdit: string | null;
  selectedCollectionForEdit: string | null;
  selectedPoemForEdit: string | null;
  isModalOpen: boolean;
  modalType: ModalType;
  setBoothFilter: (filter: { status?: BoothStatus }) => void;
  setCollectionSearch: (search: string) => void;
  setPoemFilter: (filter: { collectionId?: string }) => void;
  setSortBy: (field: "name" | "date" | "count", order: "asc" | "desc") => void;
  selectItemForEdit: (type: "booth" | "collection" | "poem", id: string) => void;
  openModal: (type: Exclude<ModalType, null>) => void;
  closeModal: () => void;
  reset: () => void;
}

const initialState = {
  boothFilter: {},
  collectionSearch: "",
  poemFilter: {},
  sortBy: "date" as const,
  sortOrder: "desc" as const,
  selectedBoothForEdit: null,
  selectedCollectionForEdit: null,
  selectedPoemForEdit: null,
  isModalOpen: false,
  modalType: null as ModalType,
};

export const useAdminStore = create<AdminState>((set) => ({
  ...initialState,
  setBoothFilter: (boothFilter) => set({ boothFilter }),
  setCollectionSearch: (collectionSearch) => set({ collectionSearch }),
  setPoemFilter: (poemFilter) => set({ poemFilter }),
  setSortBy: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
  selectItemForEdit: (type, id) =>
    set({
      selectedBoothForEdit: type === "booth" ? id : null,
      selectedCollectionForEdit: type === "collection" ? id : null,
      selectedPoemForEdit: type === "poem" ? id : null,
    }),
  openModal: (modalType) => set({ isModalOpen: true, modalType }),
  closeModal: () => set({ isModalOpen: false, modalType: null }),
  reset: () => set(initialState),
}));
