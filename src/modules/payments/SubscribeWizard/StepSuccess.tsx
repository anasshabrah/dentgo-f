// src/modules/payments/SubscribeWizard/StepSuccess.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { useStripeData } from '@/context/StripeContext';
import { FREE_MESSAGES_PER_DAY, API_BASE } from '@/config';
import type { ActiveSubscription } from '@/api/subscriptions';
import { fetchActiveSubscription } from '@/api/subscriptions';

export interface StepSuccessProps {
  planId: string;
}

const StepSuccess: React.FC<StepSuccessProps> = ({ planId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { refresh } = useStripeData();

  // Trigger cache invalidation for cards and subscription once on mount
  useEffect(() => {
    queryClient.invalidateQueries(['cards']);
    queryClient.invalidateQueries(['subscription']);
    refresh();
  }, [queryClient, refresh]);

  // Fetch latest subscription from server
  const {
    data: subscription,
    isFetching: loadingSubscription,
  } = useQuery<ActiveSubscription>(
    ['subscription'],
    fetchActiveSubscription,
    { enabled: true }
  );

  const isFree = planId === 'basic';
  const title = isFree ? 'Free Plan Activated!' : 'Subscription Successful!';
  const message = isFree
    ? `You're on the Basic plan with ${FREE_MESSAGES_PER_DAY} free message${FREE_MESSAGES_PER_DAY > 1 ? 's' : ''} per day. Enjoy your Dentgo experience!`
    : 'Thank you for subscribing. You now have unlimited access.';

  const handleStart = async () => {
    // Ensure subscription data is up to date
    await queryClient.refetchQueries(['subscription']);
    navigate('/dentgo-chat');
  };

  return (
    <div className="p-4 text-center space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-gray-600">{message}</p>
      <button
        onClick={handleStart}
        disabled={loadingSubscription}
        className={`mt-4 px-6 py-3 text-lg font-semibold rounded shadow transition active:scale-95 duration-150
          ${loadingSubscription
            ? 'bg-gray-400 cursor-not-allowed text-gray-700'
            : 'bg-primary text-white hover:bg-primary/90'}`}
      >
        {loadingSubscription ? 'Loading…' : 'Start Now'}
      </button>
    </div>
  );
};

export default StepSuccess;
