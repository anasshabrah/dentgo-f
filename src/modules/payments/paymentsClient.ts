// src/modules/payments/paymentsClient.ts
import { API_BASE } from '@/config';
import { fetchCards as apiFetchCards, createCard as apiCreateCard } from '@/api/cards';
import type { CardData } from './types';
import axios from 'axios';

// Cards
export async function fetchCards(): Promise<CardData[]> {
  return apiFetchCards();
}

export async function addCard(payload: {
  paymentMethodId: string;
  nickName: string | null;
}): Promise<void> {
  return apiCreateCard(payload);
}

// Stripe Customer & Intents
export async function createCustomer(): Promise<string> {
  const resp = await axios.post(
    `${API_BASE}/api/payments/create-customer`,
    {},
    { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
  );
  return resp.data.customerId;
}

export async function createSetupIntent(): Promise<string> {
  const resp = await fetch(
    `${API_BASE}/api/payments/create-setup-intent`,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create SetupIntent.');
  }
  const { clientSecret } = (await resp.json()) as { clientSecret: string };
  return clientSecret;
}

export async function createPaymentIntent(amount: number): Promise<string> {
  const resp = await fetch(
    `${API_BASE}/api/payments/create-payment-intent`,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    }
  );
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create PaymentIntent.');
  }
  const { clientSecret } = (await resp.json()) as { clientSecret: string };
  return clientSecret;
}

export async function createSubscriptionIntent(
  priceId: string,
  paymentMethodId: string
): Promise<{ clientSecret: string; subscriptionId: string; status: string }> {
  const resp = await fetch(
    `${API_BASE}/api/payments/create-subscription`,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, paymentMethodId }),
    }
  );
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create subscription intent.');
  }
  return (await resp.json()) as { clientSecret: string; subscriptionId: string; status: string };
}

// Active Subscription
export async function fetchActiveSubscription(): Promise<{
  subscriptionId: string;
  status: string;
  currentPeriodEnd: number;
}> {
  const resp = await axios.get(
    `${API_BASE}/api/subscriptions`,
    { withCredentials: true }
  );
  return resp.data;
}

// Customer Portal Session
export async function createPortalSession(
  args?: { return_url: string }
): Promise<{ url: string }> {
  // If return_url provided, include in request body
  const body = args ? JSON.stringify({ return_url: args.return_url }) : undefined;

  const resp = await fetch(
    `${API_BASE}/api/payments/create-portal-session`,
    {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body,
    }
  );
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create portal session.');
  }
  return (await resp.json()) as { url: string };
}
