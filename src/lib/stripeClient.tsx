// src/lib/stripeClient.tsx
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { STRIPE_PK } from '@/config';

if (!STRIPE_PK) {
  throw new Error('Missing VITE_STRIPE_PUBLISHABLE_KEY env-var. Stripe will not work.');
}

const stripePromise = loadStripe(STRIPE_PK);

// Define a consistent, responsive appearance for all Stripe Elements
const appearance = {
  theme: 'stripe',
  variables: {
    // Base font size for desktop
    fontSizeBase: '16px',
    // Use the app’s primary font
    fontFamily: 'Readex Pro, system-ui, sans-serif',
  },
  rules: {
    // Mobile breakpoint: adjust label and input sizes on small screens
    '@media only screen and (max-width: 600px)': {
      '.Input': {
        fontSize: '1rem',
        lineHeight: '1.4',
      },
      '.Label': {
        fontSize: '0.875rem',
      },
    },
  },
};

interface StripeElementsProps {
  /** Stripe Elements options (must include clientSecret, etc.) */
  options: StripeElementsOptions;
  children: React.ReactNode;
}

const StripeElements: React.FC<StripeElementsProps> = ({ options, children }) => {
  // Merge in our appearance settings
  const mergedOptions: StripeElementsOptions = {
    ...options,
    appearance,
  };

  return (
    <Elements stripe={stripePromise} options={mergedOptions}>
      {children}
    </Elements>
  );
};

export default StripeElements;
