import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sayfa Bulunamadı</h2>
          <p className="text-gray-600 mb-6">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
          <Link href="/dashboard">
            <Button>Ana Sayfaya Dön</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
