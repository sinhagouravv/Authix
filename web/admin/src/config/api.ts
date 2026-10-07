/**
 * Centralized API configuration for Admin Panel
 * Uses Render production backend by default in production, and localhost in local development.
 * Can also be overridden with process.env.NEXT_PUBLIC_BACKEND_URL or process.env.BACKEND_URL.
 */

export const PRODUCTION_BACKEND_URL = 'https://authix-5nkr.onrender.com';
export const LOCAL_BACKEND_URL = 'http://localhost:5002';

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  (process.env.NODE_ENV === 'production' ? PRODUCTION_BACKEND_URL : LOCAL_BACKEND_URL);
