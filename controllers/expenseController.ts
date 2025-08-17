import { Request, Response } from "express";
import { ZodIssue } from "zod";
import prisma from "../lib/PrismaClient";
import {
  ExpenseCreateInput,
  ExpenseIValues,
  ParamsForGetIncomesExpenses,
} from "../types/Input";

import { ExpenseCreateSchema, ExpenseUpdateSchema } from "../lib/schema";
import { ExpenseReturn } from "../types/output";

// GET /api/incomes/

export const getExpenses = async (
  req: Request<ParamsForGetIncomesExpenses, {}>,
  res
) => {
  const {
    period = "all",
    startDate,
    endDate,
  } = req.query as {
    period?: string;
    startDate?: string;
    endDate?: string;
  };
  const user = req.user;
  console.log("user", user);
  console.log("period", period);
  try {
    if (period == "weekly") {
      console.log("weekluuuuu");
      const expenses = await prisma.$queryRaw`
      SELECT
          date_trunc('week',"createdAt") AS week_start,
          SUM("amount") AS total_amount
      FROM "Expense"
      WHERE "userId"=${user.id}
        AND "createdAt">=NOW()-INTERVAL '30 days'
      GROUP BY week_start
      ORDER BY week_start asc
      `;

      console.log("expenses", expenses);
      return res.status(200).json(expenses);
    }
    let where: any = { userId: user.id };

    if (startDate && endDate) {
      where.createdAt = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json(expenses);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch expenses" }); // ✅ Better error message
  }
};

// POST /api/tasks
export const addExpense = async (
  req: Request<{}, {}, ExpenseCreateInput>,
  res: Response<ExpenseReturn | { error: string }>
): Promise<void> => {
  let user: { id: string };

  user = req.user;
  let parseResult = ExpenseCreateSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      error: "Invalid expense details",
    });
    return;
  }
  // Handle uploaded file

  try {
    const newExpense = await prisma.expense.create({
      data: {
        title: parseResult.data?.title,
        amount: parseResult.data?.amount,
        notes: parseResult?.data?.notes,
        user: { connect: { id: user.id } },
        date: parseResult.data?.date,
        expenseIconLabel: parseResult.data.expenseIconLabel,
      },
    });
    res
      .status(200)
      .json({ message: "Expense created successfully", data: newExpense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create expense" });
    return;
  }
};

export const DeleteExpense = async (
  req: Request,
  res: Response<ExpenseReturn | { error: string }>
): Promise<void> => {
  try {
    let { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "ID is required" });
      return;
    }

    const expense = await prisma.expense.findUnique({
      where: { id: id }, // or just id if it's already correct type
    });

    if (!expense) {
      res.status(404).json({ error: "Expense not found" });
      return;
    }
    await prisma.expense.delete({ where: { id: id } });
    res
      .status(200)
      .json({ message: "Expense deleted successfully", data: { ...expense } });
  } catch (Err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const UpdateExpense = async (
  req: Request<{ id: string }, {}, ExpenseIValues>,
  res: Response<ExpenseReturn | { error: string; details?: ZodIssue[] }>
) => {
  try {
    let { id } = req.params;
    const expenseDetails = req.body;
    if (!id) {
      res.status(400).json({ error: "ID is required" });
      return;
    }
    const parseResult = ExpenseUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid expense details",
        details: parseResult.error.errors,
      });
      return;
    }

    const expense = await prisma.expense.findUnique({
      where: { id: id }, // or just id if it's already correct type
    });

    if (!expense) {
      res.status(404).json({ error: "Expense not found" });
      return;
    }

    await prisma.expense.update({ data: expenseDetails, where: { id: id } });
    res
      .status(200)
      .json({ message: "Expense Updated successfully", data: expense });
  } catch (Err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
