/**
 * Centralized API & URL configuration for Authix SDK
 */

export const PRODUCTION_BASE_URL = "https://authix-5nkr.onrender.com/api";
export const LOCAL_BASE_URL = "http://localhost:5002/api";

export const PRODUCTION_SETUP_URL = "https://authix-5nkr.onrender.com/setup";
export const LOCAL_SETUP_URL = "http://localhost:3000/setup";

export const DEFAULT_BASE_URL =
  (typeof process !== "undefined" && (process.env?.NEXT_PUBLIC_AUTHIX_BASE_URL || process.env?.AUTHIX_BASE_URL)) ||
  (typeof process !== "undefined" && process.env?.NODE_ENV === "production" ? PRODUCTION_BASE_URL : LOCAL_BASE_URL);

export const DEFAULT_SETUP_URL =
  (typeof process !== "undefined" && (process.env?.NEXT_PUBLIC_AUTHIX_SETUP_URL || process.env?.AUTHIX_SETUP_URL)) ||
  (typeof process !== "undefined" && process.env?.NODE_ENV === "production" ? PRODUCTION_SETUP_URL : LOCAL_SETUP_URL);
