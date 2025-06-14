// src/modules/payments/SubscribeWizard/StepPayment.tsx
import React, { useEffect, useState } from 'react';
import { PaymentMethodSelector } from '@/modules/payments/components/PaymentMethodSelector';
import { createSetupIntent } from '@/modules/payments/paymentsClient';
import StripeElements from '@/lib/stripeClient';
import { useToast } from '@components/ui/ToastProvider';

export interface StepPaymentProps {
  planId: string;
  onNext: () => void;
}

export const StepPayment: React.FC<StepPaymentProps> = ({ planId, onNext }) => {
  const { addToast } = useToast();
  const planName = planId === 'plus' ? 'Plus' : 'Basic';
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // If user chose the free plan, skip payment immediately
  useEffect(() => {
    if (planId === 'basic') {
      addToast({ message: 'Free plan selected. No payment required.', type: 'success' });
      onNext();
    }
  }, [planId, onNext, addToast]);

  // Only initialize Stripe for paid plan
  useEffect(() => {
    if (planId === 'plus') {
      const init = async () => {
        try {
          const secret = await createSetupIntent();
          setClientSecret(secret);
        } catch (err: any) {
          addToast({
            message:
              err instanceof Error
                ? err.message
                : 'Failed to initialize payment form.',
            type: 'error'
          });
        }
      };
      init();
    }
  }, [planId, addToast]);

  // While loading clientSecret for plus plan, show loader
  if (planId === 'plus' && !clientSecret) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded">
        <p className="text-gray-500 dark:text-gray-400">
          Loading payment form...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Enter payment for {planName} plan</h2>
      {planId === 'plus' && clientSecret && (
        <StripeElements options={{ clientSecret }}>
          <PaymentMethodSelector
            onSuccess={() => {
              addToast({ message: 'Payment method added successfully!', type: 'success' });
              onNext();
            }}
          />
        </StripeElements>
      )}
    </div>
  );
};
