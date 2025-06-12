// src/context/StripeContext.tsx
import React, { createContext, useContext, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CardData } from "@/modules/payments/types";
import {
  fetchCards,
  addCard,
  fetchActiveSubscription,
  createPortalSession,
  createSubscription,
} from "@/modules/payments/paymentsClient";
import { useAuth } from "@/context/AuthContext";
import type { ActiveSubscription } from "@/api/subscriptions";

interface StripeContextValue {
  cards: CardData[] | undefined;
  isLoadingCards: boolean;
  subscription: ActiveSubscription | undefined;
  addCard: (paymentMethodId: string, nickName: string | null) => Promise<void>;
  subscribe: (
    priceId: string,
    paymentMethodId?: string | null
  ) => Promise<{ clientSecret: string; subscriptionId: string; status: string }>;
  openCustomerPortal: () => Promise<string>;
  refresh: () => void;
}

const StripeContext = createContext<StripeContextValue | undefined>(undefined);

export const StripeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const {
    data: cards,
    isLoading: isLoadingCards,
  } = useQuery(["cards"], fetchCards, {
    enabled: isAuthenticated,
  });

  const { data: subscription } = useQuery<ActiveSubscription>(
    ["subscription"],
    fetchActiveSubscription,
    {
      enabled: isAuthenticated,
    }
  );

  const addCardMutation = useMutation<
    void,
    Error,
    { paymentMethodId: string; nickName: string | null }
  >(
    (args) => addCard(args.paymentMethodId, args.nickName),
    {
      onSuccess: () => queryClient.invalidateQueries(["cards"]),
    }
  );

  const subscribeMutation = useMutation<
    { clientSecret: string; subscriptionId: string; status: string },
    Error,
    { priceId: string; paymentMethodId?: string | null }
  >(
    (args) => createSubscription(args.priceId, args.paymentMethodId),
    {
      onSuccess: () => queryClient.invalidateQueries(["subscription"]),
    }
  );

  const portalMutation = useMutation<{ url: string }, Error, void>(
    () => createPortalSession(),
    {
      onSuccess: () => queryClient.invalidateQueries(["subscription"]),
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
      portalMutation.mutateAsync().then((res) => res.url),
    refresh: () => {
      queryClient.invalidateQueries(["cards"]);
      queryClient.invalidateQueries(["subscription"]);
    },
  };

  useEffect(() => {
    if (isAuthenticated) {
      queryClient.prefetchQuery(["cards"], fetchCards);
      queryClient.prefetchQuery(["subscription"], fetchActiveSubscription);
    }
  }, [isAuthenticated, queryClient]);

  return (
    <StripeContext.Provider value={contextValue}>
      {children}
    </StripeContext.Provider>
  );
};

export const useStripeData = (): StripeContextValue => {
  const ctx = useContext(StripeContext);
  if (!ctx) throw new Error("useStripeData must be within StripeProvider");
  return ctx;
};
