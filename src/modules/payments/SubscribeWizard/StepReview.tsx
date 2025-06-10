// src/modules/payments/SubscribeWizard/StepReview.tsx
import React, { useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { useStripeData } from '../../../@context/StripeContext';
import { useToast } from '@components/ui/ToastProvider';

export interface StepReviewProps {
  planId: string;
  onSuccess: () => void;
  onBack: () => void;
}

// 🔧 Stripe Price ID mapping (real IDs)
const PLAN_TO_PRICE: Record<string, string | null> = {
  basic: null,
  plus: 'price_1RGpe2GaZTzD8EjfQ1nZydXJ',
};

const StepReview: React.FC<StepReviewProps> = ({ planId, onSuccess, onBack }) => {
  const { addToast } = useToast();
  const stripe = useStripe();
  const { cards, subscribe } = useStripeData();
  const [loading, setLoading] = useState(false);

  const planName = planId === 'plus' ? 'Plus' : 'Basic';
  const priceLabel = planId === 'plus' ? '$25.00' : 'Free';

  // Select the first card
  const card = cards && cards.length > 0 ? cards[0] : null;
  const paymentMethodId = card?.paymentMethodId;
  const hasCard = Boolean(paymentMethodId);

  const handleConfirm = async () => {
    if (!stripe || !hasCard || !paymentMethodId) {
      addToast('Missing payment information. Please check your card details.', 'error');
      return;
    }

    setLoading(true);

    try {
      const priceId = PLAN_TO_PRICE[planId];

      // Short-circuit for free plans
      if (!priceId) {
        addToast('Free plan selected. No payment required.', 'success');
        onSuccess();
        return;
      }

      // 1. Create the subscription intent on your backend
      const { clientSecret, status } = await subscribe(priceId, paymentMethodId);

      // 2. If Stripe tells us further action is required, handle it
      if (status === 'requires_action' && clientSecret) {
        const result = await stripe.confirmPayment({ clientSecret });
        if (result.error) throw result.error;
      }

      // 3. All done!
      addToast('Subscription completed successfully!', 'success');
      onSuccess();
    } catch (err: any) {
      addToast(err.message || 'Subscription failed. Please try again.', 'error');
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
          {hasCard
            ? (
              <>
                **** {card.last4} ({card.network})
              </>
            )
            : (
              <em>No card found</em>
            )
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
          disabled={!hasCard || loading}
          className={`flex-1 py-2 bg-primary text-white rounded transition 
            ${(!hasCard || loading)
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-primary/90'}
          `}
        >
          {loading ? 'Processing…' : 'Confirm & Subscribe'}
        </button>
      </div>

      {!hasCard && (
        <p className="text-red-600 text-sm">
          Please add a payment card before subscribing.
        </p>
      )}
    </div>
  );
};

export default StepReview;
