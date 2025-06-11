// src/modules/payments/SubscribeWizard/StepSuccess.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useStripeData } from '@/context/StripeContext';
import { FREE_MESSAGES_PER_DAY } from '@/config';

export interface StepSuccessProps {
planId: string;
}

const StepSuccess: React.FC = ({ planId }) => {
const navigate = useNavigate();
const queryClient = useQueryClient();
const { refresh } = useStripeData();

useEffect(() => {
// Refresh cards & subscription data
queryClient.invalidateQueries(['cards']);
queryClient.invalidateQueries(['subscription']);
// ALSO trigger our custom refresh (so subscription immediately updates)
refresh();
}, [queryClient, refresh]);

const isFree = planId === 'basic';
const title = isFree
? 'Free Plan Activated!'
: 'Subscription Successful!';
const message = isFree
? You're on the Basic plan with ${FREE_MESSAGES_PER_DAY} free message${FREE_MESSAGES_PER_DAY > 1 ? 's' : ''} per day. Enjoy your Dentgo experience!
: 'Thank you for subscribing. You now have unlimited access.';

const handleStart = () => {
navigate('/dentgo-chat');
};

return (

{title}
{message}

Start Now


);
};

export default StepSuccess;