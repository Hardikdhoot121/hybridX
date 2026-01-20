import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';

dotenv.config();

const resetPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected to MongoDB');
    
    // Reset password for admin2@hybridx.com to "admin123"
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const result = await User.updateOne(
      { email: 'admin2@hybridx.com' },
      { password: hashedPassword }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Password reset successful for admin2@hybridx.com');
      console.log('🔑 New password: admin123');
    } else {
      console.log('❌ User not found or password not updated');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

resetPassword();
