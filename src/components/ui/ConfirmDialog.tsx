'use client';

import { ReactNode } from 'react';
import Button from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'primary';
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  variant = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getVariantColors = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-600',
          bg: 'bg-red-100',
          button: 'danger' as const,
        };
      case 'warning':
        return {
          icon: 'text-yellow-600',
          bg: 'bg-yellow-100',
          button: 'primary' as const,
        };
      case 'primary':
        return {
          icon: 'text-blue-600',
          bg: 'bg-blue-100',
          button: 'primary' as const,
        };
    }
  };

  const colors = getVariantColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-full ${colors.bg} flex items-center justify-center mx-auto mb-4`}>
          <svg
            className={`w-7 h-7 ${colors.icon}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {variant === 'danger' && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            )}
            {variant === 'warning' && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            )}
            {variant === 'primary' && (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            )}
          </svg>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <div className="text-gray-600 text-sm">{message}</div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            {cancelText}
          </Button>
          <Button
            variant={colors.button}
            onClick={handleConfirm}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
