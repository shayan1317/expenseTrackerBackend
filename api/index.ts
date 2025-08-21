// @ts-nocheck
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import transactionRoutes from "../routes/transactionRoutes";
import expenseRoutes from "../routes/expenseRoutes";
import { UploadFile } from "../controllers/uploadFileController";
import { upload } from "../middlewares/upload";
import authRoutes from "../routes/auth";
import updateRoutes from "../routes/updateRoutes";
dotenv.config();
const app = express();
//alllow local host

// api/index.ts mein CORS section ko replace karein:
app.options("*", cors());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://expense-tracker-backend-snowy-rho.vercel.app/api",
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
app.post("/api/upload", upload.single("file"), UploadFile);

// Root route
app.use("/api/auth", authRoutes);

// Routes

app.use("/api/income", transactionRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/user", updateRoutes);
// app.use("/api/users", userRoutes);
app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
