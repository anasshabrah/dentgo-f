import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/CancelSubscription.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@components/ui/Loader";
const CancelSubscription = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);
    if (loading)
        return _jsx(Loader, { fullscreen: true });
    return (_jsx("div", { className: "bg-white dark:bg-gray-900 min-h-screen pb-4 flex flex-col", children: _jsx("div", { className: "mx-auto max-w-lg px-4", children: _jsxs("div", { className: "bg-blue-700 pt-4 px-4 flex flex-col items-stretch mt-5 rounded-t-3xl h-[calc(100vh-90px)] overflow-y-auto", children: [_jsx("h2", { className: "text-white text-2xl font-semibold mb-6", children: "Dentgo GPT Plus" }), [
                        {
                            title: "Premium Features",
                            description: "Plus subscribers have access to Dentgo GPT Pro and our latest beta features.",
                            icon: (_jsx("path", { d: "M16.25 3.75V12.5H23.75L13.75 26.25V17.5H6.25L16.25 3.75Z", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round" })),
                        },
                        {
                            title: "Priority Access",
                            description: "You’ll be able to use Dentgo GPT even when demand is high.",
                            icon: (_jsx("path", { d: "M15 15C17.5 11.3 15 6.25 13.75 5C13.75 8.7975 11.5337 10.9263 10 12.5C8.4675 14.075 7.5 16.55 7.5 18.75C7.5 20.7391 8.29018 22.6468 9.6967 24.0533C11.1032 25.4598 13.0109 26.25 15 26.25C16.9891 26.25 18.8968 25.4598 20.3033 24.0533C21.7098 22.6468 22.5 20.7391 22.5 18.75C22.5 16.835 21.18 13.825 20 12.5C17.7675 16.25 16.5112 16.25 15 15Z", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round" })),
                        },
                        {
                            title: "Ultra Fast",
                            description: "Enjoy even faster response speeds when using Dentgo GPT Pro.",
                            icon: (_jsxs(_Fragment, { children: [_jsx("path", { d: "M7.04501 24.205C5.47168 22.6317 4.40023 20.6271 3.96616 18.4448C3.53209 16.2626 3.75488 14.0006 4.60637 11.9449C5.45786 9.88924 6.8998 8.13224 8.74985 6.89608C10.5999 5.65992 12.775 5.00012 15 5.00012C17.225 5.00012 19.4001 5.65992 21.2502 6.89608C23.1002 8.13224 24.5421 9.88924 25.3936 11.9449C26.2451 14.0006 26.4679 16.2626 26.0338 18.4448C25.5998 20.6271 24.5283 22.6317 22.955 24.205", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M20 11.25L15 16.25", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round" })] })),
                        },
                    ].map((feature, index) => (_jsxs("div", { className: "flex items-start gap-3 mb-6", children: [_jsx("svg", { className: "w-6 h-6 text-red-500", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 30 30", fill: "none", children: feature.icon }), _jsxs("div", { children: [_jsx("h3", { className: "text-white text-base font-semibold", children: feature.title }), _jsx("p", { className: "text-gray-300 text-sm", children: feature.description })] })] }, index))), _jsxs("div", { className: "mt-auto flex flex-col items-center", children: [_jsx("p", { className: "text-gray-300 text-sm mb-4 text-center", children: "Auto-renews for $25/month until canceled. Due date is 15 Dec 2024." }), _jsx(Link, { to: "/login", className: "w-full max-w-sm bg-white text-blue-700 text-lg font-medium rounded-xl py-4 text-center hover:bg-gray-100", children: "Cancel My Subscription" })] })] }) }) }));
};
export default CancelSubscription;
