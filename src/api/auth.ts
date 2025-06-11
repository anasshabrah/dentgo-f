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

/**
 * Google login via credential token
 */
export async function loginWithGoogle(credential: string): Promise<User> {
  const res = await fetch(`${API_BASE}/api/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ credential }),
  });

  if (!res.ok) {
    await handleErrorResponse(res, "Google login failed");
  }

  const { user } = (await res.json()) as { user: User };
  return user;
}

/**
 * Redirects to Apple login
 */
export function loginWithApple(): void {
  window.location.href = `${API_BASE}/api/auth/apple`;
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    await handleErrorResponse(res, "Logout failed");
  }
}

/**
 * Permanently delete the current user's account
 */
export async function deleteAccount(): Promise<void> {
  const res = await fetch(`${API_BASE}/api/auth/delete`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    await handleErrorResponse(res, "Failed to delete account");
  }
}
