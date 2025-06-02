import React, { lazy } from "react";

const PaymentMethod = lazy(() => import("../../pages/PaymentMethod"));
const AddNewCard = lazy(() => import("../../pages/AddNewCard"));
const SelectPayment = lazy(() => import("../../pages/SelectPaymentMethod"));
const CancelSubscription = lazy(() => import("../../pages/CancelSubscription"));
const SubscriptionPayment = lazy(() => import("../../pages/SubscriptionPayment"));
const BankCards = lazy(() => import("../../pages/BankCards"));
const PlusSubscription = lazy(() => import("../../pages/PlusSubscription"));

const paymentRoutes = [
  { path: "payment-method", element: <PaymentMethod /> },
  { path: "add-new-card", element: <AddNewCard /> },
  { path: "select-payment-method", element: <SelectPayment /> },
  { path: "cancel-subscription", element: <CancelSubscription /> },
  { path: "subscription-payment", element: <SubscriptionPayment /> },
  { path: "bank-cards", element: <BankCards /> },
  { path: "plus-subscription", element: <PlusSubscription /> },
];

export default paymentRoutes;