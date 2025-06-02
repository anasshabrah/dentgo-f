import React, { createContext, useContext, useState, useCallback } from "react";
import { createPortal } from "react-dom";

interface ModalCtx {
  open: (content: React.ReactNode) => void;
  close: () => void;
}
const Ctx = createContext<ModalCtx | null>(null);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [node, setNode] = useState<React.ReactNode>(null);
  const open = useCallback((content: React.ReactNode) => setNode(content), []);
  const close = useCallback(() => setNode(null), []);

  return (
    <Ctx.Provider value={{ open, close }}>
      {children}
      {node && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          {node}
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