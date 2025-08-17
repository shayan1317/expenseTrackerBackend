import { Request } from "express";
import z from "zod";
import {
  ExpenseCreateSchema,
  ExpenseUpdateSchema,
  IncomeCreateSchema,
  IncomeUpdateSchema,
} from "../lib/schema";
import { Date } from "mongoose";
import { Multer } from "multer";

export interface SignUpIValues {
  email: string;
  password: string;
  name: string;
  image: string;
}

export interface LoginIValues {
  email: string;
  password: string;
}
export interface DecodedToken {
  id: string;
}
export interface AuthenticatedRequest<TUserId = any> extends Request {
  user: TUserId;
}

export type IncomeIValues = {
  title: string;
  notes?: string;
  date: Date;
  amount: number;
  incomeSourceIconLabel: string;
};

export type ParamsForGetIncomesExpenses = {
  period?: "monthly" | "daily" | "weekly";
  startDate?: Date;
  endDate?: Date;
};
export type ExpenseIValues = {
  title: string;
  notes?: string;
  date: Date;
  amount: number;
  expenseIconLabel: string;
};

export type ExpenseUpdateInput = z.infer<typeof ExpenseUpdateSchema>;
export type ExpenseCreateInput = z.infer<typeof ExpenseCreateSchema>;

export type IncomeUpdateInput = z.infer<typeof IncomeUpdateSchema>;
export type IncomeCreateInput = z.infer<typeof IncomeCreateSchema>;
export interface FileUploadRequest extends Request {
  file?: Express.Multer.File;
}
