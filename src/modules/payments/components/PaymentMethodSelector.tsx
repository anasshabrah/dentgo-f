// src/modules/payments/components/PaymentMethodSelector.tsx
import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useStripeData } from '../../../context/StripeContext';
import { LockClosedIcon } from '@heroicons/react/24/solid';
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
      const result = await stripe.confirmSetup({
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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded"
    >
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-1">
          Card Nickname (optional)
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          placeholder="e.g. My Visa"
        />
      </div>

      <div className="p-2 border rounded bg-gray-50 dark:bg-gray-700">
        <PaymentElement />
      </div>

      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 gap-1">
        <LockClosedIcon className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        <span>Card details handled by Stripe. We never see your number.</span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-primary text-white rounded hover:bg-primary/90 transition disabled:opacity-50"
      >
        {loading ? 'Adding…' : 'Add Card'}
      </button>
    </form>
  );
};
