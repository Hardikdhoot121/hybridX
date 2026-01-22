import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import routes from "./routes/index.js";
import adminStudentRoutes from "./routes/adminStudentRoutes.js";

dotenv.config();

const app = express();

// middlewares
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://hybridx.vercel.app', 'https://hybridx-uhj9.onrender.com'] 
    : ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// mount all API routes at /api
app.use("/api", routes);

//student details route
app.use("/api/admin",adminStudentRoutes);

// health route
app.get("/ping", (req, res) => {
  res.send("Backend is alive");
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
