import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI not found in .env file');
  process.exit(1);
}

const AdminSchema = new mongoose.Schema({
  adminId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'superadmin' },
}, { timestamps: true, collection: 'admin' });

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected successfully.');

    const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);

    const adminId = "927401385";
    const password = "Pass@1234";
    const email = "admin@authix.com";

    const existing = await Admin.findOne({ adminId });
    if (existing) {
      console.log(`Admin with ID ${adminId} already exists in the "admin" collection.`);
    } else {
      const hashedPassword = await bcrypt.hash(password, 12);
      await Admin.create({
        adminId,
        email,
        password: hashedPassword,
        role: 'superadmin'
      });
      console.log('Successfully created Admin account in the "admin" collection!');
    }

    await mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
