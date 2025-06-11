// src/api/subscriptions.ts

import { API_BASE } from "@/config";

export interface Subscription {
  id: number;
  userId: string;
  subscriptionId: string;
  status: string;
  currentPeriodEnd: number;
}

export interface SubscriptionResponse {
  clientSecret: string;
  subscriptionId: string;
  status: string;
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
 * Fetches the active subscription for the current user
 */
export async function fetchActiveSubscription(): Promise<Subscription | null> {
  const res = await fetch(`${API_BASE}/api/subscriptions`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch active subscription");
  }

  return res.json();
}

/**
 * Creates a new subscription using a Stripe price and payment method ID
 */
export async function createSubscriptionIntent(
  priceId: string,
  paymentMethodId: string
): Promise<SubscriptionResponse> {
  const res = await fetch(`${API_BASE}/api/subscriptions`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ priceId, paymentMethodId }),
  });

  if (!res.ok) {
    await handleErrorResponse(res, "Failed to create subscription intent");
  }

  return res.json();
}
