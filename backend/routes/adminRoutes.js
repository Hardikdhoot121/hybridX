import express from "express";
import {protect} from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  (req, res) => {
    res.json({
      message: "Admin dashboard accessed ✅",
      admin: req.user,
    });
  }
);

// Get all students for admin
router.get(
  "/students",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      const students = await User.find({});
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Error fetching students", error: error.message });
    }
  }
);

// Create fresh admin endpoint (no auth required for setup)
router.post("/create-fresh-admin", async (req, res) => {
  try {
    // Delete existing admins
    await User.deleteMany({ role: 'admin' });
    
    // Create new admin with known password
    const hashedPassword = await bcrypt.hash("admin456", 10);
    
    const admin = await User.create({
      name: "Admin User",
      email: "admin2@hybridx.com",
      password: hashedPassword,
      role: "admin",
      phone: "0000000000",
      classLevel: "12th",
      batch: "Batch 1"
    });

    res.json({
      success: true,
      message: "Fresh admin created on Render",
      admin: {
        email: admin.email,
        password: "admin456"
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
