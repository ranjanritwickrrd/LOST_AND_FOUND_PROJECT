import {
  ItemResponse, ItemCreateRequest, ClaimCreateRequest, ClaimWithClaimer,
  ClaimPublic, TokenResponse,
} from "./types";

const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://127.0.0.1:3000";

const tokenStore = {
  get: () => (typeof window === "undefined" ? "" : localStorage.getItem("token") || ""),
  set: (t: string) => typeof window !== "undefined" && localStorage.setItem("token", t),
  clear: () => typeof window !== "undefined" && localStorage.removeItem("token"),
};

async function request<T>(path: string, opts: RequestInit = {}, authed = false): Promise<T> {
  const headers = new Headers(opts.headers as HeadersInit);
  headers.set("Content-Type", "application/json");
  if (authed) {
    const t = tokenStore.get();
    if (!t) throw new Error("Please sign in.");
    headers.set("Authorization", `Bearer ${t}`);
  }
  const res = await fetch(`${BASE}${path}`, { ...opts, headers, cache: "no-store" });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = await res.json(); if (j?.error) msg = j.error; } catch {}
    throw new Error(msg);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

export const api = {
  tokenStore,
  login: (username: string, password: string) =>
    request<TokenResponse>("/api/auth/login", { method: "POST", body: JSON.stringify({ username, password }) }),
  register: (payload: Record<string, unknown>) =>
    request("/api/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request<{ id: string; username: string; name?: string }>("/api/me", {}, true),
  listItems: () => request<ItemResponse[]>("/api/items"),
  getItem: (id: string) => request<ItemResponse>(`/api/items/${id}`),
  createItem: (payload: ItemCreateRequest) =>
    request<ItemResponse>("/api/items", { method: "POST", body: JSON.stringify(payload) }, true),
  claimItem: (itemId: string, payload: ClaimCreateRequest) =>
    request(`/api/items/${itemId}/claim`, { method: "POST", body: JSON.stringify(payload) }, true),
  listItemClaimsAsOwner: (itemId: string) =>
    request<ClaimWithClaimer[]>(`/api/items/${itemId}/claims`, {}, true),
  myClaims: () => request<ClaimPublic[]>(`/api/claims/mine`, {}, true),
  approveClaim: (claimId: string) =>
    request(`/api/claims/${claimId}/approve`, { method: "POST" }, true),
  rejectClaim: (claimId: string) =>
    request(`/api/claims/${claimId}/reject`, { method: "POST" }, true),
};
