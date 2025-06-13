// src/app/routes.tsx

import React, { lazy, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import RequireAuth from "@components/RequireAuth";
import paymentRoutes from "@/modules/payments/routes";

const Splash = lazy(() => import("../pages/Splash"));
const Login = lazy(() => import("../pages/Login"));
const NotificationAllow = lazy(() => import("../pages/NotificationAllow"));

const DentgoGptHome = lazy(() => import("../pages/DentgoGptHome"));
const DentgoChat = lazy(() => import("../pages/DentgoChat"));
const History = lazy(() => import("../pages/History"));
const Notification = lazy(() => import("../pages/Notification"));
const TermsAndPrivacy = lazy(() => import("../pages/TermsAndPrivacy"));
const ContactUs = lazy(() => import("../pages/ContactUs"));
const DeleteAccount = lazy(() => import("../pages/Delete"));

const Confirmation = lazy(() => import("../pages/Confirmation"));

export default function RoutesConfig() {
  useEffect(() => {
    if (import.meta.env.DEV) {
      console.log("[Lifecycle] routes.tsx → RoutesConfig rendered");
    }
  }, []);

  const renderRoutes = (list: any[]) =>
    list.map(({ path, element, children, index }, i) => {
      if (import.meta.env.DEV) {
        console.log(`[Routing] Adding route #${i}: path="${path ?? "(index)"}"`);
      }

      return (
        <Route key={i} path={path} element={element} index={index}>
          {children ? renderRoutes(children) : null}
        </Route>
      );
    });

  const routes = [
    // PUBLIC
    {
      element: <PublicLayout />,
      children: [
        { index: true, element: <Splash /> },
        { path: "login", element: <Login /> },
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
          element: <DashboardLayout />,
          children: [
            { path: "dentgo-gpt-home", element: <DentgoGptHome /> },
            { path: "dentgo-chat", element: <DentgoChat /> },
            { path: "history", element: <History /> },
            { path: "notification", element: <Notification /> },
            { path: "terms-and-privacy", element: <TermsAndPrivacy /> },
            { path: "contact-us", element: <ContactUs /> },
            { path: "delete", element: <DeleteAccount /> },
            ...paymentRoutes,
          ],
        },
      ],
    },

    // STANDALONE
    { path: "confirmation", element: <Confirmation /> },

    // DEFAULT REDIRECT
    { path: "/", element: <Navigate to="/dentgo-gpt-home" replace /> },
  ];

  return <Routes>{renderRoutes(routes)}</Routes>;
}
