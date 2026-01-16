import express from "express";
import {protect} from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

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

export default router;
