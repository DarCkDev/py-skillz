import { useState } from 'react';

export interface ToastProps {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

interface Toast extends ToastProps {
  id: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(7);
    const newToast = { ...props, id };
    setToasts((prev) => [...prev, newToast]);

    // Remove toast after 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  return { toast, toasts };
} 