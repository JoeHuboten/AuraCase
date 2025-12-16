'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { FiCheck, FiX, FiAlertCircle, FiInfo, FiShoppingCart, FiHeart } from 'react-icons/fi';

type ToastType = 'success' | 'error' | 'warning' | 'info' | 'cart' | 'wishlist';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case 'success':
      return <FiCheck className="w-5 h-5" />;
    case 'error':
      return <FiX className="w-5 h-5" />;
    case 'warning':
      return <FiAlertCircle className="w-5 h-5" />;
    case 'cart':
      return <FiShoppingCart className="w-5 h-5" />;
    case 'wishlist':
      return <FiHeart className="w-5 h-5" />;
    default:
      return <FiInfo className="w-5 h-5" />;
  }
};

const getToastStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400';
    case 'error':
      return 'bg-red-500/20 border-red-500/30 text-red-400';
    case 'warning':
      return 'bg-amber-500/20 border-amber-500/30 text-amber-400';
    case 'cart':
      return 'bg-accent/20 border-accent/30 text-accent-light';
    case 'wishlist':
      return 'bg-pink-500/20 border-pink-500/30 text-pink-400';
    default:
      return 'bg-accent/20 border-accent/30 text-accent-light';
  }
};

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-2xl border backdrop-blur-xl
        shadow-2xl shadow-black/20 animate-slide-in-right
        ${getToastStyles(toast.type)}
      `}
      style={{
        animation: 'slideInRight 0.3s ease-out, fadeOut 0.3s ease-in forwards',
        animationDelay: `0s, ${(toast.duration || 3000) - 300}ms`,
      }}
    >
      <div className="flex-shrink-0">
        <ToastIcon type={toast.type} />
      </div>
      <p className="text-sm font-medium text-white">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 ml-2 p-1 rounded-lg hover:bg-white/10 transition-colors"
      >
        <FiX className="w-4 h-4 text-white/60" />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { id, message, type, duration };
    
    setToasts((prev) => [...prev, newToast]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
      
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
            transform: translateX(50%);
          }
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
