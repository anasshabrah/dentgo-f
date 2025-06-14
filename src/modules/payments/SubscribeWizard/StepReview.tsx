// File: src/modules/payments/SubscribeWizard/StepReview.tsx

import React, { useState } from 'react';
import { Elements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useStripeData } from '@/context/StripeContext';
import { useToast } from '@components/ui/ToastProvider';
import { STRIPE_PRICE_ID } from '@/config';

export interface StepReviewProps {
  planId: string;
  onSuccess: () => void;
  onBack: () => void;
  onAddCard: () => void;
}

const stripePromise = loadStripe(STRIPE_PRICE_ID);

// Map plan IDs to price IDs (Basic has no price, Plus uses your test-mode price)
const PLAN_TO_PRICE: Record<string, string | null> = {
  basic: null,
  plus: STRIPE_PRICE_ID,
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
      setLoading(true);
      try {
        await subscribe('FREE');
        toast.addToast({ message: 'Basic plan activated!', type: 'success' });
        onSuccess();
      } catch (err: any) {
        toast.addToast({ message: err?.message || 'Activation failed.', type: 'error' });
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!stripe) {
      toast.addToast({ message: 'Stripe not loaded yet, please try again.', type: 'error' });
      return;
    }

    if (!paymentMethodId) {
      toast.addToast({ message: 'Let’s add your first card!', type: 'info' });
      onAddCard();
      return;
    }

    setLoading(true);
    try {
      // pass the correct priceId now
      const { clientSecret, status } = await subscribe(priceId!, paymentMethodId);
      if (status === 'requires_action' && clientSecret) {
        const result = await stripe.confirmPayment({
          clientSecret,
          confirmParams: { return_url: window.location.href },
        });
        if (result.error) throw result.error;
      }
      toast.addToast({ message: 'Subscription successful!', type: 'success' });
      onSuccess();
    } catch (err: any) {
      toast.addToast({ message: err.message || 'Subscription failed. Please try again.', type: 'error' });
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
          className="flex-1 py-2 border rounded hover:bg-gray-100 transition active:scale-95 duration-150"
        >
          Back
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={`flex-1 py-2 bg-primary text-white rounded transition active:scale-95 duration-150 ${
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
