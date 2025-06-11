// src/api/payments.ts

import { API_BASE } from '@/config';

/**
 * Create (or retrieve) a Stripe Customer for the current user
 */
export async function createCustomer(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/payments/create-customer`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({} as any));
    throw new Error(err.error || 'Failed to create customer');
  }
  const { customerId } = (await res.json()) as { customerId: string };
  return customerId;
}

/**
 * Create a SetupIntent, returning its clientSecret
 */
export async function createSetupIntent(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/payments/create-setup-intent`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({} as any));
    throw new Error(err.error || 'Failed to create setup intent');
  }
  const { clientSecret } = (await res.json()) as { clientSecret: string };
  return clientSecret;
}

/**
 * Create a one-off PaymentIntent for the given amount (in cents)
 */
export async function createPaymentIntent(amount: number): Promise<string> {
  const res = await fetch(`${API_BASE}/api/payments/create-payment-intent`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({} as any));
    throw new Error(err.error || 'Failed to create payment intent');
  }
  const { clientSecret } = (await res.json()) as { clientSecret: string };
  return clientSecret;
}

/**
 * Create a Stripe subscription and return its clientSecret, subscriptionId & status
 */
export async function createSubscriptionIntent(
  priceId: string,
  paymentMethodId: string
): Promise<{
  clientSecret: string;
  subscriptionId: string;
  status: string;
}> {
  const res = await fetch(`${API_BASE}/api/subscriptions`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, paymentMethodId }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({} as any));
    throw new Error(err.error || 'Failed to create subscription intent');
  }
  return (await res.json()) as {
    clientSecret: string;
    subscriptionId: string;
    status: string;
  };
}

/**
 * Create a Stripe Customer Portal session and return its URL
 */
export async function createPortalSession(): Promise<{ url: string }> {
  const res = await fetch(`${API_BASE}/api/payments/create-portal-session`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({} as any));
    throw new Error(err.error || 'Failed to create portal session');
  }
  return (await res.json()) as { url: string };
}
