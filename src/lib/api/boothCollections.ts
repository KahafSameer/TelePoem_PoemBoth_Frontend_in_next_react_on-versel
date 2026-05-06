import { API_ENDPOINTS } from "@/lib/constants/api";
import { apiClient } from "@/lib/api/client";
import type { BoothCollection, LinkBoothCollectionRequest } from "@/lib/types";

export const boothCollectionAPI = {
  link: (payload: LinkBoothCollectionRequest) =>
    apiClient.post<BoothCollection>(API_ENDPOINTS.boothCollection, payload),
  unlink: (boothId: string, collectionId: string) =>
    apiClient.delete<void>(
      `${API_ENDPOINTS.boothCollection}?booth_id=${boothId}&collection_id=${collectionId}`,
    ),
};
