import express from "express";

import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import adminRoutes from "./adminRoutes.js";

const router = express.Router();

/**
 * AUTH ROUTES (Public)
 * /api/auth/login
 * /api/auth/signup
 */
router.use("/auth", authRoutes);

/**
 * USER ROUTES (Protected – Student/User Panel)
 * /api/users/profile
 * /api/users/...
 */
router.use("/users", userRoutes);

/**
 * ADMIN ROUTES (Protected + Role-based)
 * /api/admin/dashboard
 * /api/admin/...
 */
router.use("/admin", adminRoutes);

/**
 * HEALTH CHECK
 */
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "HybridX API healthy ✅",
    timestamp: new Date(),
  });
});

export default router;
