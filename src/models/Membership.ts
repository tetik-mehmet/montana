import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMembership extends Document {
  member: mongoose.Types.ObjectId;
  package: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  price: number;
  paymentMethod?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MembershipSchema = new Schema<IMembership>(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: [true, 'Üye zorunludur'],
    },
    package: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
      required: [true, 'Paket zorunludur'],
    },
    startDate: {
      type: Date,
      required: [true, 'Başlangıç tarihi zorunludur'],
    },
    endDate: {
      type: Date,
      required: [true, 'Bitiş tarihi zorunludur'],
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active',
    },
    price: {
      type: Number,
      required: [true, 'Fiyat zorunludur'],
      min: [0, 'Fiyat 0\'dan küçük olamaz'],
    },
    paymentMethod: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
MembershipSchema.index({ member: 1 });
MembershipSchema.index({ package: 1 });
MembershipSchema.index({ status: 1 });
MembershipSchema.index({ endDate: 1 });
MembershipSchema.index({ createdAt: -1 });

const Membership: Model<IMembership> = mongoose.models.Membership || mongoose.model<IMembership>('Membership', MembershipSchema);

export default Membership;
