'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Varsayılan seçenekler
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            borderRadius: '0.75rem',
            border: '1px solid rgba(250, 204, 21, 0.2)',
            padding: '16px',
            fontSize: '0.875rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          // Başarılı bildirimlerin stili
          success: {
            duration: 3000,
            style: {
              background: '#1f2937',
              border: '1px solid rgba(34, 197, 94, 0.5)',
            },
            iconTheme: {
              primary: '#22c55e',
              secondary: '#1f2937',
            },
          },
          // Hata bildirimlerin stili
          error: {
            duration: 4000,
            style: {
              background: '#1f2937',
              border: '1px solid rgba(239, 68, 68, 0.5)',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#1f2937',
            },
          },
          // Yükleme bildirimlerin stili
          loading: {
            style: {
              background: '#1f2937',
              border: '1px solid rgba(250, 204, 21, 0.5)',
            },
            iconTheme: {
              primary: '#facc15',
              secondary: '#1f2937',
            },
          },
        }}
      />
    </SessionProvider>
  );
}
