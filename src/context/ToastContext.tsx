"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type Toast = {
  id: number;
  message: string;
};

type ToastContextType = {
  showToast: (message: string) => void;
};

const ToastContext =
  createContext<ToastContextType | null>(null);

export function ToastProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function showToast(message: string) {
    const id = Date.now();

    setToasts((current) => [
      ...current,
      { id, message },
    ]);

    setTimeout(() => {
      setToasts((current) =>
        current.filter(
          (toast) => toast.id !== id
        )
      );
    }, 4000);
  }

  return (
    <ToastContext.Provider
      value={{ showToast }}
    >
      {children}

      <div className="fixed right-6 top-6 z-[9999] flex flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="
              rounded-xl
              bg-gray-900
              px-5
              py-4
              text-white
              shadow-xl
              animate-in
              fade-in
              slide-in-from-top-2
            "
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast debe usarse dentro de ToastProvider"
    );
  }

  return context;
}