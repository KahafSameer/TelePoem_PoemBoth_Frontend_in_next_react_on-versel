import { API_ENDPOINTS } from "@/lib/constants/api";
import { apiClient } from "@/lib/api/client";
import type { CreatePoetRequest, Poet } from "@/lib/types";

export const poetAPI = {
  getAll: () => apiClient.get<Poet[]>(API_ENDPOINTS.poets),
  getById: (id: string) => apiClient.get<Poet>(API_ENDPOINTS.poetById(id)),
  create: (payload: CreatePoetRequest) => apiClient.post<Poet>(API_ENDPOINTS.poets, payload),
  update: (id: string, payload: Partial<Poet>) =>
    apiClient.put<Poet>(API_ENDPOINTS.poetById(id), payload),
  remove: (id: string) => apiClient.delete<void>(API_ENDPOINTS.poetById(id)),
};
