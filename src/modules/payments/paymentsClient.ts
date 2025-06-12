// src/modules/payments/paymentsClient.ts
import { API_BASE } from "@/config";
import { fetchCards as apiFetchCards, createCard as apiCreateCard } from "@/api/cards";
import type { CardData } from "./types";
import axios from "axios";
import type { ActiveSubscription } from "@/api/subscriptions";

// Cards
export async function fetchCards(): Promise<CardData[]> {
  const cards = await apiFetchCards();
  return cards.map((c) => ({
    id: c.id,
    paymentMethodId: c.paymentMethodId,
    last4: c.paymentMethodId.slice(-4),
    network: "unknown",
    isActive: true,
  }));
}

export async function addCard(args: {
  paymentMethodId: string;
  nickName: string | null;
}): Promise<void> {
  const payload: { paymentMethodId: string; nickName?: string } = {
    paymentMethodId: args.paymentMethodId,
    ...(args.nickName != null ? { nickName: args.nickName } : {}),
  };
  await apiCreateCard(payload);
}

// Fetch the subscription with plan flag
export async function fetchActiveSubscription(): Promise<ActiveSubscription> {
  const resp = await axios.get<ActiveSubscription>(
    `${API_BASE}/api/subscriptions`,
    { withCredentials: true }
  );
  return resp.data;
}

// Stripe portal
export async function createPortalSession(
  args?: { return_url: string }
): Promise<{ url: string }> {
  const body = args ? JSON.stringify(args) : undefined;
  const resp = await fetch(`${API_BASE}/api/payments/create-portal-session`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body,
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create portal session.");
  }
  return resp.json();
}
