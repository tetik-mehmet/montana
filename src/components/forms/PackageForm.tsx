'use client';

import { useState } from 'react';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

interface PackageFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export default function PackageForm({ initialData, onSubmit, onCancel }: PackageFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    duration: initialData?.duration || '',
    price: initialData?.price || '',
    features: initialData?.features?.join('\n') || '',
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        name: formData.name,
        description: formData.description,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        features: formData.features
          .split('\n')
          .map((f: string) => f.trim())
          .filter((f: string) => f),
        isActive: formData.isActive,
      };

      await onSubmit(data);
    } catch (error) {
      console.error('Form hatası:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Paket Adı *"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Aylık, 3 Aylık, Yıllık..."
        required
      />

      <Textarea
        label="Açıklama"
        name="description"
        value={formData.description}
        onChange={handleChange}
        rows={3}
        placeholder="Paket hakkında kısa açıklama..."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Süre (Gün) *"
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="30, 90, 365..."
          min="1"
          required
        />
        <Input
          label="Fiyat (TL) *"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
        />
      </div>

      <Textarea
        label="Özellikler"
        name="features"
        value={formData.features}
        onChange={handleChange}
        rows={5}
        placeholder="Her satıra bir özellik yazın:&#10;Grup dersleri&#10;Özel antrenör&#10;Sauna erişimi"
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
          Paket Aktif
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          İptal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Kaydediliyor...' : initialData ? 'Güncelle' : 'Kaydet'}
        </Button>
      </div>
    </form>
  );
}
