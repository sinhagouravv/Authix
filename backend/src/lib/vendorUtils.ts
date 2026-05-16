import { Vendor } from '../models/Vendor';

/**
 * Generates a unique 8-digit vendor_id.
 * Rules:
 * 1. Starts with '6'.
 * 2. Total 8 digits.
 * 3. Remaining 7 digits are random.
 * 4. Digit '0' is not allowed.
 * 5. No repeating digits within the ID.
 * 6. Must be unique in the database.
 */
export async function generateUniqueVendorId(): Promise<string> {
  const allowedDigits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  let isUniqueInDb = false;
  let vendorId = '';

  while (!isUniqueInDb) {
    vendorId = '6';
    let pool = allowedDigits.filter(d => d !== '6');
    
    for (let i = 0; i < 7; i++) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      const digit = pool.splice(randomIndex, 1)[0];
      vendorId += digit;
    }

    const existing = await Vendor.findOne({ vendorId });
    if (!existing) {
      isUniqueInDb = true;
    }
  }

  return vendorId;
}
