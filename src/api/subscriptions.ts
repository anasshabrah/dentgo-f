// src/api/subscriptions.ts
import { API_BASE } from "@/config";

export type PlanType = "FREE" | "PLUS";

export interface ActiveSubscription {
  subscriptionId: string | null;
  status: string;
  currentPeriodEnd: number | null;
  plan: PlanType;
  cancelAt: number | null;
}

export interface SubscriptionResponse {
  clientSecret: string | null;
  subscriptionId: string | null;
  status: string;
  plan: PlanType;
  currentPeriodEnd: number | null;
  cancelAt?: number | null;
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
  } catch {}
  throw new Error(errorMsg);
}

/**
 * Fetches the active subscription for the current user.
 * If no paid subscription exists, returns the FREE plan explicitly.
 */
export async function fetchActiveSubscription(): Promise<ActiveSubscription> {
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
    cancelAt?: number | null;
  };

  const plan: PlanType = data.plan === "PLUS" ? "PLUS" : "FREE";

  return {
    subscriptionId: data.subscriptionId,
    status: data.status,
    currentPeriodEnd: data.currentPeriodEnd,
    plan,
    cancelAt: data.cancelAt ?? null,
  };
}

/**
 * Creates a new Stripe subscription (or activates FREE plan).
 */
export async function createSubscriptionIntent(
  // pass in either "FREE" or your Stripe priceId
  priceOrPlan: string,
  paymentMethodId?: string | null
): Promise<SubscriptionResponse> {
  // Determine plan vs price
  const isFree = priceOrPlan === "FREE";
  const plan: PlanType = isFree ? "FREE" : "PLUS";

  // Build the exact payload the backend expects
  const bodyPayload: Record<string, unknown> = { plan };
  if (!isFree) {
    bodyPayload.priceId = priceOrPlan;
    bodyPayload.paymentMethodId = paymentMethodId;
  }

  const res = await fetch(`${API_BASE}/api/payments/create-subscription`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyPayload),
  });
  if (!res.ok) {
    await handleErrorResponse(res, "Failed to create subscription intent");
  }
  return res.json() as Promise<SubscriptionResponse>;
}
