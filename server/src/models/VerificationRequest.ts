import mongoose, { Document, Model } from 'mongoose';

export interface IVerificationFactors {
  factor1_password: boolean;
  factor2_totp: boolean;
  factor3_mobile_biometric: boolean;
}

export type VerificationStatus = 'PENDING' | 'WAITING_TOTP' | 'WAITING_MOBILE_APPROVAL' | 'VERIFIED' | 'FAILED' | 'EXPIRED' | 'CANCELLED';

export interface IVerificationRequest extends Document {
  requestId: string;
  clientId: string;
  userId: string;
  userEmail?: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: string;
  status: VerificationStatus;
  factors: IVerificationFactors;
  totpSecret?: string;
  biometricProof?: string;
  deviceApprovedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationRequestSchema = new mongoose.Schema<IVerificationRequest>({
  requestId: { type: String, required: true, unique: true, index: true },
  clientId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  userEmail: { type: String },
  action: { type: String, default: 'LOGIN' },
  ipAddress: { type: String },
  userAgent: { type: String },
  deviceInfo: { type: String },
  
  // Status state machine
  status: { 
    type: String, 
    enum: ['PENDING', 'WAITING_TOTP', 'WAITING_MOBILE_APPROVAL', 'VERIFIED', 'FAILED', 'EXPIRED', 'CANCELLED'], 
    default: 'WAITING_TOTP' 
  },
  
  // Multi-factor checkpoints
  factors: {
    factor1_password: { type: Boolean, default: true },
    factor2_totp: { type: Boolean, default: false },
    factor3_mobile_biometric: { type: Boolean, default: false },
  },
  
  totpSecret: { type: String },
  biometricProof: { type: String },
  deviceApprovedAt: { type: Date },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }, // Auto TTL cleanup
}, { timestamps: true });

export const VerificationRequest: Model<IVerificationRequest> = (mongoose.models.VerificationRequest as Model<IVerificationRequest>) || mongoose.model<IVerificationRequest>('VerificationRequest', VerificationRequestSchema);

