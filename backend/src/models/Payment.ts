import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  vendorId: { type: String, required: true },
  vendorName: { type: String, required: true },
  vendorEmail: { type: String, required: true },
  amount: { type: String, required: true },
  currency: { type: String, default: 'INR' },
  method: { type: String, required: true },
  status: { type: String, required: true, enum: ['Success', 'Pending', 'Failed'] },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
}, { timestamps: true });

export const Payment = mongoose.model('Payment', PaymentSchema);
