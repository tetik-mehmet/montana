'use client';

import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import gymAnimation from '@/data/gym.json';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 animate-bg-zoom">
            <Image
              src="/arka_plan.png"
              alt="Montana Gym Background"
              fill
              className="object-cover object-center"
              priority
              quality={100}
            />
          </div>
          {/* Dark Overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
        </div>
        
        <div className="relative z-10 text-center max-w-5xl mx-auto">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 animate-fade-in">
              <Image
                src="/logo_montana.png"
                alt="Montana Gym Logo"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent animate-fade-in-up" style={{fontWeight: 800}}>
            MONTANA GYM
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-4 font-normal tracking-wide animate-fade-in-up animation-delay-200" style={{fontWeight: 400}}>
            Elit Spor ve Yaşam Merkezi
          </p>

          <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-12 max-w-3xl mx-auto font-light animate-fade-in-up animation-delay-400" style={{fontWeight: 300}}>
            Lüks ekipmanlar, profesyonel antrenörler ve özel üyelik ayrıcalıklarıyla
            hayallerinizdeki formuna kavuşun
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 animate-fade-in-up animation-delay-600">
            {/* Primary CTA - Üye Ol */}
            <Link
              href="/register"
              className="group relative px-10 py-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-lg rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/50 w-full sm:w-auto"
            >
              <span className="relative z-10">Üye Ol</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            {/* Secondary CTA - Giriş Yap */}
            <Link
              href="/login"
              className="group relative px-10 py-4 bg-transparent border-2 border-yellow-500/50 text-yellow-400 font-semibold text-lg rounded-lg transition-all duration-300 hover:bg-yellow-500/10 hover:border-yellow-400 hover:scale-105 w-full sm:w-auto"
            >
              Giriş Yap
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <div className="flex flex-col items-center gap-2">
              <span className="text-yellow-400 text-xs font-medium tracking-wider uppercase">Daha Fazlası</span>
              <svg
                className="w-8 h-8 text-yellow-400 mx-auto drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
            Neden Montana Gym?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-xl hover:border-yellow-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Son Teknoloji Ekipmanlar</h3>
              <p className="text-gray-400">
                En yeni ve en gelişmiş fitness ekipmanları ile hedefinize ulaşın
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-xl hover:border-yellow-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Profesyonel Antrenörler</h3>
              <p className="text-gray-400">
                Uzman ve sertifikalı antrenörlerimizle kişisel gelişim programları
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-xl hover:border-yellow-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Esnek Saatler</h3>
              <p className="text-gray-400">
                7/24 açık, sizin programınıza uygun antrenman saatleri
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-8 bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-xl hover:border-yellow-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">VIP Üyelik Paketleri</h3>
              <p className="text-gray-400">
                Özel soyunma odaları, spa ve masaj hizmetleri ile lüks deneyim
              </p>
            </div>

            {/* Feature 5 */}
            <div className="group p-8 bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-xl hover:border-yellow-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">Grup Dersleri</h3>
              <p className="text-gray-400">
                Yoga, Pilates, CrossFit ve daha fazlası ile motivasyonunuzu artırın
              </p>
            </div>

            {/* Feature 6 */}
            <div className="group p-8 bg-gradient-to-br from-gray-900 to-black border border-yellow-500/20 rounded-xl hover:border-yellow-500/50 transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">İlerleme Takibi</h3>
              <p className="text-gray-400">
                Dijital platformumuzda antrenmanlarınızı ve gelişiminizi takip edin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Animation */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Animation Section */}
            <div className="flex justify-center lg:justify-end order-2 lg:order-1">
              <div className="w-full max-w-md lg:max-w-lg">
                <Lottie 
                  animationData={gymAnimation} 
                  loop={true}
                  className="w-full h-auto drop-shadow-[0_0_50px_rgba(250,204,21,0.3)]"
                />
              </div>
            </div>

            {/* Text Content Section */}
            <div className="text-center lg:text-left order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 bg-clip-text text-transparent">
                Hayallerinizdeki Forma Başlayın
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
                Şimdi üye olun ve ilk ay %50 indirimden yararlanın
              </p>
              <Link
                href="/register"
                className="inline-block px-12 py-5 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold text-xl rounded-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/50"
              >
                Hemen Üye Ol
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Transition Section - Before Footer */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black/50 to-[#0a0a0a]">
        <div className="max-w-4xl mx-auto">
          {/* Golden Glowing Divider Line */}
          <div className="relative mb-8">
            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent shadow-[0_0_20px_rgba(234,179,8,0.6)]"></div>
            <div className="absolute inset-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent blur-sm"></div>
          </div>

          {/* Call to Action Messages */}
          <div className="text-center space-y-4">
            <p className="text-gray-400 text-sm">
              🤝 <span className="text-yellow-400 font-semibold">Bize Katılın</span> — Montana Gym ailesinin bir parçası olun
            </p>
            <p className="text-gray-500 text-xs">
              💬 Sorularınız mı var? <Link href="/contact" className="text-yellow-400 hover:text-yellow-300 underline transition-colors">Bize ulaşın</Link>, size yardımcı olmaktan mutluluk duyarız
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0a0a0a] via-[#0f1216] to-[#0a0a0a] border-t border-yellow-500/20 overflow-hidden">
        {/* Subtle Grain/Noise Texture */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")'}}></div>
        <div className="max-w-7xl mx-auto">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="text-center md:text-left">
              <div className="relative w-24 h-24 mx-auto md:mx-0 mb-4 transition-transform hover:scale-105 duration-300">
                <Image
                  src="/logo_montana.png"
                  alt="Montana Gym"
                  fill
                  className="object-contain drop-shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                />
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent mb-2">
                MONTANA GYM
              </p>
              <p className="text-yellow-500/80 text-sm font-medium mb-3 tracking-wider">
                Elit Spor ve Yaşam Merkezi
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Hayallerinizdeki formuna kavuşmanın en lüks adresi.
              </p>
            </div>

            {/* Contact Info */}
            <div className="text-center md:text-left">
              <h3 className="text-yellow-400 font-bold text-lg mb-4 tracking-wide">İletişim</h3>
              <div className="space-y-3 text-gray-400 text-sm">
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>İstanbul, Türkiye</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href="tel:+905001234567" className="hover:text-yellow-400 transition-colors">+90 500 123 45 67</a>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <svg className="w-5 h-5 text-yellow-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:info@montanagym.com" className="hover:text-yellow-400 transition-colors">info@montanagym.com</a>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="text-center md:text-left">
              <h3 className="text-yellow-400 font-bold text-lg mb-4 tracking-wide">Çalışma Saatleri</h3>
              <div className="space-y-2 text-gray-400 text-sm">
                <div className="flex justify-between items-center max-w-[200px] mx-auto md:mx-0">
                  <span>Pazartesi - Cuma</span>
                  <span className="text-yellow-500 font-semibold">06:00 - 23:00</span>
                </div>
                <div className="flex justify-between items-center max-w-[200px] mx-auto md:mx-0">
                  <span>Cumartesi</span>
                  <span className="text-yellow-500 font-semibold">08:00 - 22:00</span>
                </div>
                <div className="flex justify-between items-center max-w-[200px] mx-auto md:mx-0">
                  <span>Pazar</span>
                  <span className="text-yellow-500 font-semibold">08:00 - 20:00</span>
                </div>
                <div className="mt-4 pt-4 border-t border-yellow-500/20">
                  <p className="text-yellow-400 font-semibold">7/24 Üye Erişimi Mevcut</p>
                </div>
              </div>
            </div>

            {/* Quick Links & Social */}
            <div className="text-center md:text-left">
              <h3 className="text-yellow-400 font-bold text-lg mb-4 tracking-wide">Hızlı Erişim</h3>
              <div className="space-y-2 mb-6 text-gray-400 text-sm">
                <Link href="/about" className="block hover:text-yellow-400 transition-colors hover:translate-x-1 transform duration-200 tracking-wide">
                  Hakkımızda
                </Link>
                <Link href="/pricing" className="block hover:text-yellow-400 transition-colors hover:translate-x-1 transform duration-200 tracking-wide">
                  Üyelik Paketleri
                </Link>
                <Link href="/contact" className="block hover:text-yellow-400 transition-colors hover:translate-x-1 transform duration-200 tracking-wide">
                  İletişim
                </Link>
                <Link href="/privacy" className="block hover:text-yellow-400 transition-colors hover:translate-x-1 transform duration-200 tracking-wide">
                  Gizlilik Politikası
                </Link>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-yellow-400 font-semibold text-sm mb-3">Bizi Takip Edin</h4>
                <div className="flex justify-center md:justify-start gap-3">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-yellow-500/30 hover:border-yellow-500 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 group">
                    <svg className="w-5 h-5 text-yellow-400 group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-yellow-500/30 hover:border-yellow-500 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 group">
                    <svg className="w-5 h-5 text-yellow-400 group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-yellow-500/30 hover:border-yellow-500 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 group">
                    <svg className="w-5 h-5 text-yellow-400 group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="https://wa.me/905001234567" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border-2 border-yellow-500/30 hover:border-yellow-500 hover:bg-yellow-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-6 group">
                    <svg className="w-5 h-5 text-yellow-400 group-hover:text-black transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-yellow-500/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p className="text-gray-500 opacity-80">© 2026 Montana Gym. Tüm hakları saklıdır.</p>
              <p className="text-gray-600 opacity-80">Designed with 💛 for excellence</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
