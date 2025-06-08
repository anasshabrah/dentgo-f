import { API_BASE } from "../config";
export async function fetchCards() {
    const res = await fetch(`${API_BASE}/api/payments/cards`, {
        credentials: "include",
    });
    if (!res.ok) {
        throw new Error("Failed to fetch cards");
    }
    const data = (await res.json());
    return data.cards;
}
export async function createCard(payload) {
    const res = await fetch(`${API_BASE}/api/payments/cards`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to create card");
    }
}
