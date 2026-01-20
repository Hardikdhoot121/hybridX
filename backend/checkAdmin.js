import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔗 Connected to MongoDB');
    
    // Check for admin2@hybridx.com
    const adminUser = await User.findOne({ email: 'admin2@hybridx.com' });
    if (adminUser) {
      console.log('✅ Found admin2@hybridx.com:');
      console.log('   Name:', adminUser.name);
      console.log('   Role:', adminUser.role);
      console.log('   ID:', adminUser._id);
    } else {
      console.log('❌ admin2@hybridx.com not found');
    }
    
    // List all admin users
    const adminUsers = await User.find({ role: 'admin' });
    console.log('\n👑 All Admin Users:');
    adminUsers.forEach(admin => {
      console.log(`   Email: ${admin.email}, Name: ${admin.name}`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

checkAdmin();
