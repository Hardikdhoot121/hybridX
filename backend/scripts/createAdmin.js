import User from "../models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

/**
 * Create Admin User Script
 * Run this script to create an admin user for the system
 * Usage: node scripts/createAdmin.js
 */

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/hybridX");
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@hybridx.com" });
    if (existingAdmin) {
      console.log("Admin user already exists:", existingAdmin.email);
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const admin = await User.create({
      name: "System Administrator",
      email: "admin@hybridx.com",
      password: hashedPassword,
      role: "admin",
      phone: "0000000000",
      classLevel: "12th",
      batch: "Batch 1"
    });

    console.log("✅ Admin user created successfully:");
    console.log("   Email: admin@hybridx.com");
    console.log("   Password: admin123");
    console.log("   Role: admin");
    console.log("   ID:", admin._id);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");

  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  }
};

// Run the script
createAdmin();
