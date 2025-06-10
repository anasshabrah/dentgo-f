// src/modules/payments/SubscribeWizard/StepSuccess.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export const StepSuccess: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    queryClient.invalidateQueries(['cards']);
    queryClient.invalidateQueries(['subscription']);
  }, [queryClient]);

  return (
    <div className="p-4 text-center space-y-4">
      <h2 className="text-2xl font-semibold">Subscription Successful!</h2>
      <p className="text-gray-600">
        Thank you for subscribing. You now have unlimited access.
      </p>
      <button
        onClick={() => navigate('/wallet')}
        className="mt-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
      >
        Go to Wallet
      </button>
    </div>
  );
};