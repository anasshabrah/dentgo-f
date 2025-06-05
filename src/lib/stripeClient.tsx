import { loadStripe, PaymentRequest } from "@stripe/stripe-js";
import {
  Elements,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { STRIPE_PK } from "../config";

import { API_BASE } from "../config";

const stripePromise = loadStripe(STRIPE_PK);

export const StripeElements: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <Elements stripe={stripePromise}>{children}</Elements>;

export async function createPaymentRequest(params: {
  country: string;
  currency: string;
  total: { label: string; amount: number };
  requestPayerEmail?: boolean;
  requestPayerName?: boolean;
}): Promise<PaymentRequest> {
  const stripe = await stripePromise;
  if (!stripe) throw new Error("Stripe failed to load.");
  return stripe.paymentRequest(params);
}

export async function createSetupIntent(): Promise<string> {
  const resp = await fetch(`${API_BASE}/api/payments/create-setup-intent`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create SetupIntent.");
  }
  const { clientSecret } = (await resp.json()) as { clientSecret: string };
  return clientSecret;
}

export async function createPaymentIntent(amount: number): Promise<string> {
  const resp = await fetch(`${API_BASE}/api/payments/create-payment-intent`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create PaymentIntent.");
  }
  const { clientSecret } = (await resp.json()) as { clientSecret: string };
  return clientSecret;
}

export async function createSubscriptionIntent(
  priceId: string,
  paymentMethodId: string
): Promise<{ clientSecret: string; subscriptionId: string; status: string }> {
  const resp = await fetch(`${API_BASE}/api/payments/create-subscription`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId, paymentMethodId }),
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({}));
    throw new Error(err.error || "Failed to create subscription.");
  }
  return (await resp.json()) as {
    clientSecret: string;
    subscriptionId: string;
    status: string;
  };
}

export { PaymentRequestButtonElement, stripePromise, useStripe, useElements };
