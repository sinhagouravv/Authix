import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Admin } from '@backend/models/Admin';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    await dbConnect();

    const initialAdminId = process.env.INITIAL_ADMIN_ID || "927401385";
    const initialAdminPassword = process.env.INITIAL_ADMIN_PASSWORD || "admin123";

    // 1. Atomic Purge: Remove existing admin to ensure a clean slate
    await Admin.deleteMany({ adminId: initialAdminId });

    // 2. Fresh Creation: Create the superadmin with zero passkeys
    const hashedPassword = await bcrypt.hash(initialAdminPassword, 10);
    
    await Admin.create({
      adminId: initialAdminId,
      email: "admin@authix.com",
      password: hashedPassword,
      role: "superadmin",
      passkeys: [] // Ensure passkeys are absolutely empty
    });

    console.log('[Setup Admin] Database purged and recreated successfully.');

    return NextResponse.json({ 
      success: true, 
      message: "Admin database has been completely reset. You can now register a fresh biometric key." 
    });
  } catch (error: any) {
    console.error('[Setup Admin] Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
