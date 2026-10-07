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
import { User } from './models/User';
import { VerificationRequest } from './models/VerificationRequest';
import { generateSecret, verifySync } from 'otplib';
import path from 'path';

dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

const app = express();
const PORT = Number(process.env.PORT) || 5002;
const JWT_SECRET = process.env.JWT_SECRET || 'authix_secret_key_2024';
const isProduction = process.env.NODE_ENV === 'production';

// Trust reverse proxies (Render, Cloudflare, Vercel)
app.set('trust proxy', 1);

export const getAuthCookieOptions = (maxAgeMs: number = 1000 * 60 * 60 * 24): express.CookieOptions => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: maxAgeMs,
  path: '/',
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

function generatePaymentId() {
  const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const shuffled = digits.sort(() => 0.5 - Math.random());
  return 'PAY' + shuffled.slice(0, 5).join('');
}

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  process.env.VENDOR_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (
      !origin || 
      /^http:\/\/localhost(:\d+)?$/.test(origin) || 
      origin.includes('vercel.app') || 
      origin.includes('onrender.com') || 
      origin.includes('authix') || 
      origin === 'null' ||
      allowedOrigins.includes(origin)
    ) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

dbConnect();

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Authix Backend API', status: 'running' });
});

app.get('/setup', (req, res) => {
  const query = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/setup${query}`);
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

    res.cookie('vendor_token', token, getAuthCookieOptions(1000 * 60 * 60 * 2));

    res.status(201).json({ 
      success: true,
      message: 'Vendor registered successfully', 
      vendorId: vendor.vendorId,
      token
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

    res.cookie('vendor_token', token, getAuthCookieOptions(1000 * 60 * 60 * 2));

    res.json({ success: true, message: 'Logged in successfully', token });
    
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

    res.cookie('vendor_token', token, getAuthCookieOptions(1000 * 60 * 60 * 8));

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
  const authHeader = req.headers.authorization;
  const token = req.cookies.vendor_token || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);
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
  res.clearCookie('vendor_token', getAuthCookieOptions());
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

    res.cookie('admin_token', token, getAuthCookieOptions(1000 * 60 * 60 * 24));

    res.json({ success: true, message: 'Logged in successfully', token });
  } catch (error) {
    console.error('Admin Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/auth/session', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies.vendor_token || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);
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

/* ==========================================================================
   3-FACTOR AUTHENTICATION (3FA) VERIFICATION ENDPOINTS
   Factor 1: Primary Auth (Handled by client app / Authix)
   Factor 2: Time-based One Time Password (TOTP)
   Factor 3: Mobile Out-of-Band Biometric / Push Confirmation
   ========================================================================== */

// 1. Start 3FA Challenge
app.post('/api/start-verification', async (req, res) => {
  const { clientId, userId, userEmail, action = 'LOGIN' } = req.body;

  if (!clientId || !userId) {
    return res.status(400).json({ success: false, error: 'clientId and userId are required' });
  }

  try {
    const requestId = `authix_req_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes TTL

    // Find or fallback user totp secret
    let user = await User.findOne({ email: userEmail || userId });
    let totpSecret = user?.totpSecret;
    if (!totpSecret) {
      totpSecret = generateSecret();
    }

    const verification = await VerificationRequest.create({
      requestId,
      clientId,
      userId,
      userEmail: userEmail || (userId.includes('@') ? userId : `${userId}@authix.io`),
      action,
      ipAddress: (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown Client',
      status: 'WAITING_TOTP',
      factors: {
        factor1_password: true,
        factor2_totp: false,
        factor3_mobile_biometric: false,
      },
      totpSecret,
      expiresAt,
    });

    res.status(201).json({
      success: true,
      requestId: verification.requestId,
      status: verification.status,
      expiresInSeconds: 300,
      message: '3FA Challenge initiated. Factor 2 (TOTP) required.',
    });
  } catch (error: any) {
    console.error('[3FA] start-verification error:', error);
    res.status(500).json({ success: false, error: error?.message || 'Failed to initiate 3FA challenge' });
  }
});

