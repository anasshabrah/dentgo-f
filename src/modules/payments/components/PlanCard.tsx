// src/modules/payments/components/PlanCard.tsx
import React from 'react';
import { useStripeData } from '@/context/StripeContext';
import { FREE_MESSAGES_PER_DAY } from '@/config';

export const PlanCard: React.FC = () => {
  const { subscription, openCustomerPortal } = useStripeData();

  // Handle loading state
  if (subscription === undefined) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
      </div>
    );
  }

  // If no subscription record, treat as Basic free plan
  if (Array.isArray(subscription) && subscription.length === 0) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded space-y-4 text-center">
        <h3 className="text-lg font-semibold">Basic Plan</h3>
        <p className="text-gray-600">Free, {FREE_MESSAGES_PER_DAY} message{FREE_MESSAGES_PER_DAY > 1 ? 's' : ''}/day</p>
        <button
          onClick={async () => {
            const url = await openCustomerPortal();
            window.location.href = url;
          }}
          className="w-full py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
        >
          Upgrade to Plus
        </button>
      </div>
    );
  }

  // If subscription exists
  const sub = Array.isArray(subscription) ? subscription[0] : subscription;

  if (!sub || sub.status !== 'ACTIVE') {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded text-center text-gray-500">
        No active paid subscription.
      </div>
    );
  }

  const renewDate = sub.currentPeriodEnd
    ? new Date(sub.currentPeriodEnd * 1000).toLocaleDateString()
    : '—';

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded space-y-4">
      <div className="flex items-center justify-between">
        <span className="inline-block px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900 rounded-full">
          Active Plus
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