'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatCard from '@/components/ui/StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate, formatCurrency, daysUntilExpiry, cn } from '@/lib/utils';
import { showToast } from '@/lib/toast';

interface Stats {
  overview: {
    totalMembers: number;
    activeMembers: number;
    newMembersThisMonth: number;
    activeMemberships: number;
    revenueThisMonth: number;
  };
  expiringMemberships: any[];
  recentMembers: any[];
  packageStats: any[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: string;
}

// Skeleton Loader Component
const StatCardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between">
      <div className="space-y-3 flex-1">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
    </div>
  </div>
);

const CardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-6 border-b border-gray-100">
      <div className="h-6 bg-gray-200 rounded w-48"></div>
    </div>
    <div className="p-6 space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  </div>
);

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error('İstatistikler yüklenemedi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Kullanıcılar yüklenemedi:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      setUpdatingUserId(userId);
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const data = await res.json();
        showToast.error(data.error || 'Rol güncellenemedi');
        return;
      }

      const updatedUser = await res.json();
      setUsers(users.map(u => u._id === userId ? updatedUser : u));
      showToast.success('Kullanıcı rolü başarıyla güncellendi');
    } catch (error) {
      console.error('Rol güncellenirken hata:', error);
      showToast.error('Rol güncellenirken bir hata oluştu');
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 sm:space-y-8">
          {/* Header Skeleton */}
          <div className="animate-fade-in">
            <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse"></div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>

          <CardSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900">İstatistikler Yüklenemedi</p>
            <p className="text-sm text-gray-500">Lütfen sayfayı yenilemeyi deneyin</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 animate-fade-in">
        {/* Page Header - Enhanced with gradient text */}
        <div className="animate-fade-in-up">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Gym yönetim sisteminizin özet görünümü</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="hidden sm:inline">Son güncelleme: Şimdi</span>
            </div>
          </div>
        </div>

        {/* Stats Grid - Enhanced with stagger animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <StatCard
              title="Toplam Üye"
              value={stats.overview.totalMembers}
              icon={
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              }
            />
          </div>
          
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <StatCard
              title="Aktif Üye"
              value={stats.overview.activeMembers}
              icon={
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              }
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <StatCard
              title="Bu Ay Yeni"
              value={stats.overview.newMembersThisMonth}
              icon={
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
              }
            />
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <StatCard
              title="Bu Ay Gelir"
              value={formatCurrency(stats.overview.revenueThisMonth)}
              icon={
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              }
            />
          </div>
        </div>

        {/* Two Column Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Expiring Memberships - Enhanced */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                    <span>Süresi Yakında Dolacak Üyelikler</span>
                  </CardTitle>
                  {stats.expiringMemberships.length > 0 && (
                    <Badge variant="warning" className="animate-pulse">
                      {stats.expiringMemberships.length}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {stats.expiringMemberships.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Harika! Yakında dolacak üyelik yok</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {stats.expiringMemberships.map((membership: any, index: number) => {
                      const daysLeft = daysUntilExpiry(membership.endDate);
                      return (
                        <div
                          key={membership._id}
                          className="group relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 hover:border-amber-300 transition-all duration-300 hover:shadow-md hover:scale-[1.02]"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          <div className="relative flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {membership.member.firstName} {membership.member.lastName}
                              </p>
                              <p className="text-xs text-gray-600 truncate mt-1">
                                {membership.package.name}
                              </p>
                            </div>
                            <Badge variant="warning" className="ml-3">
                              {daysLeft} gün
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Members - Enhanced */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span>Son Eklenen Üyeler</span>
                  </CardTitle>
                  {stats.recentMembers.length > 0 && (
                    <Badge variant="default">
                      {stats.recentMembers.length}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {stats.recentMembers.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Henüz üye eklenmemiş</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {stats.recentMembers.map((member: any, index: number) => (
                      <div
                        key={member._id}
                        className="group flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all duration-300 hover:shadow-sm border border-transparent hover:border-blue-100 cursor-pointer"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                            {member.firstName[0]}{member.lastName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                              {member.firstName} {member.lastName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{member.email}</p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            member.status === 'active'
                              ? 'success'
                              : member.status === 'inactive'
                              ? 'default'
                              : 'danger'
                          }
                          className="ml-3 transition-transform group-hover:scale-105"
                        >
                          {member.status === 'active'
                            ? 'Aktif'
                            : member.status === 'inactive'
                            ? 'Pasif'
                            : 'Süresi Dolmuş'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Package Statistics - Enhanced */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                  <span>Paket İstatistikleri</span>
                </CardTitle>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded bg-gradient-to-r from-blue-500 to-purple-600"></div>
                    <span>Kullanım Oranı</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {stats.packageStats.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Henüz paket istatistiği bulunmuyor</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {stats.packageStats.map((pkg: any, index: number) => {
                    const percentage = Math.min(
                      (pkg.count / stats.overview.activeMemberships) * 100,
                      100
                    );
                    return (
                      <div 
                        key={pkg._id} 
                        className="group space-y-3 p-4 rounded-xl hover:bg-gray-50/50 transition-all duration-300"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {pkg.name}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              {pkg.count} üyelik
                            </span>
                            <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                              {formatCurrency(pkg.revenue)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Enhanced Progress Bar */}
                        <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div
                            className="absolute h-full bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 rounded-full shadow-lg transition-all duration-1000 ease-out group-hover:shadow-purple-500/50"
                            style={{
                              width: `${percentage}%`,
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">
                            %{percentage.toFixed(1)} dolu
                          </span>
                          <span className="text-gray-400">
                            {stats.overview.activeMemberships} toplam
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* User Management - Admin Yetkilendirme */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span>Kullanıcı Yönetimi</span>
                </CardTitle>
                {users.length > 0 && (
                  <Badge variant="default">
                    {users.filter(u => u.role === 'admin').length} Admin / {users.length} Toplam
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                    </div>
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Henüz kullanıcı bulunmuyor</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {users.map((user, index) => (
                    <div
                      key={user._id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 rounded-xl transition-all duration-300 hover:shadow-sm border border-transparent hover:border-blue-100"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-110 flex-shrink-0">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Kayıt: {formatDate(user.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge
                          variant={user.role === 'admin' ? 'danger' : 'default'}
                          className="min-w-[70px] justify-center"
                        >
                          {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                        </Badge>
                        <button
                          onClick={() => updateUserRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                          disabled={updatingUserId === user._id}
                          className={cn(
                            'px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 min-w-[120px]',
                            user.role === 'admin'
                              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                              : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg',
                            updatingUserId === user._id && 'opacity-50 cursor-not-allowed'
                          )}
                        >
                          {updatingUserId === user._id ? (
                            <span className="flex items-center justify-center gap-2">
                              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Güncelleniyor...
                            </span>
                          ) : (
                            user.role === 'admin' ? 'Admin Kaldır' : 'Admin Yap'
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
