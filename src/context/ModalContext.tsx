// src/context/ModalContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
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
  const cleanupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback((content: React.ReactNode) => {
    if (cleanupTimer.current) {
      clearTimeout(cleanupTimer.current);
      cleanupTimer.current = null;
    }
    // Ensure fresh mount for animations
    const fresh =
      React.isValidElement(content) && content.key == null
        ? React.cloneElement(content, { key: Date.now() })
        : content;
    setNode(fresh);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    cleanupTimer.current = setTimeout(() => {
      setNode(null);
      cleanupTimer.current = null;
    }, 300); // match your transition duration
  }, []);

  return (
    <Ctx.Provider value={{ isOpen, open, close }}>
      {children}
      {isOpen && node &&
        createPortal(
          <div
            className="fixed inset-0 z-50"
            aria-modal="true"
            role="dialog"
          >
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
