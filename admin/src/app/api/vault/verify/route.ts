import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';

import { VaultPassword } from '@backend/models/VaultPassword';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { otp, vaultType = 'logs-vault' } = await req.json();

    // Fetch the specific vault password by type
    const vaultEntry = await VaultPassword.findOne({ vaultType });
    if (!vaultEntry) {
      return NextResponse.json({ error: `Vault password for '${vaultType}' not initialized` }, { status: 404 });
    }

    const isValid = await bcrypt.compare(otp, vaultEntry.password);

    if (isValid) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Incorrect password' }, { status: 401 });
    }
  } catch (error: any) {
    console.error('[Vault Verify API] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
