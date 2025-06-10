// src/context/StripeContext.tsx
import React, { createContext, useContext, useEffect } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import * as paymentsClient from '../modules/payments/paymentsClient';

interface StripeContextValue {
  cards: paymentsClient.CardData[] | undefined;
  subscription:
    | { subscriptionId: string; status: string; currentPeriodEnd: number }
    | undefined;
  addCard: (paymentMethodId: string, nickName: string | null) => Promise<void>;
  subscribe: (priceId: string, paymentMethodId: string) => Promise<void>;
  openCustomerPortal: () => Promise<string>;
  refresh: () => void;
}

const StripeContext = createContext<StripeContextValue | undefined>(undefined);
const queryClient = new QueryClient();

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Fetch saved cards
  const { data: cards } = useQuery(['cards'], () => paymentsClient.fetchCards());

  // Fetch active subscription
  const { data: subscription } = useQuery(
    ['subscription'],
    () => paymentsClient.fetchActiveSubscription()
  );

  // Mutation: add card
  const addCardMutation = useMutation(
    (args: { paymentMethodId: string; nickName: string | null }) =>
      paymentsClient.addCard(args),
    { onSuccess: () => queryClient.invalidateQueries(['cards']) }
  );

  // Mutation: create subscription intent
  const subscribeMutation = useMutation(
    (args: { priceId: string; paymentMethodId: string }) =>
      paymentsClient.createSubscriptionIntent(
        args.priceId,
        args.paymentMethodId
      ),
    { onSuccess: () => queryClient.invalidateQueries(['subscription']) }
  );

  // Mutation: open customer portal (renamed from cancel)
  const portalSessionMutation = useMutation(
    (returnUrl: string) =>
      paymentsClient.createPortalSession({ return_url: returnUrl }),
    { onSuccess: () => queryClient.invalidateQueries(['subscription']) }
  );

  const contextValue: StripeContextValue = {
    cards,
    subscription,
    addCard: (paymentMethodId, nickName) =>
      addCardMutation.mutateAsync({ paymentMethodId, nickName }),
    subscribe: (priceId, paymentMethodId) =>
      subscribeMutation.mutateAsync({ priceId, paymentMethodId }),

    // Renamed and updated: include return_url so backend can redirect properly
    openCustomerPortal: () =>
      portalSessionMutation
        .mutateAsync(window.location.href)
        .then((res) => res.url),

    refresh: () => {
      queryClient.invalidateQueries(['cards']);
      queryClient.invalidateQueries(['subscription']);
    },
  };

  // Prefetch on mount
  useEffect(() => {
    queryClient.prefetchQuery(['cards'], () => paymentsClient.fetchCards());
    queryClient.prefetchQuery(
      ['subscription'],
      () => paymentsClient.fetchActiveSubscription()
    );
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <StripeContext.Provider value={contextValue}>
        {children}
      </StripeContext.Provider>
    </QueryClientProvider>
  );
};

export const useStripeData = (): StripeContextValue => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error(
      'useStripeData must be used within a StripeProvider'
    );
  }
  return context;
};