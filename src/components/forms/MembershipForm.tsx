'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import CheckboxGroup from '@/components/ui/CheckboxGroup';

interface MembershipFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function MembershipForm({ initialData, onSubmit, onCancel }: MembershipFormProps) {
  const [members, setMembers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({
    member: initialData?.member?._id || '',
    package: initialData?.package?._id || '',
    startDate: initialData?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    price: initialData?.price || '',
    paymentMethod: initialData?.paymentMethod || 'cash',
    notes: initialData?.notes || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [membersRes, packagesRes] = await Promise.all([
        fetch('/api/members?limit=1000'),
        fetch('/api/packages?isActive=true'),
      ]);

      const membersData = await membersRes.json();
      const packagesData = await packagesRes.json();

      setMembers(membersData.members || []);
      setPackages(packagesData.packages || []);
    } catch (error) {
      console.error('Veri yüklenemedi:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Auto-fill price when package is selected
    if (name === 'package') {
      const selectedPackage = packages.find((pkg: any) => pkg._id === value);
      if (selectedPackage) {
        setFormData((prev) => ({ ...prev, price: (selectedPackage as any).price }));
      }
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData({ ...formData, paymentMethod: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        member: formData.member,
        package: formData.package,
        startDate: formData.startDate,
        price: parseFloat(formData.price),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      };

      await onSubmit(data);
    } catch (error) {
      console.error('Form hatası:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Yükleniyor...</div>;
  }

  const paymentMethods = [
    { 
      value: 'cash', 
      label: 'Nakit', 
      icon: '💵',
      description: 'Peşin ödeme'
    },
    { 
      value: 'credit_card', 
      label: 'Kredi Kartı', 
      icon: '💳',
      description: 'POS ile ödeme'
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Üye ve Paket Seçimi */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Üye ve Paket Bilgileri</h3>
            <p className="text-sm text-gray-600">Üye ve paket seçimi yapın</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-200"></div>
          <div className="relative bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-blue-300 transition-all duration-200 cursor-pointer">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Üye Seçimi</p>
                <p className="text-sm text-gray-600">👤 Sistemdeki mevcut üyelerden seçin</p>
              </div>
            </div>
            <Select
              name="member"
              value={formData.member}
              onChange={handleChange}
              options={[
                { value: '', label: '👤 Üye seçin...' },
                ...members.map((member: any) => ({
                  value: member._id,
                  label: `${member.firstName} ${member.lastName} • ${member.email}`,
                })),
              ]}
              required
              disabled={!!initialData}
            />
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-200"></div>
          <div className="relative bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-purple-300 transition-all duration-200 cursor-pointer">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Paket Seçimi</p>
                <p className="text-sm text-gray-600">📦 Üyelik paketi ve süresini belirleyin</p>
              </div>
            </div>
            <Select
              name="package"
              value={formData.package}
              onChange={handleChange}
              options={[
                { value: '', label: '📦 Paket seçin...' },
                ...packages.map((pkg: any) => ({
                  value: pkg._id,
                  label: `${pkg.name} • ${pkg.duration} gün • ${pkg.price} TL`,
                })),
              ]}
              required
            />
            {formData.package && (
              <div className="mt-3 pt-3 border-t flex items-center space-x-2 text-sm">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-700 font-medium">Paket seçildi</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tarih ve Ücret Bilgileri */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Tarih ve Ücret</h3>
            <p className="text-sm text-gray-600">Başlangıç tarihi ve ödeme tutarı</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-200"></div>
            <div className="relative bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-purple-300 transition-all duration-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Başlangıç</p>
              </div>
              <Input
                label=""
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-200"></div>
            <div className="relative bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-green-300 transition-all duration-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ödenen Tutar</p>
              </div>
              <Input
                label=""
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                required
              />
              {formData.price && (
                <div className="mt-2 text-right">
                  <span className="text-lg font-bold text-green-600">
                    {parseFloat(formData.price).toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="text-sm">
            <p className="font-medium text-blue-900">Bilgilendirme</p>
            <p className="text-blue-700 mt-1">Bitiş tarihi, başlangıç tarihi ve paket süresine göre otomatik hesaplanacaktır.</p>
          </div>
        </div>
      </div>

      {/* Ödeme Yöntemi */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Ödeme Yöntemi</h3>
            <p className="text-sm text-gray-600">Ödeme şeklini seçin</p>
          </div>
        </div>

        <CheckboxGroup
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handlePaymentMethodChange}
          options={paymentMethods}
          columns={2}
          required
        />
      </div>

      {/* Notlar */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3 pb-4 border-b">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center text-white shadow-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Ek Notlar</h3>
            <p className="text-sm text-gray-600">İsteğe bağlı açıklamalar (Opsiyonel)</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-gray-500 to-slate-600 rounded-xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-200"></div>
          <div className="relative bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notlar</p>
                <p className="text-xs text-gray-400">İsteğe bağlı açıklamalar</p>
              </div>
            </div>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="💡 İndirim nedeni, özel durumlar, hatırlatmalar..."
            />
          </div>
        </div>
      </div>

      {/* Butonlar */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="secondary" onClick={onCancel} className="sm:w-auto">
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>İptal</span>
          </span>
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Kaydediliyor...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>{initialData ? 'Güncelle' : 'Kaydet'}</span>
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
