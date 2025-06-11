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
  addToast: (toast: { message: string; type?: Toast['type'] }) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const isMounted = useRef(true);
  const timeouts = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    return () => {
      isMounted.current = false;
      const snapshot = timeouts.current;
      Object.values(snapshot).forEach(clearTimeout);
    };
  }, []);

  const addToast = useCallback(({ message, type = 'info' }: { message: string; type?: Toast['type'] }) => {
    const id = Date.now();
    if (!isMounted.current) return;
    setToasts((prev) => [...prev, { id, message, type }]);
    const timer = setTimeout(() => {
      if (isMounted.current) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }
      delete timeouts.current[id];
    }, 4000);
    timeouts.current[id] = timer;
  }, []);

  const bgClassMap: Record<Toast['type'], string> = {
    error: 'bg-red-600',
    success: 'bg-green-600',
    info: 'bg-gray-700',
  };

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
            <div className={`px-4 py-2 rounded shadow text-white ${bgClassMap[type]}`}>
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
