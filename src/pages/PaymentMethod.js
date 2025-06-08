import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/PaymentMethod.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "@components/ui/Loader";
import { StripeElements } from "../lib/stripeClient";
import { createPaymentRequest, createSetupIntent, PaymentRequestButtonElement, useStripe, } from "../lib/stripeClient";
import { fetchCards } from "../api/cards";
import { API_BASE } from "../config";
const PaymentMethodForm = () => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState([]);
    const [fetchError, setFetchError] = useState("");
    const [paymentRequest, setPaymentRequest] = useState(null);
    const [canMakePayment, setCanMakePayment] = useState(false);
    // Initial loading delay
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);
    // Fetch saved cards once loading is false
    useEffect(() => {
        if (loading)
            return;
        (async () => {
            try {
                const data = await fetchCards();
                setCards(data);
            }
            catch (err) {
                console.error("Failed to fetch saved cards:", err);
                setFetchError("Unable to load saved cards.");
            }
        })();
    }, [loading]);
    // Initialize PaymentRequest for Apple/Google Pay
    useEffect(() => {
        if (loading)
            return;
        (async () => {
            try {
                if (!stripe)
                    return;
                const pr = await createPaymentRequest({
                    country: "US",
                    currency: "usd",
                    total: { label: "Save Card", amount: 0 },
                    requestPayerEmail: true,
                    requestPayerName: true,
                });
                pr.on("paymentmethod", async (event) => {
                    try {
                        const clientSecret = await createSetupIntent();
                        const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, { payment_method: event.paymentMethod.id });
                        if (error || !setupIntent) {
                            event.complete("fail");
                            console.error("SetupIntent confirmation error:", error);
                            return;
                        }
                        const pmId = setupIntent.payment_method;
                        await fetch(`${API_BASE}/api/payments/cards`, {
                            method: "POST",
                            credentials: "include",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ paymentMethodId: pmId, nickName: null }),
                        });
                        event.complete("success");
                        const updated = await fetchCards();
                        setCards(updated);
                    }
                    catch (err) {
                        console.error("Error saving card via PaymentRequest:", err);
                        event.complete("fail");
                    }
                });
                const result = await pr.canMakePayment();
                if (result) {
                    setPaymentRequest(pr);
                    setCanMakePayment(true);
                }
            }
            catch (err) {
                console.error("PaymentRequest init error:", err);
            }
        })();
    }, [loading, stripe]);
    const handleAddNew = () => navigate("/add-new-card");
    if (loading)
        return _jsx(Loader, { fullscreen: true });
    return (_jsx("div", { className: "bg-gray-100 dark:bg-gray-900 min-h-screen pb-4 flex flex-col", children: _jsx("div", { className: "mx-auto max-w-lg px-4", children: _jsxs("div", { className: "bg-white dark:bg-gray-800 pt-4 px-4 mt-5 rounded-t-3xl h-[calc(100vh-90px)] overflow-y-auto flex flex-col", children: [canMakePayment && paymentRequest ? (_jsx("div", { className: "border-b-2 border-gray-200 dark:border-gray-700 mb-4", children: _jsx(PaymentRequestButtonElement, { options: { paymentRequest } }) })) : (_jsxs("div", { className: "border-b-2 border-gray-200 dark:border-gray-700 mb-4 px-2 py-4", children: [_jsx("p", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Apple Pay / Google Pay currently unavailable." }), _jsxs("small", { className: "block text-xs text-gray-500 dark:text-gray-400 mt-1", children: ["Ensure you\u2019re on Safari (Apple Pay) or Chrome (Google Pay), using HTTPS or localhost, and that", " ", _jsx("code", { children: "VITE_STRIPE_PUBLISHABLE_KEY" }), " is set."] })] })), fetchError && (_jsx("div", { className: "text-sm p-2 border border-red-600 rounded text-red-600 bg-red-100 mb-4", children: fetchError })), cards.length > 0 ? (_jsx("div", { className: "flex-1 overflow-y-auto", children: cards.map((card) => (_jsx("div", { className: "border-b-2 border-gray-200 dark:border-gray-700 px-0", children: _jsxs("div", { className: "flex items-center gap-2 py-4 pr-8", children: [_jsx("span", { className: "border border-gray-200 dark:border-gray-700 px-5 py-2 rounded flex items-center justify-center w-12 h-8", children: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "32", height: "20", viewBox: "0 0 32 20", fill: "none", children: [_jsx("rect", { width: "32", height: "20", rx: "3", fill: "#E0E0E0" }), _jsx("text", { x: "16", y: "13", textAnchor: "middle", fontSize: "10", fill: "#333", children: card.network })] }) }), _jsxs("div", { className: "pl-4", children: [_jsx("div", { className: "text-gray-800 dark:text-gray-200 text-base font-semibold leading-6", children: card.network }), _jsxs("div", { className: "text-gray-500 dark:text-gray-400 text-sm font-medium leading-5", children: [_jsx("span", { className: card.isActive
                                                            ? "text-blue-800 dark:text-primary"
                                                            : "text-red-600", children: card.isActive ? "Active" : "Inactive" }), " ", "| Card Number **** ", card.last4] })] })] }) }, card.id))) })) : (_jsx("p", { className: "text-gray-500 dark:text-gray-400 my-3 text-sm", children: "No saved cards found." })), _jsx("div", { className: "flex flex-col items-center justify-center mt-4", children: _jsx("div", { className: "w-full bg-blue-800 dark:bg-blue-700 text-white text-lg font-medium rounded-xl py-4 my-4 flex justify-center items-center hover:bg-blue-700 dark:hover:bg-blue-600 cursor-pointer transition", onClick: handleAddNew, children: "Add New Payment" }) })] }) }) }));
};
const PaymentMethod = () => (_jsx(StripeElements, { children: _jsx(PaymentMethodForm, {}) }));
export default PaymentMethod;
