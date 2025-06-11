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
    // Cancel any scheduled cleanup from previous modal
    if (cleanupTimer.current) {
      clearTimeout(cleanupTimer.current);
      cleanupTimer.current = null;
    }

    // Force React to remount modal to reset animations/states
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
    }, 300); // This should match your modal transition duration
  }, []);

  return (
    <Ctx.Provider value={{ isOpen, open, close }}>
      {children}
      {isOpen && node &&
        createPortal(
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
