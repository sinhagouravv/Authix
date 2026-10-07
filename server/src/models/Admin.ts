import mongoose, { Document, Model } from 'mongoose';

export interface IPasskey {
  credentialID: string;
  publicKey: string;
  counter: number;
  createdAt?: Date;
}

export interface IAdmin extends Document {
  adminId: string;
  password: string;
  email: string;
  role: string;
  passkeys: IPasskey[];
  currentChallenge?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new mongoose.Schema<IAdmin>({
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

export const Admin: Model<IAdmin> = (mongoose.models.Admin as Model<IAdmin>) || mongoose.model<IAdmin>('Admin', AdminSchema);

