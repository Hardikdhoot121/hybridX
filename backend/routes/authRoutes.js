import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// ─── Existing local auth ───────────────────────────────────────────────────
router.post("/signup", signup);
router.post("/login", login);

// ─── Google OAuth ──────────────────────────────────────────────────────────

// Step 1: Redirect user to Google's consent screen
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

// Step 2: Google redirects back here after user consents
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  (req, res) => {
    const user = req.user;

    // Generate JWT exactly like the local login does
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const isNewUser = !user.isProfileComplete;

    // Redirect to frontend with token — frontend will save it to localStorage
    res.redirect(
      `${process.env.CLIENT_URL}/auth/success?token=${token}&newUser=${isNewUser}`
    );
  }
);

export default router;
