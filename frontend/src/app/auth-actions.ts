'use server';

import { cookies, headers } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5002';

export async function registerVendor(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  try {
    const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const result = await res.json();
    
    if (res.ok) {
      const setCookieHeader = res.headers.get('set-cookie');
      if (setCookieHeader) {
        const cookieStore = await cookies();
        // Parse the token from the header
        const tokenMatch = setCookieHeader.match(/vendor_token=([^;]+)/);
        if (tokenMatch) {
          cookieStore.set('vendor_token', tokenMatch[1], {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 2,
            path: '/',
          });
        }
      }

      return { success: true, message: result.message, vendorId: result.vendorId as string };
    } else {
      return { success: false, error: result.error || 'Registration failed' };
    }

  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Backend connection failed' };
  }
}

export async function loginVendor(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const headerList = await headers();
    const userAgent = headerList.get('user-agent') || '';

    const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': userAgent
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await res.json();
    
    if (res.ok) {
      const setCookieHeader = res.headers.get('set-cookie');
      if (setCookieHeader) {
        const cookieStore = await cookies();
        const tokenMatch = setCookieHeader.match(/vendor_token=([^;]+)/);
        if (tokenMatch) {
          cookieStore.set('vendor_token', tokenMatch[1], {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 2,
            path: '/',
          });
        }
      }
      return { success: true, message: result.message };
    } else {
      return { success: false, error: result.error || 'Login failed' };
    }

  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Backend connection failed' };
  }
}

export async function logoutVendor() {
  const cookieStore = await cookies();
  const token = cookieStore.get('vendor_token')?.value;
  cookieStore.delete('vendor_token');
  
  try {
    const headerList = await headers();
    const userAgent = headerList.get('user-agent') || '';

    await fetch(`${BACKEND_URL}/api/auth/logout`, { 
      method: 'POST',
      headers: {
        'User-Agent': userAgent,
        'Cookie': `vendor_token=${token}`
      }
    });
  } catch (err) {}
  
  return { success: true };
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
