'use server';

export async function getPayments() {
  try {
    const response = await fetch('http://localhost:5002/api/payments', {
      cache: 'no-store'
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.map((p: any) => ({
      ...p,
      paidAt: new Date(p.createdAt)
    }));
  } catch (error) {
    console.error('Fetch payments error:', error);
    return [];
  }
}

export async function deletePayment(id: string) {
  try {
    const response = await fetch(`http://localhost:5002/api/payments/${id}`, {
      method: 'DELETE'
    });
    return await response.json();
  } catch (error) {
    console.error('Delete payment error:', error);
    return { success: false, error: 'Failed to delete payment' };
  }
}
