import React, { lazy, Suspense } from "react";

const PaymentMethod = lazy(() => import("../../pages/PaymentMethod"));
const AddNewCard = lazy(() => import("../../pages/AddNewCard"));
const SelectPayment = lazy(() => import("../../pages/SelectPaymentMethod"));
const CancelSubscription = lazy(() => import("../../pages/CancelSubscription"));
const SubscriptionPayment = lazy(() => import("../../pages/SubscriptionPayment"));
const BankCards = lazy(() => import("../../pages/BankCards"));
const PlusSubscription = lazy(() => import("../../pages/PlusSubscription"));

const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <Suspense fallback={<div>Loading...</div>}>
    <Component />
  </Suspense>
);

const paymentRoutes = [
  { path: "payment-method", element: withSuspense(PaymentMethod) },
  { path: "add-new-card", element: withSuspense(AddNewCard) },
  { path: "select-payment-method", element: withSuspense(SelectPayment) },
  { path: "cancel-subscription", element: withSuspense(CancelSubscription) },
  { path: "subscription-payment", element: withSuspense(SubscriptionPayment) },
  { path: "bank-cards", element: withSuspense(BankCards) },
  { path: "plus-subscription", element: withSuspense(PlusSubscription) },
];

export default paymentRoutes;
