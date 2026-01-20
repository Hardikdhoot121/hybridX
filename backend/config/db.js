import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || "hybridx",
    });

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    console.log(`📊 Database name: ${conn.connection.name}`);
    console.log(`🔍 MONGO_URI: ${process.env.MONGO_URI}`);
    console.log(`🔍 DB_NAME: ${process.env.DB_NAME}`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1); // stop the app
  }
};
