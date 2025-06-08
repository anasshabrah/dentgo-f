import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/DentgoGptHome.tsx
import { useEffect, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import plusRobot from "../assets/images/plus-robort.png";
import { useAuth } from "@context/AuthContext";
import Loader from "@components/ui/Loader";
import SideMenu from "@components/SideMenu";
const DentgoGptHome = () => {
    const navigate = useNavigate();
    const { isAuthenticated, initializing } = useAuth();
    const [isVisible, setIsVisible] = useState(false);
    // 1) While auth is initializing, show a loader
    if (initializing) {
        return _jsx(Loader, {});
    }
    // 2) If not authenticated, redirect to login
    if (!isAuthenticated) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // 3) Remove any lingering Bootstrap backdrops (cleanup)
    useEffect(() => {
        const backdrop = document.querySelector(".offcanvas-backdrop.show");
        if (backdrop) {
            backdrop.remove();
            document.body.classList.remove("offcanvas-backdrop", "modal-open");
        }
    }, []);
    // Handlers
    const handlePlusSubscription = () => {
        navigate("/plus-subscription");
    };
    const handleStartChat = () => {
        navigate("/dentgo-chat");
    };
    const hidePopup = (e) => {
        e.preventDefault();
        setIsVisible(false);
    };
    return (_jsxs("div", { className: "bg-gray-100 min-h-screen flex flex-col font-sans", children: [_jsx("main", { className: "flex-1 bg-gray-100", children: _jsxs("div", { className: "mx-auto max-w-lg px-4", children: [_jsx("section", { className: "mt-6 bg-white rounded-xl shadow-md overflow-hidden", "aria-labelledby": "dentgo-plus-title", children: _jsxs("div", { className: "flex flex-col sm:flex-row", children: [_jsxs("div", { className: "flex-1 p-6 space-y-2", children: [_jsx("h2", { id: "dentgo-plus-title", className: "text-2xl font-semibold text-gray-800", children: "Dentgo Plus" }), _jsx("p", { className: "text-gray-500 text-base", children: "Unlock Dentgo premium to access all features." }), _jsx("button", { onClick: handlePlusSubscription, className: "mt-4 inline-flex items-center justify-center bg-primary text-white font-medium text-base rounded-lg px-4 py-3 shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition", "aria-label": "Upgrade to Dentgo Plus", children: "Upgrade" })] }), _jsx("div", { className: "flex-1", children: _jsx("img", { src: plusRobot, alt: "Dentgo Plus robot illustration", className: "w-full h-auto object-cover" }) })] }) }), _jsx("div", { className: "mt-8 flex justify-center", children: _jsx("button", { onClick: handleStartChat, className: "w-full bg-primary text-white font-medium text-lg rounded-xl py-4 shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition", "aria-label": "Start chat with Dentgo", children: "Start Chat with Dentgo" }) })] }) }), _jsx(SideMenu, {}), isVisible && (_jsxs(_Fragment, { children: [_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 z-50", onClick: hidePopup, "aria-hidden": "true" }), _jsxs("div", { className: "fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg bg-white rounded-t-3xl z-60 p-6 shadow-lg", children: [_jsx("button", { onClick: hidePopup, className: "absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50", "aria-label": "Close popup", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M6 18L18 6M6 6l12 12" }) }) }), _jsxs("div", { className: "text-center pt-4", children: [_jsx("img", { src: logo, alt: "Dentgo AI Logo", className: "mx-auto w-24 h-24" }), _jsx("h3", { className: "text-gray-800 text-2xl font-semibold mt-4", children: "Dentgo AI Chatbot" }), _jsx("p", { className: "mt-2 text-gray-500 text-base leading-6 px-2", children: "Add the Dentgo Dental AI Assistant to your home screen for fast, seamless access\u2014just like a regular app." }), _jsx("div", { className: "mt-6 flex justify-center", children: _jsxs("button", { className: "inline-flex items-center bg-primary text-white text-lg font-medium py-3 px-6 rounded-lg shadow hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition", "aria-label": "Add Home Screen", children: ["Add Home Screen", _jsx("span", { className: "ml-2", children: "\u2794" })] }) })] })] })] }))] }));
};
export default DentgoGptHome;
