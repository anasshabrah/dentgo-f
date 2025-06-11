// src/modules/payments/SubscribeWizard/StepSuccess.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { FREE_MESSAGES_PER_DAY } from '@/config';

export interface StepSuccessProps {
  planId: string;
}

const StepSuccess: React.FC<StepSuccessProps> = ({ planId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Refresh cards & subscription data
    queryClient.invalidateQueries(['cards']);
    queryClient.invalidateQueries(['subscription']);
  }, [queryClient]);

  const isFree = planId === 'basic';
  const title = isFree
    ? 'Free Plan Activated!'
    : 'Subscription Successful!';
  const message = isFree
    ? `You're on the Basic plan with ${FREE_MESSAGES_PER_DAY} free message${FREE_MESSAGES_PER_DAY > 1 ? 's' : ''} per day. Enjoy your Dentgo experience!`
    : 'Thank you for subscribing. You now have unlimited access.';

  const handleStart = () => {
    navigate('/dentgo-chat');
  };

  return (
    <div className="p-4 text-center space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-gray-600">{message}</p>
      <button
        onClick={handleStart}
        className="mt-4 px-6 py-3 bg-primary text-white text-lg font-semibold rounded shadow hover:bg-primary/90 transition"
      >
        Start Now
      </button>
    </div>
  );
};

export default StepSuccess;
