import User from "../models/User.js";
import mongoose from "mongoose";

const listAdmins = async () => {
  try {
    await mongoose.connect("mongodb+srv://hybridxUser:AD9vOytvvTEucKma@hybridonline.9j4osxl.mongodb.net/?appName=hybridOnline");
    console.log("Connected to MongoDB");

    const admins = await User.find({ role: "admin" });
    console.log(`Found ${admins.length} admin user(s):`);
    admins.forEach((a, i) => {
      console.log(`${i + 1}. Email: ${a.email}, Name: ${a.name}, ID: ${a._id}`);
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error listing admins:", error);
  }
};

listAdmins();
