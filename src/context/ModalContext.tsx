// src/context/ModalContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";

interface ModalCtx {
  /** Whether a modal is currently open */
  isOpen: boolean;
  /** Open a modal with the given React node content */
  open: (content: React.ReactNode) => void;
  /** Close the currently open modal */
  close: () => void;
}

const ModalContext = createContext<ModalCtx | null>(null);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [node, setNode] = useState<React.ReactNode | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const cleanupTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = useCallback((content: React.ReactNode) => {
    // Clear any pending cleanup to allow re-opening quickly
    if (cleanupTimer.current) {
      clearTimeout(cleanupTimer.current);
      cleanupTimer.current = null;
    }

    // Force a fresh mount key so animations restart
    const fresh =
      React.isValidElement(content) && content.key == null
        ? React.cloneElement(content, { key: Date.now() })
        : content;

    setNode(fresh);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    // Delay unmount until any exit animations complete
    cleanupTimer.current = setTimeout(() => {
      setNode(null);
      cleanupTimer.current = null;
    }, 300);
  }, []);

  return (
    <ModalContext.Provider value={{ isOpen, open, close }}>
      {children}
      {/* Render the modal content directly without an extra wrapper */}
      {isOpen && node && createPortal(node, document.body)}
    </ModalContext.Provider>
  );
};

/**
 * Hook to access the modal context
 * @throws if used outside of ModalProvider
 */
export const useModal = (): ModalCtx => {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return ctx;
};
