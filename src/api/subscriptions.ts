// src/api/subscriptions.ts

import { API_BASE } from '@/config';

/**
 * Create a subscription intent.  Returns clientSecret, subscriptionId & status.
 */
export async function createSubscription(
  priceId: string,
  paymentMethodId: string
): Promise<{ clientSecret: string; subscriptionId: string; status: string }> {
  const res = await fetch(`${API_BASE}/api/payments/create-subscription`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, paymentMethodId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({} as any));
    throw new Error(err.error || 'Failed to create subscription');
  }
  return (await res.json()) as {
    clientSecret: string;
    subscriptionId: string;
    status: string;
  };
}

/**
 * Fetch the active subscription for the current user
 */
export async function fetchActiveSubscription(): Promise<{
  subscriptionId: string;
  status: string;
  currentPeriodEnd: number;
}> {
  const res = await fetch(`${API_BASE}/api/subscriptions`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({} as any));
    throw new Error(err.error || 'Failed to fetch subscription');
  }
  return (await res.json()) as {
    subscriptionId: string;
    status: string;
    currentPeriodEnd: number;
  };
}
