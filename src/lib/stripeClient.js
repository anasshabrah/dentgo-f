import { jsx as _jsx } from "react/jsx-runtime";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentRequestButtonElement, useStripe, useElements, } from "@stripe/react-stripe-js";
import { STRIPE_PK } from "../config";
import { API_BASE } from "../config";
const stripePromise = loadStripe(STRIPE_PK);
export const StripeElements = ({ children, }) => _jsx(Elements, { stripe: stripePromise, children: children });
export async function createPaymentRequest(params) {
    const stripe = await stripePromise;
    if (!stripe)
        throw new Error("Stripe failed to load.");
    return stripe.paymentRequest(params);
}
export async function createSetupIntent() {
    const resp = await fetch(`${API_BASE}/api/payments/create-setup-intent`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });
    if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Failed to create SetupIntent.");
    }
    const { clientSecret } = (await resp.json());
    return clientSecret;
}
export async function createPaymentIntent(amount) {
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
    const { clientSecret } = (await resp.json());
    return clientSecret;
}
export async function createSubscriptionIntent(priceId, paymentMethodId) {
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
    return (await resp.json());
}
export { PaymentRequestButtonElement, stripePromise, useStripe, useElements };
