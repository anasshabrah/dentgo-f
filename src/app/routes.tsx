import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import RequireAuth from "../components/RequireAuth";
import paymentRoutes from "../../modules/payments/routes";

// —— Public pages (lazy-loaded) ——
const Splash             = lazy(() => import("../pages/Splash"));
const Login              = lazy(() => import("../pages/Login"));
const NotificationAllow  = lazy(() => import("../pages/NotificationAllow"));

// —— Authenticated pages ——
const DentgoGptHome      = lazy(() => import("../pages/DentgoGptHome"));
const DentgoChat         = lazy(() => import("../pages/DentgoChat"));
const History            = lazy(() => import("../pages/History"));
const Notification       = lazy(() => import("../pages/Notification"));
const NotificationSetting = lazy(() => import("../pages/NotificationSetting"));
const Currency           = lazy(() => import("../pages/Currency"));
const TermsAndPrivacy    = lazy(() => import("../pages/TermsAndPrivacy"));
const ContactUs          = lazy(() => import("../pages/ContactUs"));
const DeleteAccount      = lazy(() => import("../pages/Delete"));

// —— Misc standalone pages (simple modals / alerts) ——
const Alert             = lazy(() => import("../pages/Alert"));
const Confirmation      = lazy(() => import("../pages/Confirmation"));
const ConfirmPaymentPin = lazy(() => import("../pages/ConfirmPaymentPin"));

export default function RoutesConfig() {
  const renderRoutes = (list: any[]) =>
    list.map(({ path, element, children, index }, i) => (
      <Route key={i} path={path} element={element} index={index}>
        {children ? renderRoutes(children) : null}
      </Route>
    ));

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
            { path: "dentgo-gpt-home",    element: <DentgoGptHome /> },
            { path: "dentgo-chat",        element: <DentgoChat /> },
            { path: "history",            element: <History /> },
            { path: "notification",       element: <Notification /> },
            { path: "notification-setting", element: <NotificationSetting /> },
            { path: "currency",           element: <Currency /> },
            { path: "terms-and-privacy",  element: <TermsAndPrivacy /> },
            { path: "contact-us",         element: <ContactUs /> },
            { path: "delete",             element: <DeleteAccount /> },
            // feature modules (payment routes are defined with their own kebab-case paths)
            ...paymentRoutes,
          ],
        },
      ],
    },

    // STANDALONE (accessible without menu)
    { path: "alert",               element: <Alert /> },
    { path: "confirmation",        element: <Confirmation /> },
    { path: "confirm-payment-pin", element: <ConfirmPaymentPin /> },
  ];

  return <Routes>{renderRoutes(routes)}</Routes>;
}
