'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import { formatDate } from '@/lib/utils';
import { showToast } from '@/lib/toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function UsersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{ userId: string; newRole: 'admin' | 'user' } | null>(null);

  // Admin kontrolü
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchUsers();
    }
  }, [session]);

  useEffect(() => {
    // Arama filtresi
    if (searchQuery) {
      const filtered = users.filter((user: any) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
        setFilteredUsers(data);
      }
    } catch (error) {
      console.error('Kullanıcılar yüklenemedi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        showToast.success('Kullanıcı rolü başarıyla güncellendi');
        fetchUsers();
      } else {
        const error = await res.json();
        showToast.error(error.error || 'Bir hata oluştu');
      }
    } catch (error) {
      showToast.error('Bir hata oluştu');
    }
  };

  if (status === 'loading' || isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (session?.user?.role !== 'admin') {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Kullanıcıları görüntüleyin ve yetkilerini düzenleyin</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Kullanıcı ara (isim, email)..."
              onSearch={setSearchQuery}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Toplam Kullanıcı</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Admin Kullanıcılar</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">
                  {users.filter((u: any) => u.role === 'admin').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Normal Kullanıcılar</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  {users.filter((u: any) => u.role === 'user').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? 'Kullanıcı bulunamadı' : 'Henüz kullanıcı yok'}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ad Soyad</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Kayıt Tarihi</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user: any) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell className="text-gray-600">{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.role === 'admin' ? 'warning' : 'default'}
                          >
                            {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {formatDate(user.createdAt)}
                        </TableCell>
                        <TableCell>
                          {session.user.id !== user._id && (
                            <Button
                              size="sm"
                              variant={user.role === 'admin' ? 'secondary' : 'primary'}
                              onClick={() =>
                                setConfirmDialog({
                                  userId: user._id,
                                  newRole: user.role === 'admin' ? 'user' : 'admin'
                                })
                              }
                            >
                              {user.role === 'admin' ? 'Kullanıcı Yap' : 'Admin Yap'}
                            </Button>
                          )}
                          {session.user.id === user._id && (
                            <span className="text-xs text-gray-500 italic">Sizsiniz</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {filteredUsers.map((user: any) => (
                  <div key={user._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600 truncate">{user.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                      <Badge
                        variant={user.role === 'admin' ? 'warning' : 'default'}
                      >
                        {user.role === 'admin' ? 'Admin' : 'Kullanıcı'}
                      </Badge>
                    </div>
                    {session.user.id !== user._id && (
                      <Button
                        size="sm"
                        variant={user.role === 'admin' ? 'secondary' : 'primary'}
                        className="w-full"
                        onClick={() =>
                          setConfirmDialog({
                            userId: user._id,
                            newRole: user.role === 'admin' ? 'user' : 'admin'
                          })
                        }
                      >
                        {user.role === 'admin' ? 'Kullanıcı Yap' : 'Admin Yap'}
                      </Button>
                    )}
                    {session.user.id === user._id && (
                      <p className="text-center text-xs text-gray-500 italic">Sizsiniz</p>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!confirmDialog}
        onClose={() => setConfirmDialog(null)}
        onConfirm={() => {
          if (confirmDialog) {
            handleRoleChange(confirmDialog.userId, confirmDialog.newRole);
          }
        }}
        title="Rol Değişikliği"
        message={`Bu kullanıcının rolünü "${confirmDialog?.newRole === 'admin' ? 'Admin' : 'Kullanıcı'}" olarak değiştirmek istediğinizden emin misiniz?`}
        confirmText="Değiştir"
        cancelText="İptal"
        variant="warning"
      />
    </DashboardLayout>
  );
}
