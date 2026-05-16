import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  vendorId: { type: String, required: true },
  name: { type: String, required: true },
  clientId: { type: String, required: true, unique: true },
  clientSecret: { type: String, required: true },
  websiteUrl: { type: String },
  description: { type: String },
  status: { type: String, enum: ['ACTIVE', 'SUSPENDED'], default: 'ACTIVE' },
}, { timestamps: true });

export const Application = mongoose.model('Application', ApplicationSchema);
