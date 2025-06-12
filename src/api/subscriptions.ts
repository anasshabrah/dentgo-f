// src/api/subscriptions.ts
import { API_BASE } from "@/config";

export type PlanType = "FREE" | "PLUS";

export interface ActiveSubscription {
  subscriptionId: string | null;
  status: string;
  currentPeriodEnd: number | null;
  plan: PlanType;
}

export interface SubscriptionResponse {
  clientSecret: string;
  subscriptionId: string;
  status: string;
}

/**
 * Parses error responses consistently.
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
 * Fetches the active subscription for the current user.
 * If stripeSubscriptionId is null, we treat it as FREE.
 */
export async function fetchActiveSubscription(): Promise<ActiveSubscription | null> {
  const res = await fetch(`${API_BASE}/api/subscriptions`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch active subscription");
  }

  const data = (await res.json()) as {
    subscriptionId: string | null;
    status: string;
    currentPeriodEnd: number | null;
    plan?: string;
  };

  const plan: PlanType =
    data.plan === "PLUS"
      ? "PLUS"
      : data.subscriptionId
      ? "PLUS"
      : "FREE";

  return {
    subscriptionId: data.subscriptionId,
    status: data.status,
    currentPeriodEnd: data.currentPeriodEnd,
    plan,
  };
}

/**
 * Creates a new Stripe subscription (or activates FREE plan).
 */
export async function createSubscriptionIntent(
  priceId: string,
  paymentMethodId?: string | null
): Promise<SubscriptionResponse> {
  const res = await fetch(`${API_BASE}/api/payments/create-subscription`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      priceId,
      ...(paymentMethodId ? { paymentMethodId } : {}),
    }),
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to create subscription intent");
  }
  return res.json();
}
