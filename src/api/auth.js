// src/api/auth.js
const API_BASE = process.env.REACT_APP_SERVER_URL || "";

/* Google login */
export async function loginWithGoogle(credential) {
  const res = await fetch(`${API_BASE}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Always include credentials
    body: JSON.stringify({ credential }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Google login failed");
  }
  const { user } = await res.json();
  return user;
}

/* Apple login (redirect) */
export function loginWithApple() {
  // This will redirect the browser to our backend Apple OAuth endpoint,
  // then Apple will redirect back to FRONTEND_ORIGIN with cookies set.
  window.location.href = `${API_BASE}/api/auth/apple`;
}

/* Logout */
export async function logout() {
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => {});
}
