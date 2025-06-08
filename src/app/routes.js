import { jsx as _jsx } from "react/jsx-runtime";
import { lazy, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import RequireAuth from "@components/RequireAuth";
import paymentRoutes from "../modules/payments/routes";
const Splash = lazy(() => import("../pages/Splash"));
const Login = lazy(() => import("../pages/Login"));
const NotificationAllow = lazy(() => import("../pages/NotificationAllow"));
const DentgoGptHome = lazy(() => import("../pages/DentgoGptHome"));
const DentgoChat = lazy(() => import("../pages/DentgoChat"));
const History = lazy(() => import("../pages/History"));
const Notification = lazy(() => import("../pages/Notification"));
const NotificationSetting = lazy(() => import("../pages/NotificationSetting"));
const Currency = lazy(() => import("../pages/Currency"));
const TermsAndPrivacy = lazy(() => import("../pages/TermsAndPrivacy"));
const ContactUs = lazy(() => import("../pages/ContactUs"));
const DeleteAccount = lazy(() => import("../pages/Delete"));
const Alert = lazy(() => import("../pages/Alert"));
const Confirmation = lazy(() => import("../pages/Confirmation"));
const ConfirmPaymentPin = lazy(() => import("../pages/ConfirmPaymentPin"));
export default function RoutesConfig() {
    useEffect(() => {
        console.log("[Lifecycle] routes.tsx → RoutesConfig rendered");
    }, []);
    const renderRoutes = (list) => list.map(({ path, element, children, index }, i) => 
    // The comma operator here logs first, then returns the <Route> element:
    (console.log(`[Routing] Adding route #${i}: path="${path ?? "(index)"}"`),
        _jsx(Route, { path: path, element: element, index: index, children: children ? renderRoutes(children) : null }, i)));
    const routes = [
        // PUBLIC
        {
            element: _jsx(PublicLayout, {}),
            children: [
                { index: true, element: _jsx(Splash, {}) },
                { path: "login", element: _jsx(Login, {}) },
                { path: "allow-push", element: _jsx(NotificationAllow, {}) },
            ],
        },
        // AUTHENTICATED
        {
            element: (_jsx(RequireAuth, { children: _jsx(RootLayout, {}) })),
            children: [
                {
                    element: _jsx(DashboardLayout, {}), // adds SideMenu + padding
                    children: [
                        // core app
                        { path: "dentgo-gpt-home", element: _jsx(DentgoGptHome, {}) },
                        { path: "dentgo-chat", element: _jsx(DentgoChat, {}) },
                        { path: "history", element: _jsx(History, {}) },
                        { path: "notification", element: _jsx(Notification, {}) },
                        { path: "notification-setting", element: _jsx(NotificationSetting, {}) },
                        { path: "currency", element: _jsx(Currency, {}) },
                        { path: "terms-and-privacy", element: _jsx(TermsAndPrivacy, {}) },
                        { path: "contact-us", element: _jsx(ContactUs, {}) },
                        { path: "delete", element: _jsx(DeleteAccount, {}) },
                        // feature modules (payment routes live under src/modules/payments)
                        ...paymentRoutes,
                    ],
                },
            ],
        },
        // STANDALONE (accessible without menu)
        { path: "alert", element: _jsx(Alert, {}) },
        { path: "confirmation", element: _jsx(Confirmation, {}) },
        { path: "confirm-payment-pin", element: _jsx(ConfirmPaymentPin, {}) },
    ];
    return _jsx(Routes, { children: renderRoutes(routes) });
}
