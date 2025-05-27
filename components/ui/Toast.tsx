
import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

export enum ToastType {
  Success = 'success',
  Error = 'error',
  Info = 'info',
  Warning = 'warning',
}

interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onDismiss: (id: string) => void;
}

const ToastIcons = {
  [ToastType.Success]: <CheckCircle className="text-green-500" size={20} />,
  [ToastType.Error]: <AlertTriangle className="text-red-500" size={20} />,
  [ToastType.Info]: <Info className="text-blue-500" size={20} />,
  [ToastType.Warning]: <AlertTriangle className="text-yellow-500" size={20} />,
};

const ToastColors = {
  [ToastType.Success]: 'bg-green-50 dark:bg-green-900 border-green-500',
  [ToastType.Error]: 'bg-red-50 dark:bg-red-900 border-red-500',
  [ToastType.Info]: 'bg-blue-50 dark:bg-blue-900 border-blue-500',
  [ToastType.Warning]: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-500',
};

const Toast: React.FC<ToastProps> = ({ id, message, type, duration = 5000, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(id);
    }, duration);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, duration, onDismiss]);

  return (
    <div
      className={`max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden p-4 my-2
                  border-l-4 ${ToastColors[type]} animate-fade-in flex items-start space-x-3`}
    >
      <div className="flex-shrink-0">{ToastIcons[type]}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-dark dark:text-neutral-light">{message}</p>
      </div>
      <button
        onClick={() => onDismiss(id)}
        className="text-neutral-DEFAULT hover:text-neutral-dark dark:text-neutral-light dark:hover:text-white"
      >
        <X size={18} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<Omit<ToastProps, 'onDismiss'>>;
  dismissToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, dismissToast }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={dismissToast} />
      ))}
    </div>
  );
};

// Hook for managing toasts - to be used in App.tsx or a context
// Example: const { toasts, addToast, dismissToast } = useToasts();
export const useToasts = () => {
  const [toasts, setToasts] = useState<Array<Omit<ToastProps, 'onDismiss'>>>([]);

  const addToast = (message: string, type: ToastType, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, type, duration }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return { toasts, addToast, dismissToast };
};

export default Toast;
    