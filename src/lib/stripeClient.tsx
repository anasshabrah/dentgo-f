// src/lib/stripeClient.tsx
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, ElementsProps } from '@stripe/react-stripe-js';
import { STRIPE_PK } from '../config';

const stripePromise = loadStripe(STRIPE_PK);

interface StripeElementsProps extends ElementsProps {
  /** shortcut for dark/light theme */
  theme?: 'stripe' | 'night' | 'flat';
}

export const StripeElements: React.FC<StripeElementsProps> = ({
  children,
  theme,
  appearance,
  ...opts
}) => {
  // merge any passed appearance with theme override
  const mergedAppearance = {
    ...(appearance ?? {}),
    theme: theme ?? (appearance?.theme ?? 'stripe'),
  };

  return (
    <Elements stripe={stripePromise} {...opts} appearance={mergedAppearance}>
      {children}
    </Elements>
  );
};

export default StripeElements;
