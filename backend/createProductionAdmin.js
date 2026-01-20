import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from './models/User.js';

dotenv.config();

const createProductionAdmin = async () => {
  try {
    // Connect to production database
    const productionUri = "mongodb+srv://hybridxUser:AD9vOytvvTEucKma@hybridonline.9j4osxl.mongodb.net/hybridx?appName=hybridOnline";
    await mongoose.connect(productionUri);
    console.log('🔗 Connected to production hybridx database');
    
    // Check and create admin2@hybridx.com
    let adminUser = await User.findOne({ email: 'admin2@hybridx.com' });
    
    if (!adminUser) {
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
      console.log('✅ Created admin2@hybridx.com in production database');
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.updateOne(
        { email: 'admin2@hybridx.com' },
        { password: hashedPassword }
      );
      console.log('✅ Reset password for admin2@hybridx.com in production database');
    }
    
    // Also create admin@hybridx.com
    let adminUser2 = await User.findOne({ email: 'admin@hybridx.com' });
    
    if (!adminUser2) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser2 = await User.create({
        name: 'System Administrator',
        email: 'admin@hybridx.com',
        password: hashedPassword,
        role: 'admin',
        phone: '0987654321',
        classLevel: '12th',
        batch: 'Batch 1'
      });
      console.log('✅ Created admin@hybridx.com in production database');
    }
    
    // Verify users
    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`📊 Total admin users in production: ${adminCount}`);
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

createProductionAdmin();
