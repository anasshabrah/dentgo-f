// src/modules/payments/components/PaymentMethodSelector.tsx
import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import type { SetupIntentResult } from '@stripe/stripe-js';
import { useStripeData } from '@/context/StripeContext';
import { useToast } from '@components/ui/ToastProvider';

interface PaymentMethodSelectorProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onSuccess,
  onError,
}) => {
  const { addToast } = useToast();
  const stripe = useStripe();
  const elements = useElements();
  const { addCard } = useStripeData();
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) {
      const error = new Error('Payment form not ready. Please try again.');
      addToast(error.message, 'error');
      onError?.(error);
      return;
    }

    setLoading(true);
    try {
      // Use the correct SetupIntentResult type
      const result: SetupIntentResult = await stripe.confirmSetup({
        elements,
        confirmParams: { return_url: window.location.href },
      });

      if (result.error) throw result.error;

      const pm = result.setupIntent?.payment_method as string;
      await addCard(pm, nickname || null);

      setNickname('');
      addToast('Card added successfully!', 'success');
      onSuccess?.();
    } catch (err: any) {
      const error = new Error(err?.message || 'Failed to add card. Please try again.');
      addToast(error.message, 'error');
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded">
      <PaymentElement />
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Card nickname (optional)"
        className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 transition"
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded text-white ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-primary hover:bg-primary/90 transition'
        }`}
      >
        {loading ? 'Saving…' : 'Add Card'}
      </button>
    </form>
  );
};
