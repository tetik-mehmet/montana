'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  adminOnly?: boolean;
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊', adminOnly: true },
  { name: 'Üyeler', href: '/members', icon: '👥' },
  { name: 'Paketler', href: '/packages', icon: '📦' },
  { name: 'Üyelikler', href: '/memberships', icon: '🎫' },
  { name: 'Kullanıcı Yönetimi', href: '/users', icon: '👤', adminOnly: true },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      {/* Mobile backdrop - Sadece mobilde görünür */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Mobilde fixed overlay, desktop'ta static column */}
      <aside
        className={cn(
          'bg-white border-r border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out',
          // Mobil: fixed overlay
          'fixed inset-y-0 left-0 z-50 w-64 lg:w-64',
          'transform lg:transform-none',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: static sidebar
          'lg:static lg:translate-x-0 lg:block',
          'h-screen lg:h-auto lg:min-h-screen'
        )}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Logo & Close Button */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 flex-shrink-0">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Gym Yönetim
            </h1>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Menüyü kapat"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation
              .filter(item => !item.adminOnly || session?.user?.role === 'admin')
              .map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 shadow-sm border border-blue-100'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent'
                    )}
                  >
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <span className="truncate">{item.name}</span>
                  </Link>
                );
              })}
          </nav>

          {/* User Info - Footer */}
          <div className="px-4 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md flex-shrink-0">
                {session?.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {session?.user?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {session?.user?.role === 'admin' ? '👑 Admin' : 'Kullanıcı'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
