import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

dotenv.config();

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// mount all API routes at /api
app.use("/api", routes);

// analytics routes
app.use("/api/analytics", analyticsRoutes);

// health route
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
