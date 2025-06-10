// src/modules/payments/SubscribeWizard/StepPayment.tsx
import React, { useEffect, useState } from 'react';
import { PaymentMethodSelector } from '../@components/PaymentMethodSelector';
import { createSetupIntent } from '../paymentsClient';
import { StripeElements } from '../../lib/stripeClient';
import { useToast } from '@components/ui/ToastProvider';

export interface StepPaymentProps {
  planId: string;
  onNext: () => void;
}

export const StepPayment: React.FC<StepPaymentProps> = ({ planId, onNext }) => {
  const { addToast } = useToast();
  const planName = planId === 'plus' ? 'Plus' : 'Basic';
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const initializePaymentForm = async () => {
      try {
        const secret = await createSetupIntent();
        setClientSecret(secret);
      } catch (err) {
        addToast(
          err instanceof Error ? err.message : 'Failed to initialize payment form.',
          'error'
        );
      }
    };

    initializePaymentForm();
  }, [addToast]);

  if (!clientSecret) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded">
        <p className="text-gray-500 dark:text-gray-400">Loading payment form...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Enter payment for {planName} plan</h2>
      <StripeElements options={{ clientSecret }}>
        <PaymentMethodSelector
          onSuccess={() => {
            addToast(`Payment method added successfully!`, 'success');
            onNext();
          }}
        />
      </StripeElements>
    </div>
  );
};
