import React, { lazy } from "react";

const PaymentMethod     = lazy(() => import("../../pages/PaymentMethod"));
const AddNewCard        = lazy(() => import("../../pages/AddNewCard"));
const SelectPayment     = lazy(() => import("../../pages/SelectPaymentMethod"));
const SubscriptionPay   = lazy(() => import("../../pages/SubscriptionPayment"));
const PlusSubscription  = lazy(() => import("../../pages/PlusSubscription"));
const CancelSubscription= lazy(() => import("../../pages/CancelSubscription"));

const paymentRoutes = [
  { path: "PaymentMethod",       element: <PaymentMethod /> },
  { path: "AddNewCard",          element: <AddNewCard /> },
  { path: "SelectPaymentMethod", element: <SelectPayment /> },
  { path: "SubscriptionPayment", element: <SubscriptionPay /> },
  { path: "PlusSubscription",    element: <PlusSubscription /> },
  { path: "CancelSubscription",  element: <CancelSubscription /> },
];

export default paymentRoutes;