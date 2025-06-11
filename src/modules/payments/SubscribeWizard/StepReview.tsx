// src/modules/payments/SubscribeWizard/StepReview.tsx

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import { useStripeData } from '@/context/StripeContext';
import { useToast } from '@components/ui/ToastProvider';
import { STRIPE_PK } from '@/config';

export interface StepReviewProps {
  planId: string;
  onSuccess: () => void;
  onBack: () => void;
}

const PLAN_TO_PRICE: Record<string, string | null> = {
  basic: null,
  plus: 'price_1RGpe2GaZTzD8EjfQ1nZydXJ',
};

const InnerReview: React.FC<StepReviewProps> = ({ planId, onSuccess, onBack }) => {
  const toast = useToast();
  const stripe = useStripe();
  const { cards, subscribe } = useStripeData();
  const [loading, setLoading] = useState(false);

  const planName = planId === 'plus' ? 'Plus' : 'Basic';
  const priceLabel = planId === 'plus' ? '$25.00' : 'Free';
  const priceId = PLAN_TO_PRICE[planId];

  const card = cards && cards.length > 0 ? cards[0] : null;
  const paymentMethodId = card?.paymentMethodId;

  const handleConfirm = async () => {
    if (!priceId) {
      toast.addToast('Free plan selected. No payment required.', 'success');
      onSuccess();
      return;
    }

    if (!stripe) {
      toast.addToast('Stripe has not loaded yet. Please try again.', 'error');
      return;
    }
    if (!paymentMethodId) {
      toast.addToast('Please add a payment card before subscribing.', 'error');
      return;
    }

    setLoading(true);
    try {
      const { clientSecret, status } = await subscribe(priceId, paymentMethodId);

      if (status === 'requires_action' && clientSecret) {
        const result = await stripe.confirmPayment({
          clientSecret,
          confirmParams: { return_url: window.location.href },
        });
        if (result.error) throw result.error;
      }

      toast.addToast('Subscription completed successfully!', 'success');
      onSuccess();
    } catch (err: any) {
      toast.addToast(err.message || 'Subscription failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-semibold">Review your subscription</h2>

      <div className="space-y-2">
        <div>
          <span className="font-medium">Plan:</span> {planName}
        </div>
        <div>
          <span className="font-medium">Price:</span> {priceLabel}/month
        </div>
        <div>
          <span className="font-medium">Payment Method:</span><br />
          {card
            ? <>**** {card.last4} ({card.network})</>
            : <em>No card found</em>
          }
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2 border rounded hover:bg-gray-100 transition"
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`flex-1 py-2 bg-primary text-white rounded transition ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
          }`}
        >
          {loading ? 'Processing…' : 'Confirm & Subscribe'}
        </button>
      </div>
    </div>
  );
};

export default function StepReview(props: StepReviewProps) {
  const stripePromise = loadStripe(STRIPE_PK);

  return (
    <Elements stripe={stripePromise}>
      <InnerReview {...props} />
    </Elements>
  );
}
