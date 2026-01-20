import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';

dotenv.config();

const createAdminInCorrectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected to hybridx database');
    
    // Check if admin2@hybridx.com exists
    let adminUser = await User.findOne({ email: 'admin2@hybridx.com' });
    
    if (!adminUser) {
      // Create the admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin2@hybridx.com',
        password: hashedPassword,
        role: 'admin',
        phone: '1234567890',
        classLevel: '12th',
        batch: 'Batch 1'
      });
      console.log('✅ Created admin2@hybridx.com in hybridx database');
    } else {
      // Reset password
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.updateOne(
        { email: 'admin2@hybridx.com' },
        { password: hashedPassword }
      );
      console.log('✅ Reset password for admin2@hybridx.com in hybridx database');
    }
    
    // Test login
    const testUser = await User.findOne({ email: 'admin2@hybridx.com' });
    const isMatch = await bcrypt.compare('admin123', testUser.password);
    console.log('🔐 Password test result:', isMatch);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

createAdminInCorrectDB();
