import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { dbConnect } from './lib/db';
import { Vendor } from './models/Vendor';
import { Admin } from './models/Admin';
import { Payment } from './models/Payment';
import { generateUniqueVendorId } from './lib/vendorUtils';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Log } from './models/Log';
import { logAction } from './lib/logger';
import { Application } from './models/Application';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;
const JWT_SECRET = process.env.JWT_SECRET || 'authix_secret_key_2024';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

function generatePaymentId() {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const shuffled = digits.sort(() => 0.5 - Math.random());
  return 'PAY' + shuffled.slice(0, 5).join('');
}

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

dbConnect();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Authix Backend API', status: 'running' });
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ error: 'Vendor already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const vendorId = await generateUniqueVendorId();
    
    const vendor = await Vendor.create({
      vendorId,
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { id: vendor._id, email: vendor.email, vendorId: vendor.vendorId },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.cookie('vendor_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
      path: '/',
    });

    res.status(201).json({ 
      success: true,
      message: 'Vendor registered successfully', 
      vendorId: vendor.vendorId 
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: vendor._id, email: vendor.email, vendorId: vendor.vendorId },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.cookie('vendor_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
      path: '/',
    });

    res.json({ success: true, message: 'Logged in successfully' });
    
    // Log successful login
    await logAction({
      vendorId: vendor.vendorId,
      vendorName: (vendor as any).name || vendor.email.split('@')[0],
      vendorEmail: vendor.email,
      action: 'LOGIN',
      status: 'SUCCESS',
      req
    });
  } catch (error) {
    console.error('Login error:', error);
    // Log failed login if vendor exists
    const { email } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (vendor) {
      await logAction({
        vendorId: vendor.vendorId,
        vendorName: (vendor as any).name || vendor.email.split('@')[0],
        vendorEmail: vendor.email,
        action: 'LOGIN',
        status: 'FAILED',
        req
      });
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/vendor/panel-login', async (req, res) => {
  const { vendorId, password } = req.body;

  if (!vendorId || !password) {
    return res.status(400).json({ error: 'Vendor ID and password are required' });
  }

  // Temporary hardcoded password check for vendor panel
  if (password !== 'Pass@1234') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  try {
    const vendor = await Vendor.findOne({ vendorId });
    if (!vendor) {
      return res.status(401).json({ error: 'Vendor not found' });
    }

    const token = jwt.sign(
      { id: vendor._id, email: vendor.email, vendorId: vendor.vendorId },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.cookie('vendor_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 8,
      path: '/',
    });

    res.json({ 
      success: true, 
      message: 'Logged in successfully',
      token 
    });

    await logAction({
      vendorId: vendor.vendorId,
      vendorName: (vendor as any).name || vendor.email.split('@')[0],
      vendorEmail: vendor.email,
      action: 'LOGIN',
      portal: 'vendor',
      status: 'SUCCESS',
      req
    });
  } catch (error) {
    console.error('Vendor Panel Login error:', error);
  }
});

app.post('/api/vendor/logout', async (req, res) => {
  const token = req.cookies.vendor_token;
  console.log('Logout triggered, token present:', !!token);
  
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      console.log('Decoded token for logout:', decoded.vendorId);
      
      const vendor = await Vendor.findById(decoded.id);
      
      // Log logout action
      await logAction({
        vendorId: vendor?.vendorId || decoded.vendorId || 'UNKNOWN',
        vendorName: (vendor as any)?.name || decoded.email?.split('@')[0] || 'Unknown Vendor',
        vendorEmail: vendor?.email || decoded.email || 'unknown@vendor.com',
        action: 'LOGOUT',
        portal: 'vendor',
        status: 'SUCCESS',
        req
      });
      console.log('Logout logged for:', decoded.vendorId);
    } catch (error) {
      console.error('Logout logging error:', error);
    }
  }
  res.clearCookie('vendor_token');
  res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/api/admin/login', async (req, res) => {
  const { adminId, password } = req.body;

  try {
    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid Admin ID or Password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid Admin ID or Password' });
    }

    const token = jwt.sign(
      { id: admin._id, adminId: admin.adminId, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.cookie('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24,
      path: '/',
    });

    res.json({ success: true, message: 'Logged in successfully' });
  } catch (error) {
    console.error('Admin Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/auth/session', async (req, res) => {
  const token = req.cookies.vendor_token;
  if (!token) return res.json({ user: null });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.json({ user: null });
  }
});



