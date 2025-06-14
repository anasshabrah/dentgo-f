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
 * Fetch the CSRF token from the server.
 */
export async function fetchCsrfToken(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/auth/csrf-token`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch CSRF token");
  }
  const { csrfToken } = (await res.json()) as { csrfToken: string };
  return csrfToken;
}

/**
 * Google login via one-tap credential token
 */
export async function loginWithGoogle(credential: string): Promise<User> {
  const csrfToken = await fetchCsrfToken();
  const res = await fetch(`${API_BASE}/api/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-csrf-token": csrfToken,
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
 * Kick off Apple OAuth login
 */
export function loginWithApple(): void {
  window.location.href = `${API_BASE}/api/auth/apple`;
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  const csrfToken = await fetchCsrfToken();
  const res = await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "x-csrf-token": csrfToken,
    },
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Logout failed");
  }
}

/**
 * Permanently delete the current user's account
 */
export async function deleteAccount(): Promise<void> {
  const csrfToken = await fetchCsrfToken();
  const res = await fetch(`${API_BASE}/api/auth/delete`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "x-csrf-token": csrfToken,
    },
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to delete account");
  }
}
