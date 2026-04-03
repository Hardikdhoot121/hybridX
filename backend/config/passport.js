import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

// Called explicitly in server.js AFTER dotenv.config() runs
export function initPassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails[0].value.toLowerCase();

          // 1. Try to find by googleId (returning Google user)
          let user = await User.findOne({ googleId: profile.id });
          if (user) return done(null, user);

          // 2. Try to find by email (existing local account with same email)
          user = await User.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            user.authProvider = "google";
            await user.save();
            return done(null, user);
          }

          // 3. Brand new user — create with Google info
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            authProvider: "google",
            isProfileComplete: false,
          });

          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

export default passport;

