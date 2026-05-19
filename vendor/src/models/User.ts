import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
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

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
