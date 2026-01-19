import User from "../models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/hybridX");
    console.log("Connected to MongoDB");

    const admin = await User.findOne({ email: "Admin@hybridX.com" });
    if (!admin) {
      console.log("❌ Admin not found");
      return;
    }

    const newPassword = "admin123";
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    admin.password = hashedPassword;
    await admin.save();

    console.log("✅ Admin password reset successfully:");
    console.log("   Email:", admin.email);
    console.log("   New Password:", newPassword);

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error resetting password:", error);
  }
};

resetAdminPassword();
