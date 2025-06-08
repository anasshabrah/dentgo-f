import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from "react-router-dom";
import { endChatSession } from "../../api/chats";
import { useModal } from "@context/ModalContext";
export default function EndSessionModal({ sessionId }) {
    const navigate = useNavigate();
    const { close } = useModal();
    return (_jsxs("div", { className: "bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-sm", children: [_jsx("h2", { className: "text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100", children: "End Session" }), _jsx("p", { className: "text-gray-600 dark:text-gray-300 mb-6", children: "This chat will be saved in your history." }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { className: "px-4 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100", onClick: close, children: "Cancel" }), _jsx("button", { className: "px-4 py-2 rounded bg-primary text-white", onClick: async () => {
                            if (sessionId)
                                await endChatSession(sessionId);
                            close();
                            navigate("/dentgo-gpt-home");
                        }, children: "Yes, End" })] })] }));
}
