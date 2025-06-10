// src/modules/payments/SubscribeWizard/StepSuccess.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

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

  // Determine content based on plan
  const isFree = planId === 'basic';
  const title = isFree
    ? 'Free Plan Activated!'
    : 'Subscription Successful!';
  const message = isFree
    ? "You're on the Basic plan with 1 free message per day. Enjoy your Dentgo experience!"
    : 'Thank you for subscribing. You now have unlimited access.';

  const handleStart = () => {
    // Navigate to chat
    navigate('/dentgo-chat');
  };

  return (
    <div className="p-4 text-center space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-gray-600">{message}</p>
      <button
        onClick={handleStart}
        className="mt-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Start Now
      </button>
    </div>
  );
};

export default StepSuccess;
