export type Visibility = "public" | "private";
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

export interface PasteMeta {
  slug: string;
  title: string | null;
  language: string;
  visibility: Visibility;
  burn_after_read: boolean;
  has_password: boolean;
  is_owner: boolean;
  expires_at: string | null;
  created_at: string;
  line_count: number;
  char_count: number;
}

const OWNER_KEY = "mp_owner_token";

function getOwnerToken(): string {
  let t = localStorage.getItem(OWNER_KEY);
  if (!t) {
    t = (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`)
      .replace(/[^a-zA-Z0-9_-]/g, "");
    if (t.length < 8) t = t.padEnd(8, "x");
    localStorage.setItem(OWNER_KEY, t);
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
      ...((init.headers as Record<string, string>) || {}),
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

export function getPasteMeta(slug: string): Promise<PasteMeta> {
  return req<PasteMeta>(`/pastes/${slug}/meta`);
}

export function rawUrl(slug: string): string {
  return `/api/pastes/${slug}/raw`;
}
