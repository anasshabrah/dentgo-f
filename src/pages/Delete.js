import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Delete.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "@components/ui/Loader";
const Delete = () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);
    if (loading) {
        return _jsx(Loader, { fullscreen: true });
    }
    return (_jsx("div", { className: "bg-white dark:bg-gray-900 min-h-screen pb-4 flex flex-col", children: _jsx("div", { className: "mx-auto max-w-lg px-4", children: _jsxs("div", { className: "bg-blue-700 dark:bg-gray-800 mt-5 rounded-t-3xl pt-4 px-4 flex flex-col items-stretch overflow-y-auto", children: [_jsx("h2", { className: "text-gray-900 dark:text-gray-200 text-lg font-semibold leading-6 pt-6", children: "Why are you leaving PayFast?" }), _jsx("p", { className: "text-gray-500 dark:text-gray-400 text-sm font-medium leading-5 pb-6", children: "We\u2019re sorry to see you go! Authentication and account control are now handled via secure login." }), _jsxs("p", { className: "text-gray-500 dark:text-gray-400 text-sm font-medium leading-5 pt-6 mb-9", children: ["Tapping \u201CDelete Account\u201D will redirect you to the centralized login to manage or confirm deletion.", " ", _jsx("span", { className: "text-gray-900 dark:text-gray-200", children: "Jessica Smith." })] }), _jsx("div", { className: "flex flex-col items-center justify-center pb-6", children: _jsx(Link, { to: "/login", className: "w-full py-4 bg-blue-100 dark:bg-gray-700 text-blue-800 dark:text-primary text-lg font-medium rounded-xl flex justify-center items-center hover:bg-blue-200 dark:hover:bg-gray-600 transition", children: "Delete Account" }) })] }) }) }));
};
export default Delete;
