// @ts-nocheck
import { Request, Response } from "express";
import prisma from "../lib/PrismaClient";
import { IncomeCreateInput, IncomeIValues } from "../types/Input";

import { IncomeCreateSchema, IncomeUpdateSchema } from "../lib/schema";
import { IncomeReturn } from "../types/output";

export const getIncomes = async (
  req,
  res: Response<
    | {
        id: string;
        title: string;
        notes?: string | null;
        date: Date;
        amount: number;
        incomeSourceIconLabel: string;
        createdAt: Date;
        updatedAt: Date;
        transactionType: string;
      }[]
    | { error: string }
  >
): Promise<void> => {
  const user = req.user;

  try {
    const incomes = await prisma.income.findMany({
      where: { userId: user.id },
    });
    console.log("incomes", incomes);
    if (!incomes) {
      res.status(404).json({ error: "Incomes not found" });
      return;
    }

    res.status(200).json(incomes);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch task corresponding to this id" });
    return;
  }
};

// POST /api/tasks
export const addIncome = async (
  req: Request,
  res: Response<IncomeReturn | { error: string }>
) => {
  const { title, amount, date, notes, incomeSourceIconLabel } =
    req.body as IncomeCreateInput;
  let user: { id: string };

  user = req.user;
  let parseResult = IncomeCreateSchema.safeParse(req.body);

  if (!parseResult.success) {
    res.status(400).json({
      error: "Invalid income details",
    });
    return;
  }
  // Handle uploaded file

  try {
    const newIncome = await prisma.income.create({
      data: {
        title,
        amount,
        notes: notes ? notes : "",
        user: { connect: { id: user.id } },
        date,
        incomeSourceIconLabel,
      },
    });
    res.json({ message: "Income deleted successfully", data: newIncome });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
    return;
  }
};

export const DeleteIncome = async (
  req: Request,
  res: Response<IncomeReturn | { error: string }>
): Promise<void> => {
  try {
    let { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "ID is required" });
      return;
    }

    const income = await prisma.income.findUnique({
      where: { id: id }, // or just id if it's already correct type
    });

    if (!income) {
      res.status(404).json({ error: "Income not found" });
      return;
    }
    await prisma.income.delete({ where: { id: id } });
    res.status(200).json({
      message: "Income deleted successfully",
      data: { ...income },
    });
  } catch (Err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const UpdateIncome = async (
  req: Request<{ id: string }, {}, IncomeIValues>,
  res: Response
): Promise<void> => {
  try {
    let { id } = req.params;
    console.log("id", id, req.body);

    if (!id) {
      res.status(400).json({ error: "ID is required" });
      return;
    }
    const parseResult = IncomeUpdateSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: "Invalid income details",
        details: parseResult.error.errors,
      });
      return;
    }

    const income = await prisma.income.findUnique({
      where: { id: id }, // or just id if it's already correct type
    });

    if (!income) {
      res.status(404).json({ error: "Income not found" });
      return;
    }

    await prisma.income.update({
      data: parseResult.data,
      where: { id: id },
    });
    res.status(200).json({ message: "Income Updated successfully" });
  } catch (Err) {
    console.log("err", Err);
    res.status(500).json({ error: "Internal server error" });
  }
};
