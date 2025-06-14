// src/modules/payments/components/PlanCard.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStripeData } from '@/context/StripeContext';
import { useToast } from '@components/ui/ToastProvider';
import { API_BASE } from '@/config';

export const PlanCard: React.FC = () => {
  const { subscription, refresh } = useStripeData();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  if (subscription === undefined) {
    return (
      <div className="p-2 sm:p-4 bg-white dark:bg-gray-800 rounded animate-pulse space-y-2">
        <div className="h-5 sm:h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
        <div className="h-4 sm:h-5 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4" />
      </div>
    );
  }

  if (subscription.plan === 'FREE') {
    return (
      <div className="p-2 sm:p-4 bg-white dark:bg-gray-800 rounded space-y-4">
        <div className="flex items-center justify-between">
          <span className="inline-block px-2 py-1 text-xs sm:text-sm font-semibold bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-full">
            Active Basic
          </span>
          <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Unlimited
          </span>
        </div>
        <button
          onClick={() => navigate('/subscribe')}
          className="w-full py-2 bg-primary text-white rounded hover:bg-primary/90 transition text-sm sm:text-base"
        >
          Upgrade to Plus
        </button>
      </div>
    );
  }

  if (subscription.status.toLowerCase() !== 'active') {
    return (
      <div className="p-2 sm:p-4 bg-white dark:bg-gray-800 rounded text-center text-gray-500 text-sm sm:text-base">
        No active paid subscription.
      </div>
    );
  }

  const renewDate = subscription.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd * 1000).toLocaleDateString()
    : '—';
  const willCancelAt = subscription.cancelAt
    ? new Date(subscription.cancelAt * 1000).toLocaleDateString('en-US')
    : null;

  return (
    <div className="p-2 sm:p-4 bg-white dark:bg-gray-800 rounded space-y-4">
      <div className="flex items-center justify-between">
        <span className="inline-block px-2 py-1 text-xs sm:text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-900 rounded-full">
          Active Plus
        </span>
        <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Renews: {renewDate}
        </span>
      </div>

      {willCancelAt && (
        <div className="text-xs sm:text-sm text-yellow-700 dark:text-yellow-300">
          Will cancel on {willCancelAt}
        </div>
      )}

      <button
        disabled={loading || !!willCancelAt}
        onClick={async () => {
          setLoading(true);
          try {
            const res = await fetch(`${API_BASE}/api/payments/cancel-subscription`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ subscriptionId: subscription.subscriptionId }),
            });
            if (!res.ok) {
              const err = await res.json().catch(() => ({}));
              throw new Error(err.error || 'Cancellation failed');
            }
            const { cancelAt } = await res.json();
            refresh();
            addToast({
              message: 'Will cancel on ' + new Date(cancelAt * 1000).toLocaleDateString(),
              type: 'info',
            });
          } catch (err: any) {
            console.error('Cancel failed', err);
            addToast({ message: err.message || 'Failed to schedule cancellation', type: 'error' });
          } finally {
            setLoading(false);
          }
        }}
        className={`w-full py-2 rounded text-white transition active:scale-95 duration-150 ${
          loading || willCancelAt
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700'
        } text-sm sm:text-base`}
      >
        {willCancelAt ? `Will cancel on ${willCancelAt}` : loading ? 'Scheduling…' : 'Cancel at Period End'}
      </button>
    </div>
  );
};
