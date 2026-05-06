import { API_ENDPOINTS } from "@/lib/constants/api";
import { apiClient } from "@/lib/api/client";
import type { Collection, CreateCollectionRequest, Poem } from "@/lib/types";

export const collectionAPI = {
  getAll: () => apiClient.get<Collection[]>(API_ENDPOINTS.collections),
  getById: (id: string) =>
    apiClient.get<Collection>(API_ENDPOINTS.collectionById(id)),
  getBooths: (id: string) =>
    apiClient.get<Collection>(API_ENDPOINTS.collectionBoothsById(id)),
  getPoems: (id: string) => apiClient.get<Poem[]>(API_ENDPOINTS.collectionPoems(id)),
  create: (payload: CreateCollectionRequest) =>
    apiClient.post<Collection>(API_ENDPOINTS.collection, payload),
  update: (id: string, payload: Partial<Collection>) =>
    apiClient.put<Collection>(API_ENDPOINTS.collectionById(id), payload),
  remove: (id: string) => apiClient.delete<void>(API_ENDPOINTS.collectionById(id)),
};
