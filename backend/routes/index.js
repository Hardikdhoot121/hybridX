import express from "express";
import practiceRoutes from "./practiceRoutes.js";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import adminRoutes from "./adminRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";

const router = express.Router();
router.use("/analytics", analyticsRoutes);

/**
 * AUTH ROUTES (Public)
 * /api/auth/login
 * /api/auth/signup
 */
router.use("/auth", authRoutes);

/**
 * USER ROUTES (Protected)
 * /api/users/profile
 */
router.use("/users", userRoutes);

/**
 * ADMIN ROUTES (Protected + Role-based)
 * /api/admin/...
 */
router.use("/admin", adminRoutes);

/**
 * PRACTICE ROUTES (Protected)
 * /api/practice/attempt
 */
router.use("/practice", practiceRoutes);
/**
 * HEALTH CHECK
 * /api/health
 */
router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "HybridX API healthy ✅",
    timestamp: new Date(),
  });
});

export default router;
