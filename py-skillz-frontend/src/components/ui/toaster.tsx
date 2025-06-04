import React from 'react';

interface Toast {
  id: string;
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

interface ToasterProps {
  toasts?: Toast[];
}

export function Toaster({ toasts = [] }: ToasterProps) {
  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`p-4 rounded-lg shadow-lg ${
            toast.variant === 'destructive' ? 'bg-red-500' : 'bg-white'
          }`}
        >
          <h3 className="font-semibold">{toast.title}</h3>
          <p className="text-sm">{toast.description}</p>
        </div>
      ))}
    </div>
  );
} 