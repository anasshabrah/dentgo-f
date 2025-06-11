// src/api/payments.ts

import { API_BASE } from '@/config';

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
 * Create (or retrieve) a Stripe Customer for the current user
 */
export async function createCustomer(): Promise<string> {
  const res = await fetch(`${API_BASE}/api/payments/create-customer`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    await handleErrorResponse(res, 'Failed to create customer');
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
    await handleErrorResponse(res, 'Failed to create setup intent');
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
    await handleErrorResponse(res, 'Failed to create payment intent');
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
    await handleErrorResponse(res, 'Failed to create subscription intent');
  }

  return res.json();
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
    await handleErrorResponse(res, 'Failed to create portal session');
  }

  return res.json();
}
