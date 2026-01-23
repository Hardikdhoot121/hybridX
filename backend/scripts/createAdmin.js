import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config({ path: './.env' });

const createAdmin = async () => {
  try {
    console.log("🔍 Environment variables loaded:");
    console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ Found" : "❌ Missing");
    
    // Connect to MongoDB using the same method as server
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "hybridx",
    });
    console.log("✅ Connected to MongoDB:", conn.connection.host);

    // Check if admin with studentId 1522380 already exists
    const existingAdmin = await User.findOne({ studentId: "1522380" });
    
    if (existingAdmin) {
      console.log("👤 Admin with studentId 1522380 already exists:", existingAdmin);
      
      // Update role to admin if not already
      if (existingAdmin.role !== "admin") {
        await User.findByIdAndUpdate(existingAdmin._id, { role: "admin" });
        console.log("🔧 Updated role to admin");
      }
      return;
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = new User({
      name: "Admin User",
      email: "admin1522380@hybridx.com",
      password: hashedPassword,
      role: "admin",
      studentId: "1522380",
      classLevel: "12th",
      batch: "Batch 1",
      targetYear: 2026,
      phone: "9876543210"
    });

    await admin.save();
    console.log("✅ Admin user created successfully:");
    console.log("📧 Email: admin1522380@hybridx.com");
    console.log("🆔 Student ID: 1522380");
    console.log("🔑 Password: admin123");
    console.log("👤 Role: admin");

  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
};

createAdmin();
