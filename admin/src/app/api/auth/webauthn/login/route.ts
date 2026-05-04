import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { WebAuthnService } from '@backend/lib/webauthn';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = await cookies();
    const adminId = cookieStore.get('admin_id')?.value;

    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized: No Admin ID found' }, { status: 401 });
    }

    console.log('[WebAuthn Login] delegating to Backend Service...');
    const options = await WebAuthnService.prepareAuthentication(adminId);
    
    return NextResponse.json(options);
  } catch (error: any) {
    console.error('[WebAuthn Login] Error:', error);
    return NextResponse.json({ error: error.message }, { status: error.message.includes('No passkeys') ? 404 : 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { authResponse } = body;
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    
    const cookieStore = await cookies();
    const adminId = cookieStore.get('admin_id')?.value;

    if (!adminId) {
      return NextResponse.json({ error: 'Unauthorized: No Admin ID found' }, { status: 401 });
    }

    console.log('[WebAuthn Login] delegating verification to Backend...');
    const result = await WebAuthnService.verifyAuthentication(adminId, authResponse, origin);

    return NextResponse.json(result, { status: result.verified ? 200 : 400 });
  } catch (error: any) {
    console.error('[WebAuthn Login] Verification Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
