import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/NotificationSetting.tsx
import { useEffect, useState } from "react";
import Loader from "@components/ui/Loader";
// Simulated API call to fetch notification settings
const fetchSettings = async () => {
    return new Promise((resolve) => setTimeout(() => resolve({
        email: true,
        sms: false,
        invoice: true,
        moneyRequest: false,
        moneySent: true,
        moneyReceived: false,
        purchase: true,
        qrPayment: false,
        directPayment: false,
        subscriptionInfo: true,
        announcements: false,
        appUpdates: false,
    }), 700));
};
const NotificationSetting = () => {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState(null);
    useEffect(() => {
        let isMounted = true;
        fetchSettings()
            .then((data) => {
            if (isMounted)
                setSettings(data);
        })
            .catch((err) => {
            console.error("Failed to load notification settings:", err);
        })
            .finally(() => {
            if (isMounted)
                setLoading(false);
        });
        return () => {
            isMounted = false;
        };
    }, []);
    if (loading || !settings) {
        return _jsx(Loader, { fullscreen: true });
    }
    const toggleSetting = (key) => {
        setSettings((prev) => {
            if (!prev)
                return prev;
            return { ...prev, [key]: !prev[key] };
        });
    };
    return (_jsx("div", { className: "bg-gray-100 dark:bg-gray-900 min-h-screen pb-4 flex flex-col", children: _jsx("div", { className: "mx-auto max-w-lg px-4", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 mt-5 rounded-t-3xl pt-6 px-4 flex flex-col space-y-4", children: [_jsx("h2", { className: "text-gray-800 dark:text-gray-100 text-[18px] font-semibold leading-[24px] text-center", children: "Notification Settings" }), [
                        { label: "Email Notifications", key: "email" },
                        { label: "SMS Notifications", key: "sms" },
                        { label: "Your invoices are paid", key: "invoice" },
                        { label: "Someone requests money from you", key: "moneyRequest" },
                        { label: "You send money to someone", key: "moneySent" },
                        { label: "You receive money from someone", key: "moneyReceived" },
                        { label: "You purchase something", key: "purchase" },
                        { label: "You receive a QR code payment", key: "qrPayment" },
                        { label: "You receive a direct payment", key: "directPayment" },
                        { label: "You receive subscriptions info", key: "subscriptionInfo" },
                        { label: "You receive announcements & offers", key: "announcements" },
                        { label: "You receive app updates info", key: "appUpdates" },
                    ].map(({ label, key }) => (_jsxs("div", { className: "flex items-center justify-between border-b border-gray-200 dark:border-gray-700 py-4", children: [_jsx("p", { className: "text-gray-800 dark:text-gray-100 text-[16px] font-medium", children: label }), _jsx("input", { type: "checkbox", checked: settings[key], onChange: () => toggleSetting(key), className: "h-5 w-5 text-primary focus:ring-2 focus:ring-primary/50 rounded", "aria-label": label })] }, key)))] }) }) }));
};
export default NotificationSetting;
