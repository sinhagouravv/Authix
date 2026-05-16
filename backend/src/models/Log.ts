import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  vendorId: { type: String, required: true },
  vendorName: { type: String },
  vendorEmail: { type: String, required: true },
  action: { type: String, required: true },
  portal: { type: String, required: true, enum: ['frontend', 'vendor'], default: 'frontend' },
  status: { type: String, required: true, enum: ['SUCCESS', 'FAILED'] },
  ip: { type: String },
  os: { type: String },
  browser: { type: String },
  userAgent: { type: String },
}, { timestamps: true });

export const Log = mongoose.model('Log', LogSchema);
