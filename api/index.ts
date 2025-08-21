// @ts-nocheck
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import transactionRoutes from "../routes/transactionRoutes.js";
import expenseRoutes from "../routes/expenseRoutes.js";
import { UploadFile } from "../controllers/uploadFileController.js";
import { upload } from "../middlewares/upload.js";
import authRoutes from "../routes/auth.js";
import updateRoutes from "../routes/updateRoutes.js";

dotenv.config();

const app = express();

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://expense-tracker-frontend.vercel.app", // frontend URL only
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "Cache-Control",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Routes
app.post("/api/upload", upload.single("file"), UploadFile);
app.use("/api/auth", authRoutes);
app.use("/api/income", transactionRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/user", updateRoutes);

// ❌ REMOVE app.listen
// app.listen(3000, () => console.log("Listening..."));

// ✅ Export handler for Vercel
export default app;
