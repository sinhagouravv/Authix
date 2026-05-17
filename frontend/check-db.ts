import mongoose from 'mongoose';
import dbConnect from './src/lib/db';
import { Vendor } from './src/models/Vendor';
import dotenv from 'dotenv';

dotenv.config();

async function checkDB() {
  try {
    await dbConnect();
    const count = await Vendor.countDocuments();
    const vendors = await Vendor.find().limit(5);
    console.log(`Total Vendors: ${count}`);
    console.log('Last 5 Vendors:', vendors);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkDB();
