import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import adminStudentRoutes from "./routes/adminStudentRoutes.js";

dotenv.config();

const app = express();

// middlewares
app.use(cors({
  origin: ['http://localhost:5173', 'https://hybridx-uhj9.onrender.com'],
  credentials: true
}));
app.use(express.json());

// mount all API routes at /api
app.use("/api", routes);

//student details route
app.use("/api/admin",adminStudentRoutes);

// analytics routes
app.use("/api/analytics", analyticsRoutes);

// health route
app.get("/ping", (req, res) => {
  res.send("Backend is alive");
});

// detailed health check
app.get("/health", async (req, res) => {
  try {
    const User = (await import('./models/User.js')).default;
    const adminCount = await User.countDocuments({ role: 'admin' });
    const userCount = await User.countDocuments();
    
    res.json({
      status: "healthy",
      database: {
        name: mongoose.connection.name,
        host: mongoose.connection.host,
        adminCount,
        userCount
      },
      environment: {
        hasMongoUri: !!process.env.MONGO_URI,
        hasJwtSecret: !!process.env.JWT_SECRET,
        dbName: process.env.DB_NAME
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error.message
    });
  }
});

app.get("/", (req, res) => {
  res.send("HybridX backend is running ");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server started on port ${PORT}`);
    console.log(`👉 http://localhost:${PORT}`);
  });
};

startServer();
