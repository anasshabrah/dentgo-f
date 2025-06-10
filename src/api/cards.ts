// src/api/cards.ts

import { API_BASE } from '../config';
import type { CardData } from '../modules/payments/types';

/**
 * Fetch saved cards for the current user
 */
export async function fetchCards(): Promise<CardData[]> {
  const res = await fetch(`${API_BASE}/api/cards`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({} as any));
    throw new Error(err.error || 'Failed to fetch cards');
  }
  return (await res.json()) as CardData[];
}

/**
 * Add a new card (via SetupIntent) for the current user
 */
export async function createCard(args: {
  paymentMethodId: string;
  nickName: string | null;
}): Promise<void> {
  const res = await fetch(`${API_BASE}/api/cards`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({} as any));
    throw new Error(err.error || 'Failed to create card');
  }
}
