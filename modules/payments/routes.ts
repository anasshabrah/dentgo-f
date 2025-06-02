import React, { lazy } from "react";

const PaymentMethod     = lazy(() => import("../../pages/payment-method"));
const AddNewCard        = lazy(() => import("../../pages/add-new-card"));
const SelectPayment     = lazy(() => import("../../pages/SelectPaymentMethod"));
const SubscriptionPay   = lazy(() => import("../../pages/subscription-payment"));
const PlusSubscription  = lazy(() => import("../../pages/plus-subscription"));
const CancelSubscription= lazy(() => import("../../pages/cancel-subscription"));

const paymentRoutes = [
  { path: "PaymentMethod",       element: <PaymentMethod /> },
  { path: "AddNewCard",          element: <AddNewCard /> },
  { path: "SelectPaymentMethod", element: <SelectPayment /> },
  { path: "SubscriptionPayment", element: <SubscriptionPay /> },
  { path: "PlusSubscription",    element: <PlusSubscription /> },
  { path: "CancelSubscription",  element: <CancelSubscription /> },
];

export default paymentRoutes;