import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const checkHybridxDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'hybridx'
    });
    
    console.log('🔗 Connected to MongoDB');
    console.log('📊 Database name: hybridx');
    
    // Get all collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
    // Count documents in each collection
    for (const collection of collections) {
      const count = await conn.connection.db.collection(collection.name).countDocuments();
      console.log(`   ${collection.name}: ${count} documents`);
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

checkHybridxDatabase();
