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
import serverless from "serverless-http";
dotenv.config();

const app = express();
app.use(cors());
// CORS

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

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
  return res.json({
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

// ❌ REMOVE app.listen
// app.listen(3000, () => console.log("Listening..."));
// app.listen(PORT, () =>
//   console.log(`server running in http://localhost:${PORT}`)
// );
// ✅ Export handler for Vercel
export default serverless(app);
// import express, { Request, Response } from "express";
// import serverless from "serverless-http";
// import cors from "cors";
// const app = express();
// app.use(cors());
// app.use(express.json());

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello from Express TypeScript on Vercel!");
// });

// // Add more routes as needed
// app.get("/api/hello", (req: Request, res: Response) => {
//   res.json({ message: "Hello from the API!" });
// });

// // Export the Express app as a serverless function
// module.exports = serverless(app);
