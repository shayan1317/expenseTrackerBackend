// @ts-nocheck
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import transactionRoutes from "./routes/transactionRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import { UploadFile } from "./controllers/uploadFileController";
import { upload } from "./middlewares/upload";
import authRoutes from "./routes/auth";
import updateRoutes from "./routes/updateRoutes";
import serverless from "serverless-http";
dotenv.config();

const app = express();
app.use(cors());
// CORS

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/uploads", express.static("uploads"));

// Routes
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    error: "Internal Server Error",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// Health check route
app.get("/", (_req, res) => {
  return res.send({
    message: "Express TypeScript API on Vercel",
    status: "OK",
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
  });
});

app.post("/api/upload", upload.single("file"), UploadFile);
app.use("/api/auth", authRoutes);
app.use("/api/income", transactionRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/user", updateRoutes);

export default serverless(app);
