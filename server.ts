import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.ts";

import transactionRoutes from "./routes/transactionRoutes.ts";
import expenseRoutes from "./routes/expenseRoutes.ts";
import { upload } from "./middlewares/upload.ts";
import { UploadFile } from "./controllers/uploadFileController.ts";
import updateRoutes from "./routes/updateRoutes.ts";

dotenv.config();
const app = express();
//alllow local host
app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this specific origin
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Specify allowed methods
    credentials: true, // Optional: if you need to send cookies or auth headers
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});
