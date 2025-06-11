// src/modules/payments/paymentsClient.ts

import { API_BASE } from '@/config';
import { fetchCards as apiFetchCards, createCard as apiCreateCard } from '@/api/cards';
import type { CardData } from './types';
import axios from 'axios';

// Cards
export async function fetchCards(): Promise<CardData[]> {
  const cards = await apiFetchCards();
  return cards.map(c => ({
    id: c.id,
    paymentMethodId: c.paymentMethodId,
    last4: c.paymentMethodId.slice(-4),
    network: 'unknown',
    isActive: true,
  }));
}

export async function addCard(args: {
  paymentMethodId: string;
  nickName: string | null;
}): Promise<void> {
  const payload: {
    paymentMethodId: string;
    nickName?: string;
  } = {
    paymentMethodId: args.paymentMethodId,
    ...(args.nickName != null ? { nickName: args.nickName } : {}),
  };
  await apiCreateCard(payload);
}

// Stripe Customer & Intents

export async function createCustomer(): Promise<string> {
  const resp = await axios.post(
    `${API_BASE}/api/payments/create-customer`,
    {},
    {
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    }
  );
  return resp.data.customerId;
}

export async function createSetupIntent(): Promise<string> {
  const resp = await fetch(`${API_BASE}/api/payments/create-setup-intent`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create SetupIntent.');
  }
  const { clientSecret } = (await resp.json()) as { clientSecret: string };
  return clientSecret;
}

/**
 * Create a one-off PaymentIntent for the given amount (in cents)
 * → now includes currency
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd'
): Promise<string> {
  const resp = await fetch(`${API_BASE}/api/payments/create-payment-intent`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, currency }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create PaymentIntent.');
  }
  const { clientSecret } = (await resp.json()) as { clientSecret: string };
  return clientSecret;
}

/**
 * Create a Stripe subscription and return its clientSecret, subscriptionId, and status.
 * → now supports optional paymentMethodId for FREE plans
 */
export async function createSubscriptionIntent(
  priceId: string,
  paymentMethodId?: string | null
): Promise<{ clientSecret: string; subscriptionId: string; status: string }> {
  const resp = await fetch(`${API_BASE}/api/payments/create-subscription`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      priceId,
      ...(paymentMethodId ? { paymentMethodId } : {}), // omit for FREE
    }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create subscription intent.');
  }
  return resp.json() as Promise<{
    clientSecret: string;
    subscriptionId: string;
    status: string;
  }>;
}

export async function fetchActiveSubscription(): Promise<{
  subscriptionId: string;
  status: string;
  currentPeriodEnd: number;
}> {
  const resp = await axios.get(`${API_BASE}/api/subscriptions`, {
    withCredentials: true,
  });
  return resp.data;
}

export async function createPortalSession(
  args?: { return_url: string }
): Promise<{ url: string }> {
  const body = args ? JSON.stringify({ return_url: args.return_url }) : undefined;
  const resp = await fetch(`${API_BASE}/api/payments/create-portal-session`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create portal session.');
  }
  return resp.json() as Promise<{ url: string }>;
}
