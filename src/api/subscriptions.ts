// File: src/api/subscriptions.ts
import { API_BASE } from "@/config";

export interface ActiveSubscription {
  subscriptionId: string | null;
  status: string;
  currentPeriodEnd: number | null;
  plan: 'FREE' | 'PLUS';
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
 * Returns plan 'FREE' if stripeSubscriptionId is null
 */
export async function fetchActiveSubscription(): Promise<ActiveSubscription | null> {
  const res = await fetch(`${API_BASE}/api/subscriptions`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    await handleErrorResponse(res, "Failed to fetch active subscription");
  }

  const data = await res.json() as {
    subscriptionId: string | null;
    status: string;
    currentPeriodEnd: number | null;
    plan?: string;
  };

  // Derive plan if not explicitly provided
  const plan = data.plan === 'PLUS'
    ? 'PLUS'
    : data.subscriptionId
      ? 'PLUS'
      : 'FREE';

  return {
    subscriptionId: data.subscriptionId,
    status: data.status,
    currentPeriodEnd: data.currentPeriodEnd,
    plan,
  };
}
