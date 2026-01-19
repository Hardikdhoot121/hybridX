import User from "../models/User.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const checkAdminPasswords = async () => {
  try {
    await mongoose.connect("mongodb+srv://hybridxUser:AD9vOytvvTEucKma@hybridonline.9j4osxl.mongodb.net/?appName=hybridOnline");
    console.log("Connected to MongoDB");

    const admins = await User.find({ role: "admin" });
    console.log(`Found ${admins.length} admin user(s):`);
    
    const testPasswords = ['admin123', 'admin', 'password', '123456', 'hybridx'];
    
    for (let admin of admins) {
      console.log(`\nAdmin: ${admin.email}`);
      console.log(`Name: ${admin.name}`);
      console.log(`ID: ${admin._id}`);
      
      for (let pwd of testPasswords) {
        const match = await bcrypt.compare(pwd, admin.password);
        if (match) {
          console.log(`  ✅ Password works: ${pwd}`);
        }
      }
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error checking admin passwords:", error);
  }
};

checkAdminPasswords();
