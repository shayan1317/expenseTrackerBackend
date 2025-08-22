// @ts-nocheck
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import serverless from "serverless-http";

import transactionRoutes from "../routes/transactionRoutes.js";
import expenseRoutes from "../routes/expenseRoutes.js";
import { UploadFile } from "../controllers/uploadFileController.js";
import { upload } from "../middlewares/upload.js";
import authRoutes from "../routes/auth.js";
import updateRoutes from "../routes/updateRoutes.js";

dotenv.config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: "https://expense-tracker-snowy-ten.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (use /tmp for Vercel)
app.use("/uploads", express.static("/uploads"));

// Routes
app.get("/", (_req, res) => {
  return res.send("Express Typescript on Vercel");
});
app.post("/api/upload", upload.single("file"), UploadFile);
app.use("/api/auth", authRoutes);
app.use("/api/income", transactionRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/user", updateRoutes);

// Export as serverless function
export const handler = serverless(app);
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
