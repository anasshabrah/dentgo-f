// src/modules/payments/components/PlanCard.tsx
import React from 'react';
import { useStripeData } from '../../../context/StripeContext';

export const PlanCard: React.FC = () => {
  const { subscription, openCustomerPortal } = useStripeData();

  if (subscription === undefined) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
      </div>
    );
  }

  if (!subscription || subscription.status !== 'active') {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded text-center text-gray-500">
        No active plan.
      </div>
    );
  }

  const renewDate = new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString();

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded space-y-4">
      <div className="flex items-center justify-between">
        <span className="inline-block px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900 rounded-full">
          Active
        </span>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Renews: {renewDate}
        </span>
      </div>
      <button
        onClick={async () => {
          const url = await openCustomerPortal();
          window.location.href = url;
        }}
        className="w-full py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
      >
        Manage in Stripe Portal
      </button>
    </div>
  );
};
