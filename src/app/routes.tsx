import React, { lazy } from "react";
import RootLayout from "../layouts/RootLayout";
import PublicLayout from "../layouts/PublicLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import RequireAuth from "../components/RequireAuth";
import paymentRoutes from "../modules/payments/routes";

// —— Public pages (lazy‑loaded) ——
const Splash              = lazy(() => import("../pages/Splash"));
const LetsYouIn           = lazy(() => import("../pages/lets-you-in"));
const NotificationAllow   = lazy(() => import("../pages/notificationAllow"));

// —— Authenticated pages ——
const DentgoHome          = lazy(() => import("../pages/dentgo-gpt-home"));
const DentgoChat          = lazy(() => import("../pages/dentgo-chat"));
const History             = lazy(() => import("../pages/history"));
const Notification        = lazy(() => import("../pages/notification"));
const NotificationSetting = lazy(() => import("../pages/notification-setting"));
const Currency            = lazy(() => import("../pages/currency"));
const TermsAndPrivacy     = lazy(() => import("../pages/terms-and-privacy"));
const ContactUs           = lazy(() => import("../pages/contact-us"));
const DeleteAccount       = lazy(() => import("../pages/Delete"));

// —— Misc standalone pages (simple modals / alerts) ——
const Alert               = lazy(() => import("../pages/alert"));
const Confirmation        = lazy(() => import("../pages/Confirmation"));
const ConfirmPaymentPin   = lazy(() => import("../pages/confirm-payment-pin"));

const routes = [
  // PUBLIC
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <Splash /> },
      { path: "login",      element: <LetsYouIn /> },
      { path: "allow-push", element: <NotificationAllow /> },
    ],
  },

  // AUTHENTICATED
  {
    element: (
      <RequireAuth>
        <RootLayout />
      </RequireAuth>
    ),
    children: [
      {
        element: <DashboardLayout />, // adds SideMenu + padding
        children: [
          // core app
          { path: "DentgoGptHome",        element: <DentgoHome /> },
          { path: "DentgoChat",           element: <DentgoChat /> },
          { path: "History",              element: <History /> },
          { path: "Notification",         element: <Notification /> },
          { path: "NotificationSetting",  element: <NotificationSetting /> },
          { path: "Currency",             element: <Currency /> },
          { path: "TermsAndPrivacy",      element: <TermsAndPrivacy /> },
          { path: "ContactUs",            element: <ContactUs /> },
          { path: "Delete",               element: <DeleteAccount /> },
          // feature modules
          ...paymentRoutes,
        ],
      },
    ],
  },

  // STANDALONE (accessible without menu)
  { path: "Alert",           element: <Alert /> },
  { path: "Confirmation",    element: <Confirmation /> },
  { path: "ConfirmPaymentPin", element: <ConfirmPaymentPin /> },
];

export default routes;
