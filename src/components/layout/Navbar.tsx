'use client';

import { signOut, useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { data: session } = useSession();

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 flex-shrink-0">
      <div className="h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors -ml-2"
          aria-label="Menüyü aç"
        >
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Spacer for mobile */}
        <div className="flex-1 lg:flex-initial"></div>

        {/* User info & logout */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900 truncate max-w-[150px] lg:max-w-none">
              {session?.user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {session?.user?.role === 'admin' ? '👑 Admin' : 'Kullanıcı'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="hover:bg-red-50 hover:text-red-600"
          >
            Çıkış
          </Button>
        </div>
      </div>
    </header>
  );
}
