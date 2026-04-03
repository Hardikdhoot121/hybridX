import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * =========================
 * GET USER PROFILE
 * GET /api/users/profile
 * =========================
 */
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
});

/**
 * =========================
 * UPDATE USER PROFILE
 * PUT /api/users/profile
 * =========================
 */
router.put("/profile", protect, async (req, res) => {
  try {
    const allowedUpdates = [
      "name",
      "phone",
      "classLevel",
      "batch",
      "targetYear",
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Profile update failed",
      error: error.message,
    });
  }
});
/**
 * =========================
 * COMPLETE PROFILE (Google OAuth new users)
 * PATCH /api/users/complete-profile
 * =========================
 */
router.patch("/complete-profile", protect, async (req, res) => {
  try {
    const { phone, classLevel, batch, targetYear } = req.body;

    if (!phone || !classLevel || !batch) {
      return res.status(400).json({
        success: false,
        message: "phone, classLevel and batch are required",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        phone,
        classLevel,
        batch,
        ...(targetYear && { targetYear }),
        isProfileComplete: true,
      },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({
      success: true,
      message: "Profile completed successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to complete profile",
      error: error.message,
    });
  }
});

export default router;