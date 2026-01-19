import User from "../models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const createTestAdmin = async () => {
  try {
    await mongoose.connect("mongodb+srv://hybridxUser:AD9vOytvvTEucKma@hybridonline.9j4osxl.mongodb.net/?appName=hybridOnline");
    console.log("Connected to MongoDB");

    // Delete existing admin if exists
    await User.deleteOne({ email: "admin@hybridx.com" });
    console.log("Removed existing admin if any");

    // Create new admin with known password
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

    console.log("✅ New admin user created successfully:");
    console.log("   Email: admin@hybridx.com");
    console.log("   Password: admin123");
    console.log("   Role: admin");
    console.log("   ID:", admin._id);

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  }
};

createTestAdmin();
