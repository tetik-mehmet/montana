'use client';

import { useEffect } from 'react';
import Button from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bir Hata Oluştu</h2>
          <p className="text-gray-600 mb-6">
            Üzgünüz, bir şeyler yanlış gitti. Lütfen tekrar deneyin.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={reset}>Tekrar Dene</Button>
            <Button variant="secondary" onClick={() => window.location.href = '/dashboard'}>
              Ana Sayfa
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
