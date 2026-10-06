import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { connectDB } from '../config/db.js';

dotenv.config();

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@portfolio.com').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || 'change_this_secure_admin_password_123';

  console.log(`[Seed Admin] Connecting to MongoDB to provision admin: ${email}...`);
  const conn = await connectDB();

  if (!conn) {
    console.error('[Seed Admin Error] Cannot connect to MongoDB. Verify MONGODB_URI in .env.');
    process.exit(1);
  }

  try {
    let admin = await User.findOne({ email });

    if (admin) {
      console.log(`[Seed Admin] Admin account for ${email} already exists. Updating credentials...`);
      admin.password = password;
      await admin.save();
      console.log(`[Seed Admin Success] Password updated successfully for ${email}.`);
    } else {
      console.log(`[Seed Admin] Creating new admin account for ${email}...`);
      admin = new User({
        email,
        password,
        role: 'admin'
      });
      await admin.save();
      console.log(`[Seed Admin Success] Admin account provisioned successfully for ${email}.`);
    }

    console.log('[Seed Admin Notice] You can now log in via POST /api/auth/login or through the admin dashboard.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Admin Error] Failed to provision admin: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
}

seedAdmin();
