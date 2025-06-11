// src/modules/payments/Wallet.tsx
import React, { useState, useEffect } from 'react';
import { useStripeData } from '@/context/StripeContext';
import { CardRow } from '@/modules/payments/components/CardRow';
import { PaymentMethodSelector } from '@/modules/payments/components/PaymentMethodSelector';
import { PlanCard } from '@/modules/payments/components/PlanCard';
import StripeElements from '@/lib/stripeClient';
import { createSetupIntent } from '@/modules/payments/paymentsClient';
import { useToast } from '@components/ui/ToastProvider';

const tabs = ['Saved Cards', 'Add Card', 'Plan & Billing'] as const;
type Tab = typeof tabs[number];

const Wallet: React.FC = () => {
  const [active, setActive] = useState<Tab>('Saved Cards');
  const { cards, isLoadingCards } = useStripeData();
  const { addToast } = useToast();

  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loadingSecret, setLoadingSecret] = useState(false);

  // Whenever user switches to "Add Card", fetch the SetupIntent
  useEffect(() => {
    if (active === 'Add Card') {
      setLoadingSecret(true);
      createSetupIntent()
        .then(secret => setClientSecret(secret))
        .catch(err => addToast({ message: err.message || 'Failed to initialize payment form', type: 'error' }))
        .finally(() => setLoadingSecret(false));
    }
  }, [active, addToast]);

  const handleCardAdded = () => {
    addToast('Card linked successfully', 'success');
    setActive('Saved Cards');
  };

  const handleCardError = (err: any) => {
    addToast(err.message || 'Failed to add card', 'error');
  };

  return (
    <div className="max-w-lg mx-auto my-8 p-4">
      {/* Tabs */}
      <div className="flex border-b mb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`flex-1 py-2 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
              ${
                active === tab
                  ? 'border-b-2 border-primary font-semibold text-primary'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Saved Cards */}
      {active === 'Saved Cards' && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded">
          {isLoadingCards ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 dark:bg-gray-700 animate-pulse mb-2 rounded"
              />
            ))
          ) : cards && cards.length > 0 ? (
            cards.map(c => <CardRow key={c.id} card={c} />)
          ) : (
            <div className="p-4 text-gray-500 dark:text-gray-400">
              No saved cards.
            </div>
          )}
        </div>
      )}

      {/* Add Card */}
      {active === 'Add Card' && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded p-4">
          {loadingSecret ? (
            <div className="text-center text-gray-500">Loading payment form…</div>
          ) : clientSecret ? (
            <StripeElements options={{ clientSecret }}>
              <PaymentMethodSelector
                onSuccess={handleCardAdded}
                onError={handleCardError}
              />
            </StripeElements>
          ) : null}
        </div>
      )}

      {/* Plan & Billing */}
      {active === 'Plan & Billing' && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded p-4">
          <PlanCard />
        </div>
      )}
    </div>
  );
};

export default Wallet;
