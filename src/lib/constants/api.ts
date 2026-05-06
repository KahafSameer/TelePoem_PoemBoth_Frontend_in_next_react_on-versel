// Set NEXT_PUBLIC_API_URL in your .env.local to override the default API base URL.
// Example: NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api/v1
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1";

export const API_ENDPOINTS = {
  booths: "/booths",
  booth: "/booth",
  boothById: (id: string) => `/booth/${id}`,
  boothCollectionsByBoothId: (id: string) => `/booth/${id}/collections`,
  collections: "/collections",
  collection: "/collection",
  collectionById: (id: string) => `/collection/${id}`,
  collectionBoothsById: (id: string) => `/collection/${id}/booths`,
  poets: "/poets",
  poetById: (id: string) => `/poets/${id}`,
  poems: "/poems",
  poemById: (id: string) => `/poems/${id}`,
  poemAudioById: (id: string) => `/poems/${id}/audio`,
  collectionPoems: (id: string) => `/collections/${id}/poems`,
  boothCollection: "/booth-collection",
} as const;
