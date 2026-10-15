import Redis from "ioredis";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Fail-safe: ensure .env is parsed if redis.js is imported before server.js initializes dotenv
dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

const redisUrl = process.env.REDIS_URL;

let redis = null;

if (!redisUrl) {
  console.warn("⚠️ REDIS_URL not found in .env. Redis caching will be skipped.");
} else {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    retryStrategy(times) {
      if (times > 5) {
        console.warn("⚠️ Redis retry limit exceeded. Continuing with database fallback.");
        return null; // Stop infinite reconnecting
      }
      return Math.min(times * 300, 2000);
    },
  });

  redis.on("connect", () => {
    console.log("⚡ Redis Cloud connected successfully");
  });

  redis.on("error", (err) => {
    console.error("❌ Redis Client Error:", err.message);
  });
}

export default redis;
export { redis };
