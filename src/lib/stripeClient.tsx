import { loadStripe, PaymentRequest } from "@stripe/stripe-js";
import {
  Elements,
  PaymentRequestButtonElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { STRIPE_PK } from "../config";

const stripePromise = loadStripe(STRIPE_PK);

/**
 * Wrap your payment‐related subtrees in <Elements> once at the top level.
 */
export const StripeElements: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Elements stripe={stripePromise}>{children}</Elements>
);

/**
 * Creates a PaymentRequest object to feed into <PaymentRequestButtonElement>.
 */
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

/**
 * Call backend to create a SetupIntent and return its clientSecret.
 */
export async function createSetupIntent(): Promise<string> {
  const resp = await fetch(`/api/payments/create-setup-intent`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.error || "Failed to create SetupIntent.");
  }
  const { clientSecret } = (await resp.json()) as { clientSecret: string };
  return clientSecret;
}

/**
 * Call backend to create a PaymentIntent (one-time charge) and return its clientSecret.
 */
export async function createPaymentIntent(amount: number): Promise<string> {
  const resp = await fetch(`/api/payments/create-payment-intent`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });
  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.error || "Failed to create PaymentIntent.");
  }
  const { clientSecret } = (await resp.json()) as { clientSecret: string };
  return clientSecret;
}

/**
 * Call backend to create a Subscription and return its clientSecret.
 * Expects { priceId, paymentMethodId } in body.
 */
export async function createSubscriptionIntent(
  priceId: string,
  paymentMethodId: string
): Promise<{ clientSecret: string; subscriptionId: string; status: string }> {
  const resp = await fetch(`/api/payments/create-subscription`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ priceId, paymentMethodId }),
  });
  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(err.error || "Failed to create subscription.");
  }
  return (await resp.json()) as {
    clientSecret: string;
    subscriptionId: string;
    status: string;
  };
}

export { PaymentRequestButtonElement, stripePromise, useStripe, useElements };
