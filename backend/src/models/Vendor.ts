import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({
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

export const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);
