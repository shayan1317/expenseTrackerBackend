import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import transactionRoutes from "../routes/transactionRoutes.ts";
import expenseRoutes from "../routes/expenseRoutes.ts";
import { UploadFile } from "../controllers/uploadFileController.ts";
import { upload } from "../middlewares/upload.ts";
import authRoutes from "../routes/auth.ts";
import updateRoutes from "../routes/updateRoutes.ts";
dotenv.config();
const app = express();
//alllow local host

// api/index.ts mein CORS section ko replace karein:

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
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

export default app;
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});
