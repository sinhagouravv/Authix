'use server';

import { BACKEND_URL } from '@/config/api';

export async function getLogs() {
  try {
    const response = await fetch(`${BACKEND_URL}/api/logs`, {
      cache: 'no-store'
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Fetch logs error:', error);
    return [];
  }
}

export async function deleteLog(id: string) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/logs/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('Delete log error:', error);
    return { success: false, error: 'Failed to delete log entry' };
  }
}
