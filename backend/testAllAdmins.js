import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';

dotenv.config();

const testAllAdmins = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected to Production MongoDB');
    
    // Get all admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`👑 Found ${adminUsers.length} admin users:`);
    
    for (const admin of adminUsers) {
      console.log(`\n📧 Testing: ${admin.email}`);
      
      // Test with common passwords
      const commonPasswords = ['admin123', 'password', 'admin', '123456', 'admin@123'];
      
      for (const password of commonPasswords) {
        const isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
          console.log(`✅ Password found: ${password}`);
          break;
        }
      }
      
      // Reset password to admin123 for all admins
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.updateOne(
        { _id: admin._id },
        { password: hashedPassword }
      );
      console.log(`🔄 Password reset to 'admin123' for ${admin.email}`);
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testAllAdmins();
