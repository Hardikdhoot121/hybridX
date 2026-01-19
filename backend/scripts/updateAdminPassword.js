import User from "../models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const updateAdminPassword = async () => {
  try {
    await mongoose.connect("mongodb+srv://hybridxUser:AD9vOytvvTEucKma@hybridonline.9j4osxl.mongodb.net/?appName=hybridOnline");
    console.log("Connected to MongoDB");

    // Find and update admin2@hybridx.com password
    const admin = await User.findOne({ email: "admin2@hybridx.com" });
    
    if (!admin) {
      console.log("❌ admin2@hybridx.com not found");
      return;
    }

    // Update password to admin123
    const hashedPassword = await bcrypt.hash("admin123", 10);
    admin.password = hashedPassword;
    await admin.save();

    console.log("✅ Password updated for admin2@hybridx.com");
    console.log("   Email: admin2@hybridx.com");
    console.log("   New Password: admin123");
    console.log("   Role: admin");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error updating admin password:", error);
  }
};

updateAdminPassword();
