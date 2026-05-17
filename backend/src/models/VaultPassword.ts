import mongoose from 'mongoose';

const VaultPasswordSchema = new mongoose.Schema({
  vaultType: { type: String, required: true, unique: true }, // e.g., 'logs-vault', 'admin-vault'
  password: { type: String, required: true }, // Hashed 6-digit password
  updatedAt: { type: Date, default: Date.now }
}, { collection: 'vault_passwords' });

export const VaultPassword = mongoose.models.VaultPassword || mongoose.model('VaultPassword', VaultPasswordSchema);
