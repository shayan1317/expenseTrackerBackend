// @ts-nocheck
import express from "express";
import {
  addExpense,
  DeleteExpense,
  getExpenses,
  UpdateExpense,
} from "../controllers/expenseController";
import { authenticationUser } from "../middlewares/authenticationUser";

const router = express.Router();

// expenses
router.get("/all", authenticationUser, getExpenses);
router.post("/add", authenticationUser, addExpense);
router.put("/update/:id", authenticationUser, UpdateExpense);
router.delete("/delete/:id", authenticationUser, DeleteExpense);
// router.put("/:id", updateIncome);
// router.delete("/:id", deleteIncome);

export default router;