// 2. Verify Factor 2 (TOTP)
app.post('/api/verify-totp', async (req, res) => {
  const { requestId, token, clientId } = req.body;

  if (!requestId || !token) {
    return res.status(400).json({ success: false, error: 'requestId and token are required' });
  }

  try {
    const request = await VerificationRequest.findOne({ requestId });
    if (!request) {
      return res.status(404).json({ success: false, error: 'Verification request not found or expired' });
    }

    if (request.status === 'EXPIRED' || new Date() > new Date(request.expiresAt)) {
      request.status = 'EXPIRED';
      await request.save();
      return res.status(400).json({ success: false, error: 'Verification challenge has expired' });
    }

    // Verify TOTP (Accept valid TOTP or demo passcodes '123456' / '000000' for quick testing)
    const isDemoCode = token === '123456' || token === '000000';
    let isValidTOTP = isDemoCode;

    if (!isValidTOTP && request.totpSecret) {
      try {
        const verifyRes = verifySync({ token, secret: request.totpSecret });
        isValidTOTP = !!verifyRes?.valid;
      } catch (e) {
        isValidTOTP = false;
      }
    }

    if (!isValidTOTP) {
      return res.status(400).json({ success: false, error: 'Invalid or expired 6-digit TOTP code' });
    }

    // Mark Factor 2 complete, advance to Factor 3 (Mobile Approval)
    request.factors.factor2_totp = true;
    request.status = 'WAITING_MOBILE_APPROVAL';
    await request.save();

    res.json({
      success: true,
      requestId: request.requestId,
      status: request.status,
      message: 'Factor 2 verified successfully. Proceeding to Factor 3 (Mobile Biometric Push Approval).',
    });
  } catch (error) {
    console.error('[3FA] verify-totp error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// 3. Check Challenge Status (Polled by Web SDK)
app.get('/api/check-status', async (req, res) => {
  const { requestId } = req.query;

  if (!requestId) {
    return res.status(400).json({ status: 'FAILED', error: 'requestId is required' });
  }

  try {
    const request = await VerificationRequest.findOne({ requestId: String(requestId) });
    if (!request) {
      return res.status(404).json({ requestId, status: 'FAILED', error: 'Challenge not found' });
    }

    if (request.status !== 'VERIFIED' && new Date() > new Date(request.expiresAt)) {
      request.status = 'EXPIRED';
      await request.save();
    }

    res.json({
      requestId: request.requestId,
      status: request.status,
      userId: request.userId,
      userEmail: request.userEmail,
      factors: request.factors,
      verifiedAt: request.deviceApprovedAt,
    });
  } catch (error) {
    console.error('[3FA] check-status error:', error);
    res.status(500).json({ requestId, status: 'FAILED', error: 'Internal Server Error' });
  }
});

// 4. Mobile Customer App: Get Pending 3FA Requests for a user
app.get('/api/mobile/pending-requests', async (req, res) => {
  const { userId } = req.query;

  try {
    const filter: any = {
      status: { $in: ['WAITING_MOBILE_APPROVAL', 'WAITING_TOTP'] },
      expiresAt: { $gt: new Date() }
    };
    if (userId) filter.userId = String(userId);

    const pending = await VerificationRequest.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: pending.length, requests: pending });
  } catch (error) {
    console.error('[Mobile 3FA] fetch pending error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch pending 3FA requests' });
  }
});

// 5. Mobile Customer App / Simulator: Approve Factor 3 (Biometric Push)
app.post('/api/mobile/approve', async (req, res) => {
  const { requestId, biometricProof = 'BIOMETRIC_PASSKEY_CONFIRMED', deviceId = 'iPhone-15-Pro' } = req.body;

  if (!requestId) {
    return res.status(400).json({ success: false, error: 'requestId is required' });
  }

  try {
    const request = await VerificationRequest.findOne({ requestId });
    if (!request) {
      return res.status(404).json({ success: false, error: 'Verification request not found' });
    }

    if (request.status === 'EXPIRED' || new Date() > new Date(request.expiresAt)) {
      request.status = 'EXPIRED';
      await request.save();
      return res.status(400).json({ success: false, error: 'Verification request has expired' });
    }

    // Complete Factor 3
    request.factors.factor3_mobile_biometric = true;
    request.status = 'VERIFIED';
    request.biometricProof = biometricProof;
    request.deviceInfo = deviceId;
    request.deviceApprovedAt = new Date();
    await request.save();

    // Log the 3FA login success in security logs
    await logAction({
      vendorId: request.clientId,
      vendorName: 'Authix 3FA Protection',
      vendorEmail: request.userEmail || request.userId,
      action: '3FA_VERIFICATION_COMPLETE',
      portal: 'frontend',
      status: 'SUCCESS',
      req
    });

    res.json({
      success: true,
      requestId: request.requestId,
      status: 'VERIFIED',
      message: 'Factor 3 biometric approval verified successfully. Full 3FA handshake complete.',
    });
  } catch (error) {
    console.error('[Mobile 3FA] approve error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// 6. Mobile Customer App: Reject / Deny 3FA Challenge
app.post('/api/mobile/reject', async (req, res) => {
  const { requestId, reason = 'USER_DENIED' } = req.body;

  if (!requestId) {
    return res.status(400).json({ success: false, error: 'requestId is required' });
  }

  try {
    const request = await VerificationRequest.findOne({ requestId });
    if (!request) {
      return res.status(404).json({ success: false, error: 'Verification request not found' });
    }

    request.status = 'FAILED';
    await request.save();

    await logAction({
      vendorId: request.clientId,
      vendorName: 'Authix 3FA Protection',
      vendorEmail: request.userEmail || request.userId,
      action: '3FA_VERIFICATION_REJECTED',
      portal: 'frontend',
      status: 'FAILED',
      req
    });

    res.json({
      success: true,
      requestId: request.requestId,
      status: 'FAILED',
      message: `3FA verification rejected (${reason})`,
    });
  } catch (error) {
    console.error('[Mobile 3FA] reject error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// 7. Instant Test Simulator for 3FA (simulates auto-approval for preview/development)
app.post('/api/mobile/simulate-approval', async (req, res) => {
  const { requestId } = req.body;

  if (!requestId) {
    return res.status(400).json({ success: false, error: 'requestId is required' });
  }

  try {
    const request = await VerificationRequest.findOne({ requestId });
    if (!request) {
      return res.status(404).json({ success: false, error: 'Verification request not found' });
    }

    request.factors.factor2_totp = true;
    request.factors.factor3_mobile_biometric = true;
    request.status = 'VERIFIED';
    request.deviceApprovedAt = new Date();
    request.biometricProof = 'SIMULATED_TOUCH_ID_SUCCESS';
    await request.save();

    res.json({
      success: true,
      requestId: request.requestId,
      status: 'VERIFIED',
      message: 'Simulated biometric 3FA approval completed.',
    });
  } catch (error) {
    console.error('[3FA Simulator] error:', error);
    res.status(500).json({ success: false, error: 'Simulator error' });
  }
});

// 8. Admin / Vendor 3FA Request Inspector
app.get('/api/admin/3fa-requests', async (req, res) => {
  try {
    const requests = await VerificationRequest.find({}).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: requests.length, requests });
  } catch (error) {
    console.error('[Admin] 3FA requests fetch error:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend server running on port ${PORT} in ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} mode`);
});
