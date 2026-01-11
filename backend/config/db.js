import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    console.log('🔗 Connecting to MongoDB with URI:', process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    console.log(`📊 Database name: ${conn.connection.name}`);
    
    // Test connection by counting users
    const User = (await import('../models/User.js')).default;
    const userCount = await User.countDocuments();
    console.log(`👥 Total users in database: ${userCount}`);
    
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // stop the app
  }
};
