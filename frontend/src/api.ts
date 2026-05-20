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

export interface User {
  id: number;
  email: string;
  name: string | null;
  created_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

const OWNER_KEY = "mp_owner_token";
const TOKEN_KEY = "mp_token";

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

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Owner-Token": getOwnerToken(),
    ...((init.headers as Record<string, string>) || {}),
  };
  const tok = getAuthToken();
  if (tok && !headers["Authorization"]) headers["Authorization"] = `Bearer ${tok}`;
  const r = await fetch(`/api${path}`, { ...init, headers });
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

// auth
export function signUp(email: string, password: string, name?: string): Promise<AuthResponse> {
  return req<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name }),
  });
}

export function signIn(email: string, password: string): Promise<AuthResponse> {
  return req<AuthResponse>("/auth/signin", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function fetchMe(): Promise<User> {
  return req<User>("/auth/me");
}

export function signOut(): Promise<void> {
  return req<void>("/auth/signout", { method: "POST" });
}
