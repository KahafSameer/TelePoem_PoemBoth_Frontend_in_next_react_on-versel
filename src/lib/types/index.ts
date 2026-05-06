export type BoothStatus = "ACTIVE" | "INACTIVE";

export interface Booth {
  id: string;
  location: string;
  theme: string;
  status: BoothStatus;
  createdAt: string;
  updatedAt: string;
  boothCollections: BoothCollection[] | null;
}

export interface Collection {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  boothCollections: BoothCollection[] | null;
  poems: Poem[] | null;
}

export interface BoothCollection {
  boothId: string;
  collectionId: string;
  createdAt: string;
  booth: Booth | null;
  collection: Collection | null;
}

export interface Poet {
  id: string;
  name: string;
  bio: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  poems: Poem[] | null;
}

export interface Poem {
  id: string;
  name: string;
  text: string;
  description: string | null;
  audio: string | null;
  image: string | null;
  poemNo: number;
  collectionId: string;
  poetId: string;
  createdAt: string;
  updatedAt: string;
  collection: Collection | null;
  poet: Poet | null;
}

export interface CreateBoothRequest {
  location: string;
  theme: string;
}

export interface CreateCollectionRequest {
  name: string;
}

export interface CreatePoetRequest {
  name: string;
  bio?: string;
  image?: string;
}

export interface CreatePoemRequest {
  name: string;
  text: string;
  collection_id: string;
  poet_id: string;
  poemNo: number;
  description?: string;
  audio?: string;
  image?: string;
}

export interface LinkBoothCollectionRequest {
  booth_id: string;
  collection_id: string;
}
