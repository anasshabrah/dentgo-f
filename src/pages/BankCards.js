import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/BankCards.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@components/ui/Loader";
import { fetchCards } from "../api/cards";
const BankCards = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [cards, setCards] = useState([]);
    const [fetchError, setFetchError] = useState("");
    useEffect(() => {
        async function loadCards() {
            try {
                const fetchedCards = await fetchCards();
                setCards(fetchedCards);
            }
            catch (err) {
                console.error("Failed to fetch cards:", err);
                setFetchError("Unable to load saved cards.");
            }
            finally {
                setLoading(false);
            }
        }
        loadCards();
    }, []);
    if (loading)
        return _jsx(Loader, { fullscreen: true });
    return (_jsx("div", { className: "bg-white dark:bg-gray-900 min-h-screen pb-4 flex flex-col", children: _jsx("div", { className: "mx-auto max-w-lg px-4", children: _jsxs("div", { className: "bg-primary pt-4 px-4 flex flex-col items-stretch mt-5 rounded-t-3xl h-[calc(100vh-90px)] overflow-y-auto", children: [fetchError && (_jsx("div", { className: "text-sm p-2 border border-red-400 rounded bg-red-100 mb-3 text-red-600", children: fetchError })), cards.length > 0 ? (cards.map((card) => (_jsx(Link, { to: "/add-new-card", children: _jsx("div", { className: "border-b-2 border-gray-200 dark:border-gray-700 px-0", children: _jsxs("div", { className: "flex items-center gap-2 py-4 pr-8 cursor-pointer", children: [_jsx("span", { className: "w-8 h-8 flex items-center justify-center", children: _jsx("svg", { width: "32", height: "32", className: "text-blue-500 dark:text-primary", children: _jsx("circle", { cx: "16", cy: "16", r: "16", fill: "currentColor" }) }) }), _jsxs("div", { className: "pl-4", children: [_jsx("div", { className: "text-gray-800 dark:text-gray-200 text-base font-semibold leading-6", children: card.network || "Unknown Network" }), _jsxs("div", { className: "text-gray-500 dark:text-gray-400 text-sm font-medium leading-5", children: [_jsx("span", { className: card.isActive ? "text-blue-700" : "text-red-600", children: card.isActive ? "Active" : "Inactive" }), " ", "| Card Number **** ", card.last4] })] })] }) }) }, card.id)))) : (_jsx("p", { className: "text-gray-500 dark:text-gray-400 my-3 text-sm", children: "No saved cards found." })), _jsx("div", { className: "flex flex-col items-center justify-center mt-auto", children: _jsx(Link, { to: "/add-new-card", className: "fixed bottom-5 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-blue-100 dark:bg-gray-700 text-blue-700 dark:text-primary text-lg font-medium rounded-xl py-4 text-center hover:bg-blue-200 dark:hover:bg-gray-600", children: "+ Link a New Card" }) })] }) }) }));
};
export default BankCards;
