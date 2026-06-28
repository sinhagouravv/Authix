import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true, minlength: 9, maxlength: 9 },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'superadmin' },
  passkeys: [{
    credentialID: { type: String, required: true },
    publicKey: { type: String, required: true },
    counter: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  }],
  currentChallenge: { type: String },
}, { timestamps: true, collection: 'admin' });

export const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
