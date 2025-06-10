// src/context/StripeContext.tsx
import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as paymentsClient from '@/modules/payments/paymentsClient';
import type { CardData } from '@/modules/payments/types';

interface StripeContextValue {
  cards: CardData[] | undefined;
  isLoadingCards: boolean;
  subscription:
    | { subscriptionId: string; status: string; currentPeriodEnd: number }
    | undefined;
  addCard: (paymentMethodId: string, nickName: string | null) => Promise<void>;
  subscribe: (
    priceId: string,
    paymentMethodId: string
  ) => Promise<{ clientSecret: string; subscriptionId: string; status: string }>;
  openCustomerPortal: () => Promise<string>;
  refresh: () => void;
}

const StripeContext = createContext<StripeContextValue | undefined>(undefined);

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Fetch saved cards
  const {
    data: cards,
    isLoading: isLoadingCards,
  } = useQuery(['cards'], paymentsClient.fetchCards);

  // Fetch active subscription
  const { data: subscription } = useQuery(['subscription'], paymentsClient.fetchActiveSubscription);

  // Mutation: add card
  const addCardMutation = useMutation<
    void,
    Error,
    { paymentMethodId: string; nickName: string | null }
  >(
    (args) => paymentsClient.addCard(args),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['cards']);
      },
    }
  );

  // Mutation: create subscription intent
  const subscribeMutation = useMutation<
    { clientSecret: string; subscriptionId: string; status: string },
    Error,
    { priceId: string; paymentMethodId: string }
  >(
    (args) => paymentsClient.createSubscriptionIntent(args.priceId, args.paymentMethodId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['subscription']);
      },
    }
  );

  // Mutation: open customer portal
  const portalSessionMutation = useMutation<
    { url: string },
    Error,
    void
  >(
    () => paymentsClient.createPortalSession(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['subscription']);
      },
    }
  );

  const contextValue: StripeContextValue = {
    cards,
    isLoadingCards,
    subscription,
    addCard: (paymentMethodId, nickName) =>
      addCardMutation.mutateAsync({ paymentMethodId, nickName }),
    subscribe: (priceId, paymentMethodId) =>
      subscribeMutation.mutateAsync({ priceId, paymentMethodId }),
    openCustomerPortal: () =>
      portalSessionMutation.mutateAsync().then((res) => res.url),
    refresh: () => {
      queryClient.invalidateQueries(['cards']);
      queryClient.invalidateQueries(['subscription']);
    },
  };

  // Prefetch on mount
  useEffect(() => {
    queryClient.prefetchQuery(['cards'], paymentsClient.fetchCards);
    queryClient.prefetchQuery(['subscription'], paymentsClient.fetchActiveSubscription);
  }, [queryClient]);

  return (
    <StripeContext.Provider value={contextValue}>
      {children}
    </StripeContext.Provider>
  );
};

export const useStripeData = (): StripeContextValue => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error('useStripeData must be used within a StripeProvider');
  }
  return context;
};
