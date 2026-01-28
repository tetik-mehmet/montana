import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMember extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  status: 'active' | 'inactive' | 'expired';
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema = new Schema<IMember>(
  {
    firstName: {
      type: String,
      required: [true, 'Ad zorunludur'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Soyad zorunludur'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email zorunludur'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Telefon zorunludur'],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, 'Doğum tarihi zorunludur'],
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: [true, 'Cinsiyet zorunludur'],
    },
    address: {
      type: String,
      trim: true,
    },
    emergencyContact: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired'],
      default: 'inactive',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
MemberSchema.index({ email: 1 });
MemberSchema.index({ status: 1 });
MemberSchema.index({ createdAt: -1 });

const Member: Model<IMember> = mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);

export default Member;
