import express from "express";
import {protect} from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import User from "../models/User.js";

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

export default router;
