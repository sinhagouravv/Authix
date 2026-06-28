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
  passkeys: [{
    credentialID: { type: String, required: true },
    publicKey: { type: String, required: true },
    counter: { type: Number, default: 0 },
    deviceType: { type: String },
    backedUp: { type: Boolean },
    transports: [String],
    createdAt: { type: Date, default: Date.now },
  }],
  currentChallenge: { type: String },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
