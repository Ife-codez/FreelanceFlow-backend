
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { config } from "dotenv"
import { connectDB, disconnectDB } from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js"
import clientRoutes from "./routes/clientRoutes.js"
import projectRoutes from "./routes/projectRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import { authMiddleware } from "./middleware/authMiddleware.js";
const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}`);
    process.exit(1);
  }
});
config();
connectDB()
const app = express()
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://freelance-flow-ashy.vercel.app",  // no trailing slash
  ],
  credentials: true,
}));
//Body parsing middleware
app.use(helmet());
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use("/auth", authMiddleware, authRoutes)
app.use("/clients", clientRoutes)
app.use("/projects", projectRoutes)
app.use("/payments", paymentRoutes)
const PORT = 5001
const server = app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  })
})

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  })
})

process.on("SIGTERM", async () => {
  console.log("SIGTERM recieved, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  })
})