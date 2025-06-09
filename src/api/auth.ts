// src/api/auth.ts

export interface User {
  id: number;
  name: string;
  email: string;
  picture?: string;
}

import { API_BASE } from "../config";

/* Google login */
export async function loginWithGoogle(
  credential: string
): Promise<User> {
  const res = await fetch(`${API_BASE}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ credential }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Google login failed");
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
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => {});
}

/**
 * Permanently deletes the current user’s account (and revokes all sessions).
 */
export async function deleteAccount(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/delete`, {
    method: "DELETE",
    credentials: "include",
    // remove Content-Type header so browser won't pre-flight
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to delete account");
  }
}
