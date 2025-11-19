export type Role = "STUDENT" | "TEACHER" | "ADMIN" | null | undefined;
export type ItemType = "FOUND" | "LOST";
export type ClaimStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface TokenResponse { token: string }

export interface ItemResponse {
  id: string;
  title: string;
  description?: string | null;
  type: ItemType;
  category?: string | null;
  locationFound?: string | null;
  dateFound?: string | null; // ISO
  imageUrl?: string | null;
  createdAt: string;
  ownerId?: string; // Placeholder for client-side ownership check
}

export interface ItemCreateRequest {
  type: ItemType;
  title: string;
  description?: string;
  category?: string | null;
  locationFound?: string | null;
  dateFound?: string | null; // ISO
  imageUrl?: string | null;
}

export interface UserLite {
  id: string;
  username: string;
  name?: string | null;
}

export interface ClaimCreateRequest {
  message?: string;
  contact?: string;
}

export interface ClaimPublic {
  id: string;
  status: ClaimStatus;
  message?: string | null;
  contact?: string | null;
  createdAt: string;
  itemId: string;
}

export interface ClaimWithClaimer {
  id: string;
  status: ClaimStatus;
  message?: string | null;
  contact?: string | null;
  createdAt: string;
  claimer: UserLite;
}
