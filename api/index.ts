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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use("/uploads", express.static("uploads"));
app.get("/", (_req: Request, res: Response) => {
  return res.send("Express Typescript on Vercel");
});
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
