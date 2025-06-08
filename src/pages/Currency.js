import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/Currency.tsx
import { useEffect, useState } from "react";
import Loader from "@components/ui/Loader";
// Simulated API call to fetch conversion rate from USD to selected currency
const fetchRate = async (currency) => {
    return new Promise((resolve) => setTimeout(() => {
        // Fake rates for demonstration purposes
        const rates = {
            USD: 1, // USD → USD
            SAR: 3.75, // USD → SAR
            AED: 3.67, // USD → AED
            QAR: 3.64, // USD → QAR
            EGP: 30.90, // USD → EGP
        };
        resolve(rates[currency] ?? 1);
    }, 700));
};
const Currency = () => {
    const [loading, setLoading] = useState(true);
    const [selectedCurrency, setSelectedCurrency] = useState("USD");
    const [rate, setRate] = useState(null);
    const [fetchError, setFetchError] = useState("");
    // Fetch the rate whenever selectedCurrency changes
    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setFetchError("");
        fetchRate(selectedCurrency)
            .then((data) => {
            if (isMounted) {
                setRate(data);
            }
        })
            .catch((err) => {
            console.error("Failed to fetch rate:", err);
            if (isMounted) {
                setFetchError("Unable to load conversion rate.");
            }
        })
            .finally(() => {
            if (isMounted) {
                setLoading(false);
            }
        });
        return () => {
            isMounted = false;
        };
    }, [selectedCurrency]);
    // Initial delay loader if needed (for mounting)
    useEffect(() => {
        // No-op: main loader is tied to fetching the rate
    }, []);
    if (loading) {
        return _jsx(Loader, { fullscreen: true });
    }
    return (_jsx("div", { className: "bg-white dark:bg-gray-900 min-h-screen pb-4 flex flex-col", children: _jsx("div", { className: "mx-auto max-w-lg px-4", children: _jsxs("div", { className: "bg-blue-700 mt-5 rounded-t-3xl pt-4 px-4 flex flex-col items-stretch h-[calc(100vh-90px)] overflow-y-auto", children: [[
                        { code: "USD", label: "USD" },
                        { code: "SAR", label: "SAR" },
                        { code: "AED", label: "AED" },
                        { code: "QAR", label: "QAR" },
                        { code: "EGP", label: "EGP" },
                    ].map(({ code, label }) => (_jsxs("div", { className: "peer flex items-center gap-3 rounded border border-gray-200 dark:border-gray-700 p-3 mb-4", children: [_jsx("input", { type: "radio", name: "currency", id: `currency-${code.toLowerCase()}`, className: "peer sr-only", checked: selectedCurrency === code, onChange: () => setSelectedCurrency(code) }), _jsxs("label", { htmlFor: `currency-${code.toLowerCase()}`, className: "flex items-center gap-2 cursor-pointer text-gray-900 dark:text-gray-100 text-base font-medium peer-checked:bg-gray-900 dark:peer-checked:bg-gray-100 peer-checked:text-white dark:peer-checked:text-gray-900 peer-checked:rounded p-2 w-full", children: [_jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", className: "stroke-current", children: _jsx("path", { d: "M8.5 14.6667C8.5 15.9553 9.54467 17 10.8333 17H13C14.3807 17 15.5 15.8807 15.5 14.5C15.5 13.1193 14.3807 12 13 12H11C9.61929 12 8.5 10.8807 8.5 9.5C8.5 8.11929 9.61929 7 11 7H13.1667C14.4553 7 15.5 8.04467 15.5 9.33333M12 5.5V7M12 17V18.5M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }) }), label] })] }, code))), _jsxs("div", { className: "mt-4 px-2", children: [_jsxs("h2", { className: "text-gray-200 dark:text-gray-300 text-xl font-semibold mb-2", children: ["USD \u2192 ", selectedCurrency, " Rate"] }), fetchError ? (_jsx("p", { className: "text-red-400 text-sm", children: fetchError })) : (_jsx("p", { className: "text-gray-100 dark:text-gray-100 text-lg", children: rate !== null ? rate.toFixed(2) : "N/A" }))] })] }) }) }));
};
export default Currency;
