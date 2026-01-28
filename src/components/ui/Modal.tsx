'use client';

import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
}

export default function Modal({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showCloseButton = true 
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-6">
        {/* Backdrop with blur */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal */}
        <div 
          className={cn(
            'relative bg-white rounded-2xl shadow-2xl w-full transform transition-all animate-scale-in overflow-hidden',
            sizes[size]
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="relative bg-gradient-to-br from-gray-50 to-white px-6 sm:px-8 py-5 border-b border-gray-200">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl" />
              
              <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  {title && (
                    <h3 
                      id="modal-title"
                      className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
                    >
                      {title}
                    </h3>
                  )}
                </div>
                
                {showCloseButton && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="group relative rounded-xl p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Kapat"
                  >
                    <svg 
                      className="w-6 h-6 transform group-hover:rotate-90 transition-transform duration-200" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="px-6 sm:px-8 py-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
            {children}
          </div>

          {/* Bottom gradient fade effect */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in,
          .animate-scale-in {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
