import { API_BASE } from "../config";
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
    const { user } = (await res.json());
    return user;
}
/* Apple login (redirect) */
export function loginWithApple() {
    window.location.href = `${API_BASE}/api/auth/apple`;
}
/* Logout */
export async function logout() {
    await fetch(`${API_BASE}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
    }).catch(() => { });
}
