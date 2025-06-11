// src/context/StripeContext.tsx
import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as paymentsClient from '@/modules/payments/paymentsClient';
import type { CardData } from '@/modules/payments/types';
import { useAuth } from '@/context/AuthContext';

interface StripeContextValue {
  cards: CardData[] | undefined;
  isLoadingCards: boolean;
  subscription:
    | { subscriptionId: string; status: string; currentPeriodEnd: number }
    | undefined;
  addCard: (paymentMethodId: string, nickName: string | null) => Promise<void>;
  /** `paymentMethodId` may be omitted for the “FREE” plan */
  subscribe: (
    priceId: string,
    paymentMethodId?: string | null
  ) => Promise<{ clientSecret: string; subscriptionId: string; status: string }>;
  openCustomerPortal: () => Promise<string>;
  refresh: () => void;
}

const StripeContext = createContext<StripeContextValue | undefined>(undefined);

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const {
    data: cards,
    isLoading: isLoadingCards,
  } = useQuery(['cards'], paymentsClient.fetchCards, {
    enabled: isAuthenticated,
  });

  const { data: subscription } = useQuery(
    ['subscription'],
    paymentsClient.fetchActiveSubscription,
    {
      enabled: isAuthenticated,
    }
  );

  const addCardMutation = useMutation<void, Error, { paymentMethodId: string; nickName: string | null }>(
    (args) => paymentsClient.addCard(args),
    {
      onSuccess: () => queryClient.invalidateQueries(['cards']),
    }
  );

  const subscribeMutation = useMutation<
    { clientSecret: string; subscriptionId: string; status: string },
    Error,
    { priceId: string; paymentMethodId?: string | null }
  >(
    (args) => paymentsClient.createSubscriptionIntent(args.priceId, args.paymentMethodId),
    {
      onSuccess: () => queryClient.invalidateQueries(['subscription']),
    }
  );

  const portalSessionMutation = useMutation<{ url: string }, Error, void>(
    () => paymentsClient.createPortalSession(),
    {
      onSuccess: () => queryClient.invalidateQueries(['subscription']),
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

  useEffect(() => {
    if (isAuthenticated) {
      queryClient.prefetchQuery(['cards'], paymentsClient.fetchCards);
      queryClient.prefetchQuery(['subscription'], paymentsClient.fetchActiveSubscription);
    }
  }, [isAuthenticated, queryClient]);

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
