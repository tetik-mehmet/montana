import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPackage extends Document {
  name: string;
  description?: string;
  duration: number; // Gün cinsinden
  price: number;
  features?: string[];
  isActive: boolean;
  createdAt: Date;
}

const PackageSchema = new Schema<IPackage>({
  name: {
    type: String,
    required: [true, 'Paket adı zorunludur'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'Süre zorunludur'],
    min: [1, 'Süre en az 1 gün olmalıdır'],
  },
  price: {
    type: Number,
    required: [true, 'Fiyat zorunludur'],
    min: [0, 'Fiyat 0\'dan küçük olamaz'],
  },
  features: {
    type: [String],
    default: [],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index
PackageSchema.index({ isActive: 1 });
PackageSchema.index({ createdAt: -1 });

const Package: Model<IPackage> = mongoose.models.Package || mongoose.model<IPackage>('Package', PackageSchema);

export default Package;
