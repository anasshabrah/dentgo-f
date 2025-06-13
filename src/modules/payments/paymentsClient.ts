// src/modules/payments/paymentsClient.ts

import { API_BASE } from "@/config";
import { fetchCards as apiFetchCards, createCard as apiCreateCard } from "@/api/cards";
import axios from "axios";
import type { CardData } from "./types";
import type { ActiveSubscription } from "@/api/subscriptions";

// Pull in the two helper endpoints from your API layer:
import { createSetupIntent as apiCreateSetupIntent } from "@/api/payments";
import { createSubscriptionIntent as apiCreateSubscriptionIntent } from "@/api/subscriptions";

/**
 * Fetch and normalize saved cards.
 */
export async function fetchCards(): Promise<CardData[]> {
  const cards = await apiFetchCards();
  return cards.map((c) => ({
    id: c.id,
    paymentMethodId: c.paymentMethodId,
    last4: c.paymentMethodId.slice(-4),
    network: c.nickName || "unknown",
    isActive: true,
  }));
}

/**
 * Add a new payment method for the current user.
 */
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

/**
 * Fetch the user's active subscription (includes plan flag).
 */
export async function fetchActiveSubscription(): Promise<ActiveSubscription> {
  const resp = await axios.get<ActiveSubscription>(
    `${API_BASE}/api/subscriptions`,
    { withCredentials: true }
  );
  return resp.data;
}

/**
 * Initialize a Stripe SetupIntent (for adding a new card).
 */
export async function createSetupIntent(): Promise<string> {
  return apiCreateSetupIntent();
}

/**
 * Create or update a Stripe subscription.
 */
export async function createSubscription(
  priceId: string,
  paymentMethodId?: string | null
): Promise<{
  clientSecret: string;
  subscriptionId: string;
  status: string;
}> {
  return apiCreateSubscriptionIntent(priceId, paymentMethodId);
}
