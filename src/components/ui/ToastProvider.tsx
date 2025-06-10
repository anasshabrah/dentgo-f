// src/components/ui/ToastProvider.tsx
import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { Transition } from '@headlessui/react';

interface Toast {
  id: number;
  message: string;
  type: 'error' | 'success' | 'info';
}

interface ToastContextValue {
  addToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const isMounted = useRef(true);
  const timeouts = useRef<Record<number, number>>({});

  useEffect(() => {
    return () => {
      isMounted.current = false;
      Object.values(timeouts.current).forEach(clearTimeout);
    };
  }, []);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now();
    if (!isMounted.current) return;
    setToasts((prev) => [...prev, { id, message, type }]);
    const timer = window.setTimeout(() => {
      if (isMounted.current) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }
      delete timeouts.current[id];
    }, 4000);
    timeouts.current[id] = timer;
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(({ id, message, type }) => (
          <Transition
            key={id}
            appear
            show
            as={React.Fragment}
            enter="transform transition duration-200"
            enterFrom="opacity-0 translate-y-2"
            enterTo="opacity-100 translate-y-0"
            leave="transform transition duration-200"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-2"
          >
            <div
              className={`px-4 py-2 rounded shadow text-white bg-${
                type === 'error'
                  ? 'red-600'
                  : type === 'success'
                  ? 'green-600'
                  : 'gray-700'
              }`}
            >
              {message}
            </div>
          </Transition>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
