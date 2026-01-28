import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email zorunludur'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Şifre zorunludur'],
  },
  name: {
    type: String,
    required: [true, 'İsim zorunludur'],
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index
UserSchema.index({ email: 1 });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
