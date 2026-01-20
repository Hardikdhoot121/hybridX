import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkAllDatabases = async () => {
  try {
    // Connect to MongoDB without specifying database
    const conn = await mongoose.connect(process.env.MONGO_URI.replace('/hybridx', ''));
    
    // List all databases
    const admin = conn.connection.db.admin();
    const databases = await admin.listDatabases();
    
    console.log('📊 Available databases:');
    for (const db of databases.databases) {
      console.log(`   - ${db.name}`);
    }
    
    // Check each database for admin users
    for (const db of databases.databases) {
      if (db.name.includes('hybrid') || db.name.includes('test')) {
        console.log(`\n🔍 Checking database: ${db.name}`);
        try {
          const userCollection = conn.connection.db(db.name).collection('users');
          const adminUsers = await userCollection.find({ role: 'admin' }).toArray();
          console.log(`   Admin users: ${adminUsers.length}`);
          adminUsers.forEach(user => {
            console.log(`   - ${user.email} (${user.name})`);
          });
        } catch (err) {
          console.log(`   Error: ${err.message}`);
        }
      }
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

checkAllDatabases();
