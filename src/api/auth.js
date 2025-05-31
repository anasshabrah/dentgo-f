// src/api/auth.js
const API_BASE = process.env.REACT_APP_SERVER_URL || '';

/* Google login */
export async function loginWithGoogle(credential) {
  const res = await fetch(`${API_BASE}/api/auth/google`, {
    method      : 'POST',
    headers     : { 'Content-Type': 'application/json' },
    credentials : 'include',
    body        : JSON.stringify({ credential }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Google login failed');
  const { user } = await res.json();
  return user;
}

/* Apple login (redirect) */
export function loginWithApple() {
  window.location.href = `${API_BASE}/api/auth/apple`;
}

/* ------------------------------------------------------------------ */
/* Logout – calls backend and lets the context wipe local state       */
/* ------------------------------------------------------------------ */
export async function logout() {
  await fetch(`${API_BASE}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  }).catch(() => {});
}
