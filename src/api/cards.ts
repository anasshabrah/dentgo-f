// src/api/cards.ts

import { API_BASE } from "@/config";

export interface Card {
  id: string;
  userId: string;
  paymentMethodId: string;
  nickName: string | null;
  createdAt: string;
  updatedAt: string;
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
 * Fetches all cards for the current user
 */
export async function fetchCards(): Promise<Card[]> {
  const res = await fetch(`${API_BASE}/api/cards`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch cards");
  }

  return res.json();
}

/**
 * Creates a new card for the current user
 */
export async function createCard(input: {
  paymentMethodId: string;
  nickName?: string;
}): Promise<Card> {
  const res = await fetch(`${API_BASE}/api/cards`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    await handleErrorResponse(res, "Failed to create card");
  }

  return res.json();
}
