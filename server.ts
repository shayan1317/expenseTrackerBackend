import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.ts";
import taskRoutes from "./routes/task.ts";
import userRoutes from "./routes/user.ts";

dotenv.config();
const app = express();
//alllow local host
app.use(
  cors({
    origin: "http://localhost:5173/", // React frontend
    credentials: true, // If using cookies or Authorization headers
  })
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route
app.use("/api/auth", authRoutes);

// Routes

app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});
