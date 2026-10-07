'use server';

import { BACKEND_URL } from '@/config/api';

export async function getVendors() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/vendors`, {
      cache: 'no-store'
      
    });
    if (!res.ok) return [];
    
    const vendors = await res.json();
    return vendors;
  } catch (error) {
    console.error('Action Failed to fetch vendors:', error);
    return [];
  }
}

export async function deleteVendor(id: string) {
  try {
    const res = await fetch(`${BACKEND_URL}/api/vendors/${id}`, {
      method: 'DELETE',
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.error('Action Failed to delete vendor:', error);
    return { error: 'Failed to delete vendor' };
  }
}

