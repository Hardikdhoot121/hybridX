import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import { initPassport } from "./config/passport.js";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();
initPassport(); // must run after dotenv.config() so env vars are available

const app = express();

/* 🔥 CORS FIX (PRODUCTION SAFE) */
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://hybrideducationhub.in",
      "https://www.hybrideducationhub.in"
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS blocked: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/* 🔥 IMPORTANT: handle preflight */
app.options("{*id}", cors());

app.use(express.json());
app.use(passport.initialize()); // stateless — no session needed (we use JWT)
app.use("/api", routes);

app.get("/ping", (req, res) => {
  res.send("Backend is alive");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
  });
};

startServer();
