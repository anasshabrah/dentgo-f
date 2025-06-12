// src/modules/payments/SubscribeWizard/index.tsx

import React, { useState } from 'react';
import { useStripeData } from '@/context/StripeContext';
import { StepChoosePlan } from './StepChoosePlan';
import { StepPayment } from './StepPayment';
import StepReview from './StepReview';
import StepSuccess from './StepSuccess';

const steps = ['choose', 'payment', 'review', 'success'] as const;
type Step = typeof steps[number];

const SubscribeWizard: React.FC = () => {
  const [current, setCurrent] = useState<Step>('choose');
  const [planId, setPlanId] = useState<string>('plus');
  const { cards } = useStripeData();

  return (
    <div className="max-w-md mx-auto my-8 bg-white dark:bg-gray-800 rounded shadow">
      {current === 'choose' && (
        <StepChoosePlan
          onNext={p => {
            setPlanId(p);
            // If Basic or Plus with existing cards, skip payment and go to review
            if (p === 'basic' || (p === 'plus' && cards && cards.length > 0)) {
              setCurrent('review');
            } else {
              setCurrent('payment');
            }
          }}
        />
      )}

      {current === 'payment' && (
        <StepPayment
          planId={planId}
          onNext={() => setCurrent('review')}
        />
      )}

      {current === 'review' && (
        <StepReview
          planId={planId}
          onBack={() => setCurrent(planId === 'basic' ? 'choose' : 'payment')}
          onSuccess={() => setCurrent('success')}
          // when no card exists, take them back to the payment step
          onAddCard={() => setCurrent('payment')}
        />
      )}

      {current === 'success' && (
        <StepSuccess planId={planId} />
      )}
    </div>
  );
};

export default SubscribeWizard;
