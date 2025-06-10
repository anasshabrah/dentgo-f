// src/api/auth.ts

import { API_BASE } from "@/config";

export interface User {
  id: number;
  name: string;
  email: string;
  picture?: string;
}

/**
 * Utility: Parses error responses consistently.
 */
async function handleErrorResponse(
  res: Response,
  defaultMessage: string
): Promise<never> {
  const text = await res.text().catch(() => "");
  let errorMsg = defaultMessage;
  try {
    const body = JSON.parse(text);
    errorMsg = body.error || errorMsg;
  } catch {
    errorMsg = text || errorMsg;
  }
  throw new Error(errorMsg);
}

/* Google login */
export async function loginWithGoogle(credential: string): Promise<User> {
  const res = await fetch(`${API_BASE}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ credential }),
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Google login failed");
  }
  const { user } = (await res.json()) as { user: User };
  return user;
}

/* Apple login (redirect) */
export function loginWithApple(): void {
  window.location.href = `${API_BASE}/api/auth/apple`;
}

/* Logout */
export async function logout(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    mode: "cors",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Logout failed");
  }
}

/**
 * Permanently deletes the current user’s account (and revokes all sessions).
 * NOTE: we remove any custom headers here so the DELETE remains a “simple” request
 * and the browser will correctly include cookies.
 */
export async function deleteAccount(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/delete`, {
    method: "DELETE",
    credentials: "include",
    mode: "cors",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to delete account");
  }
}
