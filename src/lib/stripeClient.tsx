// src/lib/stripeClient.tsx
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { STRIPE_PK } from '@/config';

const stripePromise = loadStripe(STRIPE_PK);

interface StripeElementsProps {
  /** Stripe Elements options (must include clientSecret, appearance, etc.) */
  options: StripeElementsOptions;
  children: React.ReactNode;
}

const StripeElements: React.FC<StripeElementsProps> = ({ options, children }) => {
  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeElements;
