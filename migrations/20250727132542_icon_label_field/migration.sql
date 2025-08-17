-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "expenseIconLabel" TEXT NOT NULL DEFAULT '💰';

-- AlterTable
ALTER TABLE "Income" ADD COLUMN     "incomeSourceIconLabel" TEXT NOT NULL DEFAULT '💰';
