import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/DentgoChat.tsx
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { askDentgo } from "../api/chat";
import { fetchChatSession, endChatSession } from "../api/chats";
import Loader from "@components/ui/Loader";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle";
// Detect Arabic characters for RTL support
function isRTL(text) {
    return /[\u0600-\u06FF]/.test(text);
}
function MessageBubble({ text, type, }) {
    const rtl = isRTL(text);
    return (_jsx("div", { className: `my-3 max-w-[80%] p-3 text-sm leading-5 font-sans rounded-2xl ${type === "personal"
            ? `float-right bg-primary text-white ${rtl ? "text-right" : "text-left"} rounded-br`
            : `float-left bg-primary/10 text-primary ${rtl ? "text-right" : "text-left"} rounded-bl`}`, style: { direction: rtl ? "rtl" : "ltr" }, "aria-label": type === "personal" ? "Your message" : "Bot response", children: _jsx(ReactMarkdown, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSanitize], children: text }) }));
}
const DentgoChat = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isThinking, setThinking] = useState(false);
    const historyRef = useRef([]);
    const containerRef = useRef(null);
    const [sessionId, setSessionId] = useState(null);
    // Load chat session if sessionId is in URL
    useEffect(() => {
        const params = new URLSearchParams(search);
        const sid = params.has("sessionId") ? Number(params.get("sessionId")) : null;
        if (sid) {
            setSessionId(sid);
            fetchChatSession(sid)
                .then((session) => {
                const msgs = session.messages.map((m) => ({
                    text: m.content,
                    type: m.role === "USER" ? "personal" : "bot",
                }));
                setMessages(msgs);
                historyRef.current = msgs.map((m) => ({
                    role: m.type === "personal" ? "user" : "assistant",
                    text: m.text,
                }));
            })
                .catch(() => { })
                .finally(() => setLoading(false));
        }
        else {
            setLoading(false);
        }
    }, [search]);
    // Scroll to bottom
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: containerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, isThinking]);
    // Show greeting if new session
    useEffect(() => {
        if (!loading && sessionId === null) {
            const greeting = "Hey, I'm Dentgo 😊 How can I assist with your dental cases today?";
            setMessages([{ text: greeting, type: "bot" }]);
            historyRef.current = [{ role: "assistant", text: greeting }];
        }
    }, [loading, sessionId]);
    // Send a message
    const send = async () => {
        const prompt = input.trim();
        if (!prompt || isThinking)
            return;
        setMessages((prev) => [...prev, { text: prompt, type: "personal" }]);
        historyRef.current.push({ role: "user", text: prompt });
        setInput("");
        setThinking(true);
        try {
            const { sessionId: newSid, answer } = await askDentgo(prompt, historyRef.current.slice(0, -1), sessionId);
            if (!sessionId) {
                setSessionId(newSid);
                navigate(`?sessionId=${newSid}`, { replace: true });
            }
            setMessages((prev) => [...prev, { text: answer, type: "bot" }]);
            historyRef.current.push({ role: "assistant", text: answer });
        }
        catch (err) {
            setMessages((prev) => [
                ...prev,
                { text: `❌ ${err.message || "Something went wrong."}`, type: "bot" },
            ]);
        }
        finally {
            setThinking(false);
        }
    };
    if (loading)
        return _jsx(Loader, {});
    return (_jsxs("div", { className: "bg-gray-100 min-h-screen pb-4 flex flex-col font-sans", children: [_jsx("div", { className: "mx-auto max-w-lg px-4 flex-1 flex flex-col", children: _jsx("div", { className: "bg-white mt-5 rounded-t-2xl pt-3 px-4 flex flex-col flex-1 shadow-md", children: _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx("div", { className: "flex-1 overflow-y-hidden relative", children: _jsxs("div", { className: "overflow-y-auto max-h-full pr-2", ref: containerRef, "aria-label": "Chat messages", children: [messages.map((m, idx) => (_jsx(MessageBubble, { ...m }, idx))), isThinking && (_jsx("div", { className: "italic text-gray-500 mt-2 bg-primary/10 text-primary rounded-2xl p-3 my-3 max-w-[80%] float-left", "aria-label": "Bot is typing", children: _jsx("em", { children: "Dentgo is typing\u2026" }) }))] }) }), _jsxs("div", { className: "flex gap-3 mt-2 pb-4", children: [_jsx("div", { className: "flex-1", children: _jsx("textarea", { className: "w-full h-12 p-2 rounded-lg border border-transparent bg-gray-100 text-base text-gray-500 resize-none focus:border-primary focus:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50 transition", placeholder: "Write here\u2026", value: input, onChange: (e) => setInput(e.target.value), onKeyDown: (e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    send();
                                                }
                                            }, "aria-label": "Type your message" }) }), _jsx("button", { className: "w-12 h-12 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition", onClick: send, disabled: isThinking, "aria-label": "Send message", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", fill: "currentColor", viewBox: "0 0 24 24", className: "fill-current", "aria-hidden": "true", children: _jsx("path", { d: "M2 21l21-9L2 3v7l15 2-15 2v7z" }) }) })] })] }) }) }), _jsx("div", { className: "modal fade", id: "end-session-modal", tabIndex: -1, "aria-labelledby": "endSessionModalLabel", "aria-hidden": "true", children: _jsx("div", { className: "modal-dialog modal-dialog-centered", children: _jsx("div", { className: "modal-content", children: _jsxs("div", { className: "modal-body text-center p-4", children: [_jsx("h2", { id: "endSessionModalLabel", className: "text-gray-800 text-2xl font-semibold mb-2", children: "End Session" }), _jsx("p", { className: "text-gray-500 text-base mb-4", children: "This session will be saved in history and can be retrieved anytime." }), _jsxs("div", { className: "flex justify-center gap-3", children: [_jsx("button", { className: "bg-primary text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition", onClick: async () => {
                                                if (sessionId) {
                                                    await endChatSession(sessionId);
                                                }
                                                const modalEl = document.getElementById("end-session-modal");
                                                if (modalEl) {
                                                    const bsModal = bootstrap.Modal.getInstance(modalEl);
                                                    if (bsModal)
                                                        bsModal.hide();
                                                }
                                                navigate("/dentgo-gpt-home");
                                            }, "aria-label": "Confirm end session", children: "Yes, End" }), _jsx("button", { className: "bg-gray-100 text-primary px-6 py-3 rounded-xl text-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition", "data-bs-dismiss": "modal", "aria-label": "Cancel end session", children: "Cancel" })] })] }) }) }) })] }));
};
export default DentgoChat;
