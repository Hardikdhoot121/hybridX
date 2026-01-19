import User from "../models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

/**
 * Test Admin Login Script
 * Tests admin login credentials and password verification
 * Usage: node scripts/testAdminLogin.js
 */

const testAdminLogin = async () => {
  try {
    // Connect to database
    await mongoose.connect("mongodb+srv://hybridxUser:AD9vOytvvTEucKma@hybridonline.9j4osxl.mongodb.net/?appName=hybridOnline");
    console.log("Connected to MongoDB");

    // Find admin user
    const admin = await User.findOne({ email: "admin2@hybridx.com" });
    
    if (!admin) {
      console.log("❌ Admin user not found");
      return;
    }

    console.log("✅ Found admin user:");
    console.log("   Email:", admin.email);
    console.log("   Name:", admin.name);
    console.log("   Role:", admin.role);
    console.log("   ID:", admin._id);

    // Test password verification
    const testPassword = "admin456";
    const isPasswordValid = await bcrypt.compare(testPassword, admin.password);
    
    console.log("\n🔐 Password Test:");
    console.log("   Test password:", testPassword);
    console.log("   Password valid:", isPasswordValid ? "✅ YES" : "❌ NO");

    if (!isPasswordValid) {
      // Reset password if invalid
      console.log("\n🔄 Resetting password...");
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      await User.updateOne(
        { email: "admin2@hybridx.com" },
        { password: hashedPassword }
      );
      console.log("✅ Password reset successfully");
      
      // Test again
      const updatedAdmin = await User.findOne({ email: "admin2@hybridx.com" });
      const isResetPasswordValid = await bcrypt.compare(testPassword, updatedAdmin.password);
      console.log("   New password valid:", isResetPasswordValid ? "✅ YES" : "❌ NO");
    }

    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");

  } catch (error) {
    console.error("❌ Error testing admin login:", error);
    process.exit(1);
  }
};

// Run the script
testAdminLogin();
