import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/PlusSubscription.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@components/ui/Loader";
// Simulated API call to fetch subscription details
const fetchSubscription = async () => {
    return new Promise((resolve) => setTimeout(() => resolve({ tier: "Plus", expires: "2025-01-31" }), 800));
};
const PlusSubscription = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState(null);
    useEffect(() => {
        let isMounted = true;
        fetchSubscription()
            .then((data) => {
            if (isMounted)
                setSubscription(data);
        })
            .catch((err) => console.error("Failed to fetch subscription:", err))
            .finally(() => {
            if (isMounted)
                setLoading(false);
        });
        return () => {
            isMounted = false;
        };
    }, []);
    const handleSubscribe = () => {
        navigate("/subscription-payment");
    };
    if (loading) {
        return _jsx(Loader, { fullscreen: true });
    }
    return (_jsx("div", { className: "bg-gray-100 dark:bg-gray-900 min-h-screen pb-4 flex flex-col", children: _jsx("div", { className: "mx-auto max-w-lg px-4", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 mt-5 rounded-t-3xl pt-4 px-4 flex flex-col h-[calc(100vh-90px)] overflow-y-auto", children: [_jsxs("div", { className: "flex flex-col flex-1", children: [_jsx("h2", { className: "text-gray-800 dark:text-gray-100 text-3xl font-bold leading-10 pt-2 pb-4", children: "Dentgo Plus" }), subscription && (_jsxs("div", { className: "mb-6", children: [_jsxs("p", { className: "text-gray-700 dark:text-gray-300 text-lg", children: ["Tier: ", _jsx("span", { className: "font-semibold", children: subscription.tier })] }), _jsxs("p", { className: "text-gray-700 dark:text-gray-300 text-lg", children: ["Expires: ", _jsx("span", { className: "font-semibold", children: subscription.expires })] })] })), _jsxs("div", { className: "space-y-6 flex-1", children: [_jsx(Feature, { iconColor: "#FF484D", title: "Premium Dental AI Tools", description: "Get access to advanced diagnosis, tailored treatment plans, and early beta features." }), _jsx(Feature, { iconColor: "#FF484D", title: "Priority Access", description: "Enjoy uninterrupted access even when demand is high \u2014 no queues or wait times." }), _jsx(Feature, { iconColor: "#FF484D", title: "Faster Results", description: "Get up to 10 detailed AI responses per hour \u2014 ideal for busy dental clinics." })] })] }), _jsxs("div", { className: "mt-auto flex flex-col items-center pb-6", children: [_jsx("p", { className: "text-gray-500 dark:text-gray-400 text-lg leading-6 pb-6 text-center", children: "Auto-renews at $25/month. Cancel anytime." }), _jsx("div", { className: "fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-xs py-4 bg-white dark:bg-gray-700 text-blue-600 dark:text-primary text-lg font-medium rounded-xl text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-gray-600 transition", onClick: handleSubscribe, children: _jsx(Link, { to: "/subscription-payment", children: "Subscribe Now" }) })] })] }) }) }));
};
const Feature = ({ iconColor, title, description }) => (_jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "30", height: "30", viewBox: "0 0 30 30", fill: "none", className: "text-red-500", children: _jsx("path", { d: "M16.25 3.75V12.5H23.75L13.75 26.25V17.5H6.25L16.25 3.75Z", stroke: iconColor, strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-gray-800 dark:text-gray-100 text-2xl font-bold leading-7 pb-1", children: title }), _jsx("p", { className: "text-gray-500 dark:text-gray-400 text-lg leading-6", children: description })] })] }));
export default PlusSubscription;
