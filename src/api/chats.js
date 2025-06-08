import { API_BASE } from "../config";
export async function fetchChatSessions() {
    const res = await fetch(`${API_BASE}/api/chats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to fetch chat sessions");
    }
    return res.json();
}
export async function fetchChatSession(id) {
    const res = await fetch(`${API_BASE}/api/chats/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to fetch chat session");
    }
    return res.json();
}
export async function endChatSession(sessionId) {
    const res = await fetch(`${API_BASE}/api/chats/${sessionId}/end`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to end chat session");
    }
}
