import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  factorsEnabled: {
    password: boolean;
    emailOtp: boolean;
    totp: boolean;
  };
  totpSecret?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new mongoose.Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  factorsEnabled: {
    password: { type: Boolean, default: true },
    emailOtp: { type: Boolean, default: false },
    totp: { type: Boolean, default: false },
  },
  totpSecret: { type: String },
  isVerified: { type: Boolean, default: false },
}, { timestamps: true });

export const User: Model<IUser> = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

