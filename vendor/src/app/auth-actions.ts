'use server';

import { cookies, headers } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5002';

export async function loginVendor(prevState: any, formData: FormData) {
  const vendorId = formData.get('vendorId') as string;
  const password = formData.get('password') as string;
  
  const headerStore = await headers();
  const userAgent = headerStore.get('user-agent') || '';

  try {
    const res = await fetch(`${BACKEND_URL}/api/vendor/panel-login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': userAgent
      },
      body: JSON.stringify({ vendorId, password }),
    });

    const result = await res.json();

    if (!res.ok) {
      return { error: result.error || 'Login failed' };
    }

    // Set the cookie manually so server actions can see it
    const cookieStore = await cookies();
    cookieStore.set('vendor_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    });

    return { success: true };
  } catch (err) {
    return { error: 'Failed to connect to the server' };
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('vendor_token')?.value;

  if (!token) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/session`, {
      headers: { 'Cookie': `vendor_token=${token}` }
    });
    const data = await res.json();
    return data.user;
  } catch (err) {
    return null;
  }
}
export async function logoutVendor() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const token = cookieStore.get('vendor_token')?.value;
  const userAgent = headerStore.get('user-agent') || '';

  console.log('[Vendor Auth] Logout initiated. Token found:', !!token);

  if (token) {
    try {
      const res = await fetch(`${BACKEND_URL}/api/vendor/logout`, {
        method: 'POST',
        headers: { 
          'Cookie': `vendor_token=${token}`,
          'User-Agent': userAgent
        }
      });
      console.log('[Vendor Auth] Backend logout response status:', res.status);
    } catch (err) {
      console.error('[Vendor Auth] Backend logout fetch error:', err);
    }
  }

  cookieStore.delete('vendor_token');
}
