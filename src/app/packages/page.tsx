'use client';

import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Button from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import PackageForm from '@/components/forms/PackageForm';
import { formatCurrency } from '@/lib/utils';
import { showToast } from '@/lib/toast';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function PackagesPage() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [deletingPackageId, setDeletingPackageId] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/packages');
      const data = await res.json();
      setPackages(data.packages);
    } catch (error) {
      console.error('Paketler yüklenemedi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPackage = async (data: any) => {
    try {
      const res = await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setShowAddModal(false);
        showToast.success('Paket başarıyla oluşturuldu');
        fetchPackages();
      } else {
        const error = await res.json();
        showToast.error(error.error || 'Bir hata oluştu');
      }
    } catch (error) {
      showToast.error('Bir hata oluştu');
    }
  };

  const handleEditPackage = async (data: any) => {
    try {
      const res = await fetch(`/api/packages/${editingPackage._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setEditingPackage(null);
        showToast.success('Paket başarıyla güncellendi');
        fetchPackages();
      } else {
        const error = await res.json();
        showToast.error(error.error || 'Bir hata oluştu');
      }
    } catch (error) {
      showToast.error('Bir hata oluştu');
    }
  };

  const handleDeletePackage = async (id: string) => {
    try {
      const res = await fetch(`/api/packages/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast.success('Paket başarıyla silindi');
        fetchPackages();
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Paketler</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Üyelik paketlerini yönetin</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} className="sm:w-auto w-full">
            + Yeni Paket
          </Button>
        </div>

        {/* Packages Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500">Yükleniyor...</p>
            </div>
          </div>
        ) : packages.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Henüz paket yok</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {packages.map((pkg: any) => (
              <Card key={pkg._id} className={!pkg.isActive ? 'opacity-60' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle>{pkg.name}</CardTitle>
                    <Badge variant={pkg.isActive ? 'success' : 'default'}>
                      {pkg.isActive ? 'Aktif' : 'Pasif'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">
                      {formatCurrency(pkg.price)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{pkg.duration} gün</p>
                  </div>

                  {pkg.description && (
                    <p className="text-sm text-gray-700">{pkg.description}</p>
                  )}

                  {pkg.features && pkg.features.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">Özellikler:</p>
                      <ul className="space-y-1">
                        {pkg.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <svg
                              className="w-5 h-5 text-green-500 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => setEditingPackage(pkg)}
                    >
                      Düzenle
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="flex-1"
                      onClick={() => setDeletingPackageId(pkg._id)}
                    >
                      Sil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Yeni Paket Ekle"
        size="lg"
      >
        <PackageForm onSubmit={handleAddPackage} onCancel={() => setShowAddModal(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingPackage}
        onClose={() => setEditingPackage(null)}
        title="Paket Düzenle"
        size="lg"
      >
        {editingPackage && (
          <PackageForm
            initialData={editingPackage}
            onSubmit={handleEditPackage}
            onCancel={() => setEditingPackage(null)}
          />
        )}
      </Modal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deletingPackageId}
        onClose={() => setDeletingPackageId(null)}
        onConfirm={() => {
          if (deletingPackageId) {
            handleDeletePackage(deletingPackageId);
            setDeletingPackageId(null);
          }
        }}
        title="Paket Sil"
        message="Bu paketi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sil"
        cancelText="İptal"
        variant="danger"
      />
    </DashboardLayout>
  );
}
