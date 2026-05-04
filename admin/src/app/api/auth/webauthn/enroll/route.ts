import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { WebAuthnService } from '@backend/lib/webauthn';
import { Admin } from '@/models/Admin';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const adminId = cookieStore.get('admin_id')?.value;

    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized: No Admin ID found' }, { status: 401 });
    }

    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    const userName = admin.email;

    console.log('[WebAuthn Register] delegating to Backend Service...');
    const options = await WebAuthnService.prepareRegistration(adminId, userName);
    
    return NextResponse.json(options);
  } catch (error: any) {
    console.error('[WebAuthn Register] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { registrationResponse } = body;
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    
    const cookieStore = await cookies();
    const adminId = cookieStore.get('admin_id')?.value;

    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized: No Admin ID found' }, { status: 401 });
    }

    console.log('[WebAuthn Register] delegating verification to Backend...');
    const result = await WebAuthnService.verifyRegistration(adminId, registrationResponse, origin);

    return NextResponse.json(result, { status: result.verified ? 200 : 400 });
  } catch (error: any) {
    console.error('[WebAuthn Register] Verification Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
