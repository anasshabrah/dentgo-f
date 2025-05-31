// src/api/cards.js
const API_BASE = process.env.REACT_APP_SERVER_URL || "";

/**
 * GET /api/cards
 * Returns all saved cards for the authenticated user.
 */
export async function fetchCards() {
  const res = await fetch(`${API_BASE}/api/cards`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch cards");
  return res.json();
}

/**
 * GET /api/cards/:id
 * Returns a single card (must belong to user).
 */
export async function fetchCard(id) {
  const res = await fetch(`${API_BASE}/api/cards/${id}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch card");
  return res.json();
}

/**
 * POST /api/cards
 * Body: { paymentMethodId: string, nickName?: string }
 * Attaches the PM to Stripe and creates a new Card row in Prisma.
 */
export async function createCard({ paymentMethodId, nickName }) {
  const res = await fetch(`${API_BASE}/api/cards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ paymentMethodId, nickName }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to create card");
  }
  return res.json();
}

/**
 * PUT /api/cards/:id
 * Body: { nickName?: string, isActive?: boolean }
 */
export async function updateCard(id, updates) {
  const res = await fetch(`${API_BASE}/api/cards/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update card");
  return res.json();
}

/**
 * DELETE /api/cards/:id
 */
export async function deleteCard(id) {
  const res = await fetch(`${API_BASE}/api/cards/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to delete card");
}
