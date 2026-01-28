'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Kayıt işlemi başarısız oldu');
        return;
      }

      setSuccess('Kayıt başarılı! Yönlendiriliyorsunuz...');
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });

      // 2 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4 py-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
      
      {/* Animated Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl animate-pulse animation-delay-400"></div>

      {/* Back to Home Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition-colors group"
      >
        <svg
          className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="hidden sm:inline">Ana Sayfa</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Card with Glass Effect */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-yellow-500/20 p-8 sm:p-10 animate-fade-in-up">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4">
              <Image
                src="/logo_montana.png"
                alt="Montana Gym Logo"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
              MONTANA GYM
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">Üyelik Oluştur</p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm backdrop-blur-sm animate-fade-in">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg text-sm backdrop-blur-sm animate-fade-in">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{success}</span>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Ad Soyad
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-500 transition"
                  placeholder="Ad ve soyadınızı giriniz"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                E-posta Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-500 transition"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-500 transition"
                  placeholder="••••••••"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                En az 6 karakter olmalıdır
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Şifre Onayı
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-white placeholder-gray-500 transition"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Kaydediliyor...</span>
                </>
              ) : (
                <>
                  <span>Üye Ol</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center">
            <div className="flex-1 border-t border-gray-700"></div>
            <span className="px-4 text-sm text-gray-500">veya</span>
            <div className="flex-1 border-t border-gray-700"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Zaten üye misiniz?{' '}
              <Link
                href="/login"
                className="text-yellow-500 hover:text-yellow-400 font-semibold transition-colors"
              >
                Giriş Yapın
              </Link>
            </p>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <p className="text-xs text-gray-500 text-center">
              Üye olarak{' '}
              <Link href="/privacy" className="text-yellow-600 hover:text-yellow-500 transition-colors">
                Gizlilik Politikası
              </Link>
              {' '}ve{' '}
              <Link href="/terms" className="text-yellow-600 hover:text-yellow-500 transition-colors">
                Kullanım Koşulları
              </Link>
              nı kabul etmiş olursunuz.
            </p>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-gray-500 text-sm mt-8">
          © 2026 Montana Gym. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  );
}
