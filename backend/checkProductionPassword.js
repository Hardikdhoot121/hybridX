import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';

dotenv.config();

const checkProductionPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected to Production MongoDB');
    
    // Find the admin user
    const adminUser = await User.findOne({ email: 'admin2@hybridx.com' });
    if (adminUser) {
      console.log('✅ Found admin2@hybridx.com');
      
      // Test password comparison
      const testResult = await bcrypt.compare('admin123', adminUser.password);
      console.log('🔐 Password "admin123" comparison result:', testResult);
      
      if (!testResult) {
        console.log('🔄 Resetting password...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await User.updateOne(
          { email: 'admin2@hybridx.com' },
          { password: hashedPassword }
        );
        console.log('✅ Password reset to "admin123"');
        
        // Test again
        const testResult2 = await bcrypt.compare('admin123', adminUser.password);
        console.log('🔐 New password comparison result:', testResult2);
      }
    } else {
      console.log('❌ User not found');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

checkProductionPassword();
