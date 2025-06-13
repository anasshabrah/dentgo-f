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

const appearance: StripeElementsOptions['appearance'] = {
  theme: 'stripe',
  variables: {
    fontSizeBase: '16px',
    fontFamily: 'Readex Pro, system-ui, sans-serif',
  },
  rules: {
    // top-level selector → must be an object of camelCase props
    '.Input': {
      paddingLeft: '0',
      paddingRight: '0',
    },
    // media-query key → nested selectors must be declaration strings
    '@media only screen and (max-width: 600px)': {
      '.Input':
        'font-size: 1rem; line-height: 1.4; padding-left: 0; padding-right: 0;',
      '.Label':
        'font-size: 0.875rem;',
    },
  },
};

interface StripeElementsProps {
  options: StripeElementsOptions;
  children: React.ReactNode;
}

const StripeElements: React.FC<StripeElementsProps> = ({ options, children }) => {
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
