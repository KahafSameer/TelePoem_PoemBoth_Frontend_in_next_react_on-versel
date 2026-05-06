"use client";

import { create } from "zustand";
import type { Booth, Poem } from "@/lib/types";
import { UI_CONSTANTS } from "@/lib/constants/ui";

interface ClientState {
  booths: Booth[] | null;
  selectedBoothId: string | null;
  selectedCollectionId: string | null;
  selectedPoemId: string | null;
  poems: Poem[] | null;
  isLoading: boolean;
  error: string | null;
  autoRotateEnabled: boolean;
  autoRotateInterval: number;
  isAudioPlaying: boolean;
  setBooths: (booths: Booth[]) => void;
  selectBooth: (boothId: string) => void;
  selectCollection: (collectionId: string) => void;
  selectPoem: (poemId: string) => void;
  setPoems: (poems: Poem[]) => void;
  toggleAutoRotate: () => void;
  setAutoRotateInterval: (seconds: number) => void;
  setAudioPlaying: (playing: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  booths: null,
  selectedBoothId: null,
  selectedCollectionId: null,
  selectedPoemId: null,
  poems: null,
  isLoading: false,
  error: null,
  autoRotateEnabled: true,
  autoRotateInterval: UI_CONSTANTS.defaultAutoRotateSeconds,
  isAudioPlaying: false,
};

export const useClientStore = create<ClientState>((set) => ({
  ...initialState,
  setBooths: (booths) => set({ booths }),
  selectBooth: (selectedBoothId) => set({ selectedBoothId }),
  selectCollection: (selectedCollectionId) => set({ selectedCollectionId }),
  selectPoem: (selectedPoemId) => set({ selectedPoemId }),
  setPoems: (poems) => set({ poems }),
  toggleAutoRotate: () =>
    set((state) => ({ autoRotateEnabled: !state.autoRotateEnabled })),
  setAutoRotateInterval: (autoRotateInterval) => set({ autoRotateInterval }),
  setAudioPlaying: (isAudioPlaying) => set({ isAudioPlaying }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),
}));
