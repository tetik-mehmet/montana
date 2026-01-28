'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

interface MemberFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function MemberForm({ initialData, onSubmit, onCancel }: MemberFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(!!initialData);
  
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    dateOfBirth: initialData?.dateOfBirth?.split('T')[0] || '',
    gender: initialData?.gender || 'male',
    address: initialData?.address || '',
    emergencyContactName: initialData?.emergencyContact?.name || '',
    emergencyContactPhone: initialData?.emergencyContact?.phone || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const steps = [
    { number: 1, title: 'Temel Bilgiler', icon: '👤' },
    { number: 2, title: 'İletişim Bilgileri', icon: '📧' },
    { number: 3, title: 'Acil Durum', icon: '🚨' },
  ];

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
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

  useEffect(() => {
    if (!initialData) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    if (userId) {
      const user = users.find(u => u._id === userId);
      if (user) {
        const nameParts = user.name.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        setFormData(prev => ({
          ...prev,
          firstName,
          lastName,
          email: user.email,
        }));
        setShowManualEntry(true);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
        address: formData.address,
        emergencyContact: {
          name: formData.emergencyContactName,
          phone: formData.emergencyContactPhone,
        },
      };

      await onSubmit(data);
    } catch (error) {
      console.error('Form hatası:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.dateOfBirth && formData.gender;
      case 2:
        return formData.email && formData.phone;
      case 3:
        return true; // Acil durum bilgileri opsiyonel
      default:
        return false;
    }
  };

  const canProceed = validateStep(currentStep);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Kullanıcı Seçimi - Sadece yeni üye için */}
      {!initialData && (
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 border border-blue-200 shadow-sm">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Hızlı Seçim</h3>
                  <p className="text-xs text-gray-600">Kayıtlı kullanıcılardan seç</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowManualEntry(!showManualEntry);
                  setSelectedUserId('');
                }}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-1 hover:scale-105 transform duration-200"
              >
                <span>{showManualEntry ? '← Kullanıcı Seç' : 'Manuel Giriş →'}</span>
              </button>
            </div>

            {!showManualEntry && (
              <div className="animate-fade-in">
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Select
                      label=""
                      name="userId"
                      value={selectedUserId}
                      onChange={(e) => handleUserSelect(e.target.value)}
                      options={[
                        { value: '', label: '👤 Kullanıcı seçin...' },
                        ...users.map(user => ({
                          value: user._id,
                          label: `${user.name} • ${user.email}`
                        }))
                      ]}
                    />
                    <p className="text-xs text-gray-500 flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span>Seçilen kullanıcının bilgileri otomatik doldurulacak</span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Progress Steps - Sadece düzenleme değilse göster */}
      {(showManualEntry || selectedUserId) && !initialData && (
        <div className="relative">
          {/* Progress bar */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between mb-8">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300 relative z-10
                  ${currentStep >= step.number 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110' 
                    : 'bg-white border-2 border-gray-300 text-gray-400'}
                `}>
                  {currentStep > step.number ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{step.icon}</span>
                  )}
                </div>
                <span className={`text-xs font-medium mt-2 transition-colors hidden sm:block ${
                  currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form Content */}
      {(showManualEntry || selectedUserId) && (
        <div className="space-y-6">
          {/* Step 1: Temel Bilgiler */}
          {(currentStep === 1 || initialData) && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3 pb-4 border-b">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Temel Bilgiler</h3>
                  <p className="text-sm text-gray-600">Üyenin kişisel bilgilerini girin</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Input
                    label="Ad"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Örn: Mehmet"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    label="Soyad"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Örn: Yılmaz"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Input
                    label="Doğum Tarihi"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Select
                    label="Cinsiyet"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    options={[
                      { value: 'male', label: '👨 Erkek' },
                      { value: 'female', label: '👩 Kadın' },
                      { value: 'other', label: '🧑 Diğer' },
                    ]}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: İletişim Bilgileri */}
          {(currentStep === 2 || initialData) && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3 pb-4 border-b">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <span className="text-xl">📧</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">İletişim Bilgileri</h3>
                  <p className="text-sm text-gray-600">İletişim ve adres bilgileri</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ornek@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    label="Telefon"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="(5xx) xxx xx xx"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Textarea
                  label="Adres (Opsiyonel)"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Tam adres bilgisi..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Acil Durum */}
          {(currentStep === 3 || initialData) && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3 pb-4 border-b">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white shadow-lg">
                  <span className="text-xl">🚨</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Acil Durum İletişim</h3>
                  <p className="text-sm text-gray-600">Acil durumlarda aranacak kişi (Opsiyonel)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Input
                    label="İsim"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                    placeholder="Acil durum kişisi"
                  />
                </div>
                <div className="space-y-2">
                  <Input
                    label="Telefon"
                    type="tel"
                    name="emergencyContactPhone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                    placeholder="(5xx) xxx xx xx"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm">
                  <p className="font-medium text-amber-900">Güvenlik İçin Önemli</p>
                  <p className="text-amber-700 mt-1">Acil durumlarda sizinle veya bir yakınınızla iletişime geçebilmemiz için bu bilgileri ekleyin.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      {(showManualEntry || selectedUserId) && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
          <div className="flex gap-3 w-full sm:w-auto">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onCancel}
              className="flex-1 sm:flex-none"
            >
              <span className="flex items-center justify-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>İptal</span>
              </span>
            </Button>
            
            {!initialData && currentStep > 1 && (
              <Button 
                type="button" 
                variant="secondary"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 sm:flex-none"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Geri</span>
                </span>
              </Button>
            )}
          </div>

          <div className="w-full sm:w-auto">
            {!initialData && currentStep < steps.length ? (
              <Button 
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed}
                className="w-full sm:w-auto min-w-[140px]"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>İleri</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full sm:w-auto min-w-[140px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </form>
  );
}
