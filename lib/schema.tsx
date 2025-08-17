import z from "zod";
export const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  image: z.string().min(1, "image is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().optional(),
  image: z.string().optional(),
});

export const signinSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const ExpenseCreateSchema = z.object({
  amount: z.number().positive(),

  date: z.string().datetime(),
  expenseIconLabel: z.string(),
  notes: z.string(),
  title: z.string(),
  // Add other fields as per your Prisma expense model
});

export const IncomeCreateSchema = z.object({
  amount: z.number().positive(),

  date: z.string().datetime(),
  incomeSourceIconLabel: z.string(),
  notes: z.string(),
  title: z.string(),
  // Add other fields as per your Prisma expense model
});

export const IncomeUpdateSchema = z
  .object({
    amount: z.number().positive().optional(),
    description: z.string().optional(),
    date: z.string().datetime().optional(),
    incomeSourceIconLabel: z.string().optional(),
    notes: z.string().optional(),
    title: z.string().optional(),
    // Add other fields as per your Prisma expense model
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });
export const ExpenseUpdateSchema = z
  .object({
    amount: z.number().positive().optional(),
    description: z.string().optional(),
    date: z.string().datetime().optional(),
    expenseIconLabel: z.string().optional(),
    notes: z.string().optional(),
    title: z.string().optional(),
    // Add other fields as per your Prisma expense model
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required for update",
  });