app.post('/api/vendor/apps', async (req, res) => {
  const { name, websiteUrl, description, vendorId } = req.body;

  try {
    const clientId = `authix_cli_${crypto.randomBytes(6).toString('hex')}`;
    const clientSecret = `authix_sec_${crypto.randomBytes(16).toString('hex')}`;

    const app = await Application.create({
      vendorId,
      name,
      websiteUrl,
      description,
      clientId,
      clientSecret
    });

    res.json({ success: true, app });
  } catch (error) {
    console.error('App registration error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/vendor/apps/:id/regenerate', async (req, res) => {
  const { id } = req.params;
  const { vendorId } = req.body;

  try {
    const newSecret = `authix_sec_${crypto.randomBytes(16).toString('hex')}`;
    const app = await Application.findOneAndUpdate(
      { _id: id, vendorId },
      { clientSecret: newSecret },
      { new: true }
    );

    if (!app) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json({ success: true, clientSecret: newSecret });
  } catch (error) {
    console.error('Key regeneration error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/auth/logout', async (req, res) => {
  const token = req.cookies.vendor_token;
  if (token) {
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const vendor = await Vendor.findById(decoded.id);
      if (vendor) {
        await logAction({
          vendorId: vendor.vendorId,
          vendorName: (vendor as any).name || vendor.email.split('@')[0],
          vendorEmail: vendor.email,
          action: 'LOGOUT',
          status: 'SUCCESS',
          req
        });
      }
    } catch (err) {
      console.error('Logout logging error:', err);
    }
  }
  res.clearCookie('vendor_token');
  res.json({ success: true });
});

app.get('/api/logs', async (req, res) => {
  try {
    const logs = await Log.find({}).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    console.error('Fetch logs error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/logs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const log = await Log.findByIdAndDelete(id);
    if (!log) {
      return res.status(404).json({ error: 'Log entry not found' });
    }
    res.json({ success: true, message: 'Log entry deleted successfully' });
  } catch (error) {
    console.error('Delete log error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.find({}).sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) {
    console.error('Fetch vendors error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/vendors/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const vendor = await Vendor.findByIdAndDelete(id);
    if (!vendor) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json({ success: true, message: 'Vendor deleted successfully' });
  } catch (error) {
    console.error('Delete vendor error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Razorpay Payment Routes
app.post('/api/payment/order', async (req, res) => {
  const { amount, currency = 'INR' } = req.body;

  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (error) {
    console.error('Razorpay Order Error:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

app.post('/api/payment/verify', async (req, res) => {
  const { 
    razorpay_order_id, 
    razorpay_payment_id, 
    razorpay_signature,
    amount,
    vendorId,
    vendorName,
    vendorEmail,
    tierName
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '')
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    // Extra security: Fetch payment from Razorpay to confirm status
    try {
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      
      if (payment.status !== 'captured' && payment.status !== 'authorized') {
        return res.status(400).json({ success: false, message: "Payment not successful on Razorpay" });
      }

      // Save payment record
      const paymentRecord = new Payment({
        paymentId: generatePaymentId(),
        vendorId: vendorId || 'VEND-GHOST',
        vendorName: vendorName || 'Anonymous Vendor',
        vendorEmail: vendorEmail || 'unknown@example.com',
        amount: amount ? `₹${amount}` : '—',
        method: 'net banking',
        status: 'Success',
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      });
      await paymentRecord.save();
      return res.json({ success: true, message: "Payment verified, confirmed, and recorded successfully" });
    } catch (error) {
      console.error('Razorpay Fetch/Save Error:', error);
      return res.status(500).json({ success: false, message: "Payment verified but failed to confirm/save" });
    }
  } else {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }
});

app.get('/api/payments', async (req, res) => {
  try {
    const payments = await Payment.find({}).sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error('Fetch payments error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/payments/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment record not found' });
    }
    res.json({ success: true, message: 'Payment record deleted successfully' });
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
