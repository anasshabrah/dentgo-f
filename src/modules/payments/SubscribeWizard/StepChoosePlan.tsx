// src/modules/payments/SubscribeWizard/StepChoosePlan.tsx

import React from 'react';
import { FREE_MESSAGES_PER_DAY } from '@/config';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    description: `Free, ${FREE_MESSAGES_PER_DAY} message${
      FREE_MESSAGES_PER_DAY > 1 ? 's' : ''
    }/day`,
  },
  { id: 'plus', name: 'Plus', price: 2500, description: '$25/month, unlimited' },
];

export const StepChoosePlan: React.FC<{ onNext: (planId: string) => void }> = ({
  onNext,
}) => {
  const [selected, setSelected] = React.useState<string>('plus');

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-xl font-semibold">Choose a plan</h2>
      <div className="grid gap-4">
        {plans.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p.id)}
            className={`p-4 border rounded ${
              selected === p.id ? 'border-primary bg-primary/10' : 'border-gray-300'
            }`}
          >
            <div className="flex justify-between">
              <span className="font-medium">{p.name}</span>
              <span className="font-semibold">
                {p.price === 0
                  ? 'Free'
                  : `$${(p.price / 100).toFixed(2)}/mo`}
              </span>
            </div>
            <p className="text-sm text-gray-600">{p.description}</p>
          </button>
        ))}
      </div>
      <button
        onClick={() => onNext(selected)}
        className="mt-4 w-full py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Next
      </button>
    </div>
  );
};
