import express from "express";
import {protect} from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";
import adminStudentRoutes from "./adminStudentRoutes.js";

const router = express.Router();
// 1. /student api calling 
// 2. /student/:id api calling 
router.use("/", protect, authorize("admin"), adminStudentRoutes);
// 3. /dashboard api calling 
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

export default router;
