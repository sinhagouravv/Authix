'use server';

export async function getLogs() {
  try {
    const response = await fetch('http://localhost:5002/api/logs', {
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
    const response = await fetch(`http://localhost:5002/api/logs/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('Delete log error:', error);
    return { success: false, error: 'Failed to delete log entry' };
  }
}
