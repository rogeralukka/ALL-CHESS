import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { create } from 'zustand';
import { X, Trophy, Info, AlertTriangle, CheckCircle } from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  subtitle?: string;
  type?: 'success' | 'achievement' | 'info' | 'warning';
  duration?: number;
}

interface ToastStore {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));
    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (title: string, subtitle?: string) =>
    useToastStore.getState().addToast({ title, subtitle, type: 'success' }),
  achievement: (title: string, subtitle?: string) =>
    useToastStore.getState().addToast({ title, subtitle, type: 'achievement' }),
  info: (title: string, subtitle?: string) =>
    useToastStore.getState().addToast({ title, subtitle, type: 'info' }),
  warning: (title: string, subtitle?: string) =>
    useToastStore.getState().addToast({ title, subtitle, type: 'warning' }),
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  const getIcon = (type?: ToastItem['type']) => {
    switch (type) {
      case 'achievement':
        return <Trophy className="text-amber-500" size={20} />;
      case 'success':
        return <CheckCircle className="text-emerald-500" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-orange-500" size={20} />;
      default:
        return <Info className="text-sky-500" size={20} />;
    }
  };

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-2"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
            className="pointer-events-auto flex items-start gap-3 p-3.5 bg-theme-card border border-theme-border rounded-lg shadow-xl"
          >
            <div className="flex-shrink-0 mt-0.5">{getIcon(t.type)}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-theme-text">{t.title}</h4>
              {t.subtitle && (
                <p className="text-xs text-theme-muted mt-0.5 leading-snug">
                  {t.subtitle}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => removeToast(t.id)}
              className="text-theme-muted hover:text-theme-text p-0.5 rounded transition-colors"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
