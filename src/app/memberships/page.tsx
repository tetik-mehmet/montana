'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import MembershipForm from '@/components/forms/MembershipForm';
import { formatDate, formatCurrency } from '@/lib/utils';
import { showToast } from '@/lib/toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function MembershipsPage() {
  const [memberships, setMemberships] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMembership, setEditingMembership] = useState<any>(null);
  const [cancellingMembershipId, setCancellingMembershipId] = useState<string | null>(null);

  useEffect(() => {
    fetchMemberships();
  }, [pagination.page, statusFilter]);

  const fetchMemberships = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '10',
        ...(statusFilter && { status: statusFilter }),
      });

      const res = await fetch(`/api/memberships?${params}`);
      const data = await res.json();
      setMemberships(data.memberships);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Üyelikler yüklenemedi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMembership = async (data: any) => {
    try {
      const res = await fetch('/api/memberships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setShowAddModal(false);
        showToast.success('Üyelik başarıyla oluşturuldu');
        fetchMemberships();
      } else {
        const error = await res.json();
        showToast.error(error.error || 'Bir hata oluştu');
      }
    } catch (error) {
      showToast.error('Bir hata oluştu');
    }
  };

  const handleEditMembership = async (data: any) => {
    try {
      const res = await fetch(`/api/memberships/${editingMembership._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setEditingMembership(null);
        showToast.success('Üyelik başarıyla güncellendi');
        fetchMemberships();
      } else {
        const error = await res.json();
        showToast.error(error.error || 'Bir hata oluştu');
      }
    } catch (error) {
      showToast.error('Bir hata oluştu');
    }
  };

  const handleCancelMembership = async (id: string) => {
    try {
      const res = await fetch(`/api/memberships/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast.success('Üyelik başarıyla iptal edildi');
        fetchMemberships();
      } else {
        const error = await res.json();
        showToast.error(error.error || 'Bir hata oluştu');
      }
    } catch (error) {
      showToast.error('Bir hata oluştu');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Aktif</Badge>;
      case 'expired':
        return <Badge variant="danger">Süresi Dolmuş</Badge>;
      case 'cancelled':
        return <Badge variant="default">İptal Edildi</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Üyelikler</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Aktif ve geçmiş üyelikleri yönetin</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="sm:w-auto w-full">
            + Yeni Üyelik
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-64">
            <Select
              name="status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              options={[
                { value: '', label: 'Tüm Durumlar' },
                { value: 'active', label: 'Aktif' },
                { value: 'expired', label: 'Süresi Dolmuş' },
                { value: 'cancelled', label: 'İptal Edildi' },
              ]}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
          ) : memberships.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Henüz üyelik yok</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Üye</TableHead>
                      <TableHead>Paket</TableHead>
                      <TableHead>Başlangıç</TableHead>
                      <TableHead>Bitiş</TableHead>
                      <TableHead>Ücret</TableHead>
                      <TableHead>Durum</TableHead>
                      <TableHead>İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {memberships.map((membership: any) => (
                      <TableRow key={membership._id}>
                        <TableCell className="font-medium">
                          {membership.member?.firstName} {membership.member?.lastName}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {membership.package?.name}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {formatDate(membership.startDate)}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {formatDate(membership.endDate)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(membership.price)}
                        </TableCell>
                        <TableCell>{getStatusBadge(membership.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => setEditingMembership(membership)}
                            >
                              Düzenle
                            </Button>
                            {membership.status === 'active' && (
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => setCancellingMembershipId(membership._id)}
                              >
                                İptal
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-200">
                {memberships.map((membership: any) => (
                  <div key={membership._id} className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">
                          {membership.member?.firstName} {membership.member?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{membership.package?.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(membership.startDate)} - {formatDate(membership.endDate)}
                        </p>
                        <p className="text-sm font-medium text-blue-600 mt-1">
                          {formatCurrency(membership.price)}
                        </p>
                      </div>
                      {getStatusBadge(membership.status)}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={() => setEditingMembership(membership)}
                      >
                        Düzenle
                      </Button>
                      {membership.status === 'active' && (
                        <Button
                          size="sm"
                          variant="danger"
                          className="flex-1"
                          onClick={() => setCancellingMembershipId(membership._id)}
                        >
                          İptal
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && memberships.length > 0 && (
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
        title="Yeni Üyelik Oluştur"
        size="2xl"
      >
        <MembershipForm onSubmit={handleAddMembership} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingMembership}
        onClose={() => setEditingMembership(null)}
        title="Üyelik Düzenle"
        size="2xl"
      >
        {editingMembership && (
          <MembershipForm
            initialData={editingMembership}
            onSubmit={handleEditMembership}
            onCancel={() => setEditingMembership(null)}
          />
        )}
      </Modal>

      {/* Cancel Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!cancellingMembershipId}
        onClose={() => setCancellingMembershipId(null)}
        onConfirm={() => {
          if (cancellingMembershipId) {
            handleCancelMembership(cancellingMembershipId);
            setCancellingMembershipId(null);
          }
        }}
        title="Üyeliği İptal Et"
        message="Bu üyeliği iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="İptal Et"
        cancelText="Vazgeç"
        variant="danger"
      />
    </DashboardLayout>
  );
}
