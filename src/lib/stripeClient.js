// src\lib\stripeClient.js
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentRequestButtonElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

export const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
);

export const StripeElements = ({ children }) => (
  <Elements stripe={stripePromise}>{children}</Elements>
);

export const ElementsWrapper = StripeElements;

export async function createPaymentRequest(options) {
  const stripe = await stripePromise;
  return stripe.paymentRequest(options);
}

export {
  PaymentRequestButtonElement,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
};
