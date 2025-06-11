// src/context/ModalContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";

interface ModalCtx {
  isOpen: boolean;
  open: (content: React.ReactNode) => void;
  close: () => void;
}

const Ctx = createContext<ModalCtx | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [node, setNode] = useState<React.ReactNode>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((content: React.ReactNode) => {
    setNode(content);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setNode(null), 300);
  }, []);

  return (
    <Ctx.Provider value={{ isOpen, open, close }}>
      {children}
      {isOpen && node &&
        createPortal(
          // Accessibility fix: allow modal to be focused by screen readers
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
          >
            <div className="pointer-events-auto">
              {node}
            </div>
          </div>,
          document.body
        )}
    </Ctx.Provider>
  );
};

export const useModal = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
};
