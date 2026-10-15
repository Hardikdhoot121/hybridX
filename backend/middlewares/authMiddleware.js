import jwt from "jsonwebtoken";
import User from "../models/User.js";
import redis from "../config/redis.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let user = null;

    // try Redis cache
    if (redis && redis.status === "ready") {
      try {
        const cached = await redis.get(`user:${decoded.id}`);
        if (cached) {
          user = JSON.parse(cached); }
      } catch (err) {
      }
    }

    // Cache missed -> Fetch from MongoDB
    if (!user) {
      user = await User.findById(decoded.id).select("-password").lean();
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      user.id = user._id.toString();
      // cache -> 3600 sec duration 
      if (redis && redis.status === "ready") {
        redis.setex(`user:${decoded.id}`, 3600, JSON.stringify(user)).catch(() => {});
      }
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

