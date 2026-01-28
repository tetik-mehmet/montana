'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Mobilde fixed overlay, desktop'ta static column */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Ana içerik alanı - Sidebar'ın yanında */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
