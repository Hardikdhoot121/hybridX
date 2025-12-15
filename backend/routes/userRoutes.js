import express from "express";
import {protect} from "../middlewares/authMiddleware.js";

const router = express.Router();

// USER PROFILE (protected)
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "User profile accessed ✅",
    user: req.user,
  });
});

export default router;
