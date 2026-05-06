import { API_ENDPOINTS } from "@/lib/constants/api";
import { apiClient } from "@/lib/api/client";
import type { Booth, BoothStatus, CreateBoothRequest } from "@/lib/types";

export const boothAPI = {
  getAll: () => apiClient.get<Booth[]>(API_ENDPOINTS.booths),
  getById: (id: string) => apiClient.get<Booth>(API_ENDPOINTS.boothById(id)),
  getCollections: (id: string) =>
    apiClient.get<Booth>(API_ENDPOINTS.boothCollectionsByBoothId(id)),
  create: (payload: CreateBoothRequest) =>
    apiClient.post<Booth>(API_ENDPOINTS.booth, payload),
  update: (id: string, payload: Partial<Booth>) =>
    apiClient.put<Booth>(API_ENDPOINTS.boothById(id), payload),
  updateStatus: (id: string, status: BoothStatus) =>
    apiClient.patch<Booth>(`${API_ENDPOINTS.boothById(id)}/status`, { status }),
  remove: (id: string) => apiClient.delete<void>(API_ENDPOINTS.boothById(id)),
};
