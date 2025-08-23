//  @ts-nocheck
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import transactionRoutes from "./routes/transactionRoutes";
import expenseRoutes from "./routes/expenseRoutes";
import { UploadFile } from "./controllers/uploadFileController";
import { upload } from "./middlewares/upload";
import authRoutes from "./routes/authRoutes";
import updateRoutes from "./routes/updateRoutes";

// dotenv.config();

const app = express();
app.use(cors());
// // CORS

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/uploads", express.static("uploads"));

// Routes
// app.use((err, req, res, next) => {
//   console.error("Global error handler:", err);
//   res.status(500).json({
//     error: "Internal Server Error",
//     message:
//       process.env.NODE_ENV === "development"
//         ? err.message
//         : "Something went wrong",
//   });
// });

// Health check route
app.get("/", (req, res) => {
  res.send("Hello from Express + TypeScript + ESM!");
});

app.post("/api/upload", upload.single("file"), UploadFile);
app.use("/api/auth", authRoutes);
app.use("/api/income", transactionRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/user", updateRoutes);
// app.listen(3000, () => console.log("listening to 3000"));
export default app;
