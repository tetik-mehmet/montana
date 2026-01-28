'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import Pagination from '@/components/ui/Pagination';
import Modal from '@/components/ui/Modal';
import MemberForm from '@/components/forms/MemberForm';
import { formatDate } from '@/lib/utils';
import { showToast } from '@/lib/toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [deletingMemberId, setDeletingMemberId] = useState<string | null>(null);

  useEffect(() => {
    fetchMembers();
  }, [pagination.page, searchQuery]);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '10',
        search: searchQuery,
      });

      const res = await fetch(`/api/members?${params}`);
      const data = await res.json();
      setMembers(data.members);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Üyeler yüklenemedi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMember = async (data: any) => {
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setShowAddModal(false);
        showToast.success('Üye başarıyla eklendi');
        fetchMembers();
      } else {
        const error = await res.json();
        showToast.error(error.error || 'Bir hata oluştu');
      }
    } catch (error) {
      showToast.error('Bir hata oluştu');
    }
  };

  const handleEditMember = async (data: any) => {
    try {
      const res = await fetch(`/api/members/${editingMember._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setEditingMember(null);
        showToast.success('Üye başarıyla güncellendi');
        fetchMembers();
      } else {
        const error = await res.json();
        showToast.error(error.error || 'Bir hata oluştu');
      }
    } catch (error) {
      showToast.error('Bir hata oluştu');
    }
  };

  const handleDeleteMember = async (id: string) => {
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast.success('Üye başarıyla silindi');
        fetchMembers();
      } else {
        const error = await res.json();
        showToast.error(error.error || 'Bir hata oluştu');
      }
    } catch (error) {
      showToast.error('Bir hata oluştu');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Üyeler</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Tüm gym üyelerini yönetin</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="sm:w-auto w-full">
            + Yeni Üye
          </Button>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Üye ara (isim, email, telefon)..."
              onSearch={(query) => {
                setSearchQuery(query);
                setPagination({ ...pagination, page: 1 });
              }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
          ) : members.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Henüz üye yok</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ad Soyad</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefon</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>Kayıt Tarihi</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {members.map((member: any) => (
                      <TableRow key={member._id}>
                        <TableCell className="font-medium">
                          {member.firstName} {member.lastName}
                        </TableCell>
                        <TableCell className="text-gray-600">{member.email}</TableCell>
                        <TableCell className="text-gray-600">{member.phone}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              member.status === 'active'
                                ? 'success'
                                : member.status === 'inactive'
                                ? 'default'
                                : 'danger'
                            }
                          >
                            {member.status === 'active'
                              ? 'Aktif'
                              : member.status === 'inactive'
                              ? 'Pasif'
                              : 'Süresi Dolmuş'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {formatDate(member.createdAt)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setEditingMember(member)}
                            >
                              Düzenle
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => setDeletingMemberId(member._id)}
                            >
                              Sil
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {members.map((member: any) => (
                  <div key={member._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-gray-600 truncate">{member.email}</p>
                        <p className="text-sm text-gray-600">{member.phone}</p>
                      </div>
                      <Badge
                        variant={
                          member.status === 'active'
                            ? 'success'
                            : member.status === 'inactive'
                            ? 'default'
                            : 'danger'
                        }
                      >
                        {member.status === 'active'
                          ? 'Aktif'
                          : member.status === 'inactive'
                          ? 'Pasif'
                          : 'Süresi Dolmuş'}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => setEditingMember(member)}
                      >
                        Düzenle
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        className="flex-1"
                        onClick={() => setDeletingMemberId(member._id)}
                      >
                        Sil
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && members.length > 0 && (
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => setPagination({ ...pagination, page })}
          />
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Yeni Üye Ekle"
        size="2xl"
      >
        <MemberForm onSubmit={handleAddMember} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        title="Üye Düzenle"
        size="2xl"
      >
        {editingMember && (
          <MemberForm
            initialData={editingMember}
            onSubmit={handleEditMember}
            onCancel={() => setEditingMember(null)}
          />
        )}
      </Modal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deletingMemberId}
        onClose={() => setDeletingMemberId(null)}
        onConfirm={() => {
          if (deletingMemberId) {
            handleDeleteMember(deletingMemberId);
            setDeletingMemberId(null);
          }
        }}
        title="Üye Sil"
        message="Bu üyeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sil"
        cancelText="İptal"
        variant="danger"
      />
    </DashboardLayout>
  );
}
