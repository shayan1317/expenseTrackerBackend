import express from "express";
import {
  addIncome,
  DeleteIncome,
  getIncomes,
  UpdateIncome,
} from "../controllers/incomeController";
import { authenticationUser } from "../middlewares/authenticationUser";

const router = express.Router();
// incomes
router.get("/all", authenticationUser, getIncomes);
router.post("/add", authenticationUser, addIncome);
router.delete("/delete/:id", authenticationUser, DeleteIncome);
router.put("/update/:id", authenticationUser, UpdateIncome);
export default router;
