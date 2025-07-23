import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getTask,
} from "../controllers/taskController";
import { upload } from "../middlewares/upload";

const router = express.Router();

router.get("/", getTasks);
router.post("/", upload.single("file"), createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);
router.get("/:id", getTask);

export default router;
