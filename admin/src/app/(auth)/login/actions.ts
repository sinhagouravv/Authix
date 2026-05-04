'use server';

import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5002';

export async function loginAction(adminId: string, password: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ adminId, password }),
    });

    const result = await res.json();

    if (res.ok) {
      const setCookieHeader = res.headers.get('set-cookie');
      if (setCookieHeader) {
        const cookieStore = await cookies();
        const tokenMatch = setCookieHeader.match(/admin_token=([^;]+)/);
        if (tokenMatch) {
          cookieStore.set('admin_token', tokenMatch[1], {
            path: '/',
            maxAge: 86400,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
          });
        }
      }

      const cookieStore = await cookies();
      cookieStore.set('admin_id', adminId, {
        path: '/',
        maxAge: 86400,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      return { success: true };
    }

    return { success: false, message: result.error || 'Invalid Admin ID or Password' };
  } catch (error: any) {
    console.error('Login Error:', error);
    return { success: false, message: 'An error occurred during login. Please try again.' };
  }
}

