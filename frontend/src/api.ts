export type Visibility = "public" | "unlisted" | "private";
export type ExpiresIn = "10m" | "1h" | "1d" | "1w" | "never";

export interface PasteCreate {
  title?: string | null;
  content: string;
  language?: string;
  visibility: Visibility;
  expires_in: ExpiresIn;
  password?: string | null;
  burn_after_read?: boolean;
}

export interface PasteCreated {
  slug: string;
  url: string;
  expires_at: string | null;
}

export interface Paste {
  slug: string;
  title: string | null;
  content: string;
  language: string;
  visibility: Visibility;
  burn_after_read: boolean;
  expires_at: string | null;
  view_count: number;
  created_at: string;
  is_owner: boolean;
}

export interface PasteListItem {
  slug: string;
  title: string | null;
  snippet: string;
  language: string;
  visibility: Visibility;
  burn_after_read: boolean;
  expires_at: string | null;
  created_at: string;
}

function getOwnerToken(): string {
  const key = "mp_owner_token";
  let t = localStorage.getItem(key);
  if (!t) {
    t = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`)
      .replace(/[^a-zA-Z0-9_-]/g, "");
    if (t.length < 8) t = t.padEnd(8, "x");
    localStorage.setItem(key, t);
  }
  return t;
}

export class ApiError extends Error {
  status: number;
  body: any;
  constructor(message: string, status: number, body: any) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const r = await fetch(`/api${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-Owner-Token": getOwnerToken(),
      ...(init.headers || {}),
    },
  });
  const text = await r.text();
  const data = text ? (() => { try { return JSON.parse(text); } catch { return text; } })() : null;
  if (!r.ok) throw new ApiError(r.statusText, r.status, data);
  return data as T;
}

export function createPaste(body: PasteCreate): Promise<PasteCreated> {
  return req<PasteCreated>("/pastes", { method: "POST", body: JSON.stringify(body) });
}

export function getPaste(slug: string, password?: string): Promise<Paste> {
  const qs = password ? `?password=${encodeURIComponent(password)}` : "";
  return req<Paste>(`/pastes/${slug}${qs}`);
}

export function listPastes(q?: string, visibility?: Visibility): Promise<PasteListItem[]> {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (visibility) params.set("visibility", visibility);
  const qs = params.toString();
  return req<PasteListItem[]>(`/pastes${qs ? `?${qs}` : ""}`);
}

export function deletePaste(slug: string): Promise<void> {
  return req<void>(`/pastes/${slug}`, { method: "DELETE" });
}

export function rawUrl(slug: string): string {
  return `/api/pastes/${slug}/raw`;
}
