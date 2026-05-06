import { API_ENDPOINTS } from "@/lib/constants/api";
import { apiClient } from "@/lib/api/client";
import type { CreatePoemRequest, Poem } from "@/lib/types";

export const poemAPI = {
  getAll: () => apiClient.get<Poem[]>(API_ENDPOINTS.poems),
  getById: (id: string) => apiClient.get<Poem>(API_ENDPOINTS.poemById(id)),
  getAudioById: (id: string) =>
    apiClient.get<{ audio: string | null }>(API_ENDPOINTS.poemAudioById(id)),
  create: (payload: CreatePoemRequest) => apiClient.post<Poem>(API_ENDPOINTS.poems, payload),
  update: (id: string, payload: Partial<Poem>) =>
    apiClient.put<Poem>(API_ENDPOINTS.poemById(id), payload),
  remove: (id: string) => apiClient.delete<void>(API_ENDPOINTS.poemById(id)),
};
