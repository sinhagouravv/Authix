import mongoose, { Document, Model } from 'mongoose';

export interface IVendor extends Document {
  vendorId: string;
  name?: string;
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

const VendorSchema = new mongoose.Schema<IVendor>({
  vendorId: { type: String, required: true, unique: true },
  name: { type: String },
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

export const Vendor: Model<IVendor> = (mongoose.models.Vendor as Model<IVendor>) || mongoose.model<IVendor>('Vendor', VendorSchema);

