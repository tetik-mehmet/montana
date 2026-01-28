'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { formatCurrency } from '@/lib/utils';
import { showToast } from '@/lib/toast';
import Image from 'next/image';

interface Package {
  _id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  isActive: boolean;
}

interface Membership {
  _id: string;
  package: {
    name: string;
  };
  startDate: string;
  endDate: string;
  status: string;
}

export default function PricingPage() {
  const { data: session } = useSession();
  const [packages, setPackages] = useState<Package[]>([]);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMembership, setIsLoadingMembership] = useState(true);

  useEffect(() => {
    fetchPackages();
    fetchMyMembership();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/packages?isActive=true');
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages || []);
      } else {
        showToast.error('Paketler yüklenemedi');
      }
    } catch (error) {
      console.error('Paketler yüklenemedi:', error);
      showToast.error('Paketler yüklenirken bir hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyMembership = async () => {
    try {
      const res = await fetch('/api/my-membership');
      if (res.ok) {
        const data = await res.json();
        setMembership(data.membership);
      }
    } catch (error) {
      console.error('Üyelik bilgisi yüklenemedi:', error);
    } finally {
      setIsLoadingMembership(false);
    }
  };

  const getDaysUntilExpiry = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                <Image
                  src="/logo_montana.png"
                  alt="Montana Gym Logo"
                  fill
                  className="object-contain drop-shadow-lg"
                  priority
                />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Montana GYM</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                <p className="text-xs text-gray-500">{session?.user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Çıkış</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent mb-4">
            Üyelik Paketlerimiz
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Size en uygun paketi seçin ve fitness yolculuğunuza başlayın
          </p>
        </div>

        {/* Active Membership Info */}
        {!isLoadingMembership && membership && (
          <div className="max-w-4xl mx-auto mb-12 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {(() => {
              const daysLeft = getDaysUntilExpiry(membership.endDate);
              const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
              const isExpired = daysLeft <= 0;

              return (
                <div
                  className={`rounded-2xl p-6 sm:p-8 shadow-xl border-2 ${
                    isExpired
                      ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300'
                      : isExpiringSoon
                      ? 'bg-gradient-to-br from-amber-50 to-orange-100 border-amber-300 animate-pulse'
                      : 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                            isExpired
                              ? 'bg-gradient-to-br from-red-500 to-red-600'
                              : isExpiringSoon
                              ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                              : 'bg-gradient-to-br from-green-500 to-emerald-600'
                          }`}
                        >
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {isExpired ? 'Üyeliğiniz Sona Erdi' : 'Aktif Üyeliğiniz'}
                          </h3>
                          <p className="text-sm text-gray-600 font-medium">{membership.package.name}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                          <p className="text-xs text-gray-600 font-medium mb-1">Bitiş Tarihi</p>
                          <p className="text-sm font-bold text-gray-900">{formatDate(membership.endDate)}</p>
                        </div>
                        <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm">
                          <p className="text-xs text-gray-600 font-medium mb-1">
                            {isExpired ? 'Süre Doldu' : 'Kalan Gün'}
                          </p>
                          <p
                            className={`text-2xl font-bold ${
                              isExpired
                                ? 'text-red-600'
                                : isExpiringSoon
                                ? 'text-amber-600'
                                : 'text-green-600'
                            }`}
                          >
                            {isExpired ? '0' : daysLeft} {isExpired ? '' : 'gün'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Warning Icon for Expiring Soon */}
                    {isExpiringSoon && !isExpired && (
                      <div className="flex-shrink-0">
                        <div className="bg-amber-500 rounded-full p-4 shadow-lg animate-bounce">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Warning Message */}
                  {isExpiringSoon && !isExpired && (
                    <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-xl p-4 border-l-4 border-amber-500">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="font-semibold text-amber-900 mb-1">Üyeliğiniz Yakında Dolacak!</p>
                          <p className="text-sm text-amber-800">
                            Üyeliğinizin süresinin dolmasına {daysLeft} gün kaldı. Yenilemek için resepsiyonumuza başvurun.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Expired Message */}
                  {isExpired && (
                    <div className="mt-6 bg-white/70 backdrop-blur-sm rounded-xl p-4 border-l-4 border-red-500">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <p className="font-semibold text-red-900 mb-1">Üyeliğinizin Süresi Doldu</p>
                          <p className="text-sm text-red-800">
                            Üyeliğinizi yenilemek ve spora devam etmek için lütfen resepsiyonumuza başvurun.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-10 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-12 bg-gray-200 rounded mt-6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Henüz Paket Bulunmuyor</h3>
            <p className="text-gray-600">Şu anda aktif bir üyelik paketi bulunmamaktadır.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {packages.map((pkg, index) => (
              <div
                key={pkg._id}
                className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative">
                  {/* Package Name */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {pkg.name}
                    </h3>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {formatCurrency(pkg.price)}
                      </span>
                      <span className="text-gray-500 text-sm font-medium">
                        / {pkg.duration} gün
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6 pb-6 border-b border-gray-100">
                    <p className="text-gray-600 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        {pkg.duration} günlük tam erişim
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        Tüm ekipmanlara erişim
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">
                        Profesyonel danışmanlık
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    disabled
                    className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform transition-all duration-200 opacity-50 cursor-not-allowed"
                  >
                    Bilgi İçin Resepsiyona Başvurun
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="inline-block bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 max-w-2xl">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Üyelik Almak İçin</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Üyelik satın almak veya detaylı bilgi almak için lütfen salonumuzdaki resepsiyon görevlilerimizle iletişime geçin. 
              Size en uygun paketi seçmenizde yardımcı olmaktan mutluluk duyarız.
            </p>
          </div>
        </div>
      </main>

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
