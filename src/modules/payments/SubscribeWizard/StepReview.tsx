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
  onAddCard: () => void;
}

const stripePromise = loadStripe(STRIPE_PK);

const PLAN_TO_PRICE: Record<string, string | null> = {
  basic: null,
  plus: 'price_1RGpe2GaZTzD8EjfQ1nZydXJ',
};

const InnerReview: React.FC<StepReviewProps> = ({
  planId,
  onSuccess,
  onBack,
  onAddCard,
}) => {
  const toast = useToast();
  const stripe = useStripe();
  const { cards, subscribe } = useStripeData();
  const [loading, setLoading] = useState(false);

  const isFree = planId === 'basic';
  const planName = isFree ? 'Basic' : 'Plus';
  const priceLabel = isFree ? 'Free' : '$25.00';
  const priceId = PLAN_TO_PRICE[planId];

  const card = cards && cards.length > 0 ? cards[0] : null;
  const paymentMethodId = card?.paymentMethodId;

  const handleConfirm = async () => {
    if (isFree) {
      toast.addToast('Free plan selected. No payment required.', 'success');
      onSuccess();
      return;
    }

    if (!stripe) {
      toast.addToast('Stripe not loaded yet, please try again.', 'error');
      return;
    }

    if (!paymentMethodId) {
      toast.addToast('Let’s add your first card!', 'info');
      onAddCard();
      return;
    }

    setLoading(true);
    try {
      const { clientSecret, status } = await subscribe(priceId!, paymentMethodId);
      if (status === 'requires_action' && clientSecret) {
        const result = await stripe.confirmPayment({
          clientSecret,
          confirmParams: { return_url: window.location.href },
        });
        if (result.error) throw result.error;
      }
      toast.addToast('Subscription successful!', 'success');
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
  return (
    <Elements stripe={stripePromise}>
      <InnerReview {...props} />
    </Elements>
  );
}
