import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/History.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "@components/ui/Loader";
import chatMenuImg from "../assets/images/chat-menu-img.png";
import { fetchChatSessions } from "../api/chats";
export default function History() {
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchChatSessions()
            .then((data) => setSessions(data))
            .catch((err) => setError(err.message || "Failed to load history"))
            .finally(() => setLoading(false));
    }, []);
    if (loading) {
        return _jsx(Loader, { fullscreen: true });
    }
    if (error) {
        return (_jsx("div", { className: "bg-gray-100 dark:bg-gray-900 min-h-screen pb-4 flex flex-col", children: _jsx("div", { className: "mx-auto max-w-lg px-4", children: _jsxs("h2", { className: "text-red-500 text-base font-medium mt-10", children: ["Error: ", error] }) }) }));
    }
    const renderList = (items, isEnded) => items.map((s) => (_jsxs(Link, { to: `/dentgo-chat?sessionId=${s.id}`, className: "flex items-center mb-4", children: [_jsx("img", { src: chatMenuImg, alt: "Chat icon", className: "w-6 h-6 mr-3" }), _jsxs("div", { children: [_jsx("h3", { className: "text-gray-800 dark:text-gray-200 text-base font-bold leading-6 pb-1", children: s.title ?? `Chat #${s.id}` }), _jsx("p", { className: "text-gray-500 dark:text-gray-400 text-sm leading-5", children: isEnded
                            ? `Ended ${new Date(s.endedAt).toLocaleString()}`
                            : `Started ${new Date(s.startedAt).toLocaleString()}` })] })] }, s.id)));
    const active = sessions.filter((s) => !s.endedAt);
    const ended = sessions.filter((s) => !!s.endedAt);
    return (_jsx("div", { className: "bg-gray-100 dark:bg-gray-900 min-h-screen pb-4 flex flex-col", children: _jsx("div", { className: "mx-auto max-w-lg px-4", children: _jsx("div", { className: "bg-white dark:bg-gray-800 mt-5 rounded-t-3xl px-4 flex flex-col h-[calc(100vh-90px)] overflow-y-auto", children: _jsxs("div", { className: "pt-4", children: [_jsx("h2", { className: "text-gray-800 dark:text-gray-100 text-xl font-semibold leading-7", children: "Active Chats" }), active.length > 0 ? (renderList(active, false)) : (_jsx("p", { className: "text-gray-500 dark:text-gray-400 text-sm leading-5 mb-4", children: "No active chats." })), _jsx("h2", { className: "text-gray-800 dark:text-gray-100 text-xl font-semibold leading-7 pt-6", children: "Ended Chats" }), ended.length > 0 ? (renderList(ended, true)) : (_jsx("p", { className: "text-gray-500 dark:text-gray-400 text-sm leading-5", children: "No ended chats." }))] }) }) }) }));
}
