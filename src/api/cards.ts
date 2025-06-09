// src/api/cards.ts
import { API_BASE } from "../config";

export interface CardData {
  id: number;
  network: string | null;
  last4: string;
  isActive: boolean;
}

/**
 * Utility: Parses error responses consistently.
 */
async function handleErrorResponse(res: Response, defaultMessage: string): Promise<never> {
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
 * Fetches saved cards for the current user.
 */
export async function fetchCards(): Promise<CardData[]> {
  const res = await fetch(`${API_BASE}/api/cards`, {
    credentials: "include",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch cards");
  }
  const data = (await res.json()) as { cards: CardData[] };
  return data.cards;
}

/**
 * Creates a new saved card for the current user.
 */
export async function createCard(payload: {
  paymentMethodId: string;
  nickName: string | null;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/api/cards`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to create card");
  }
}
