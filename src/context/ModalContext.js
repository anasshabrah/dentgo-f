import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/context/ModalContext.tsx
import { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";
const Ctx = createContext(null);
export const ModalProvider = ({ children }) => {
    const [node, setNode] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback((content) => {
        setNode(content);
        setIsOpen(true);
    }, []);
    const close = useCallback(() => {
        setIsOpen(false);
        // Optionally, delay clearing node until animation completes
        setTimeout(() => setNode(null), 300);
    }, []);
    return (_jsxs(Ctx.Provider, { value: { isOpen, open, close }, children: [children, isOpen && node &&
                createPortal(_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", children: node }), document.body)] }));
};
export const useModal = () => {
    const ctx = useContext(Ctx);
    if (!ctx)
        throw new Error("useModal must be used within ModalProvider");
    return ctx;
};
