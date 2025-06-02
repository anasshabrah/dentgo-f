import React, { lazy } from "react";
import RootLayout from "./layouts/RootLayout";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import RequireAuth from "../components/RequireAuth";
import paymentRoutes from "../modules/payments/routes";

// —— Public pages (lazy‑loaded) ——
const Splash              = lazy(() => import("../pages/Splash"));
const Login           = lazy(() => import("../pages/Login"));
const NotificationAllow   = lazy(() => import("../pages/NotificationAllow"));

// —— Authenticated pages ——
const DentgoHome          = lazy(() => import("../pages/DentgoGptHome"));
const DentgoChat          = lazy(() => import("../pages/DentgoChat"));
const History             = lazy(() => import("../pages/History"));
const Notification        = lazy(() => import("../pages/Notification"));
const NotificationSetting = lazy(() => import("../pages/NotificationSetting"));
const Currency            = lazy(() => import("../pages/Currency"));
const TermsAndPrivacy     = lazy(() => import("../pages/TermsAndPrivacy"));
const ContactUs           = lazy(() => import("../pages/ContactUs"));
const DeleteAccount       = lazy(() => import("../pages/Delete"));

// —— Misc standalone pages (simple modals / alerts) ——
const Alert               = lazy(() => import("../pages/Alert"));
const Confirmation        = lazy(() => import("../pages/Confirmation"));
const ConfirmPaymentPin   = lazy(() => import("../pages/ConfirmPaymentPin"));

const routes = [
  // PUBLIC
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <Splash /> },
      { path: "login",      element: <Login /> },
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
