import mongoose, { Document, Model } from 'mongoose';

export interface IVaultPassword extends Document {
  vaultType: string;
  password: string;
  updatedAt: Date;
}

const VaultPasswordSchema = new mongoose.Schema<IVaultPassword>({
  vaultType: { type: String, required: true, unique: true }, // e.g., 'logs-vault', 'admin-vault'
  password: { type: String, required: true }, // Hashed 6-digit password
  updatedAt: { type: Date, default: Date.now }
}, { collection: 'vault_passwords' });

export const VaultPassword: Model<IVaultPassword> = (mongoose.models.VaultPassword as Model<IVaultPassword>) || mongoose.model<IVaultPassword>('VaultPassword', VaultPasswordSchema);

