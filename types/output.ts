export interface User {
  id: string;
  full_name: string;
  email: string;
  image: string;
  createdAt?: Date;
  token?: string;
}

export interface AuthenticationReturn {
  user: User;
  message: string;
}

export interface AuthenticationErrorMessage {
  message: string;
  errors?: any;
}
export type ExpenseReturn = {
  message: string;
  data: {
    id: string;
    title: string;
    notes: string | null;
    date: Date;
    amount: number;
    expenseIconLabel: string;
    createdAt: Date;
    updatedAt: Date;
  };
};
export type IncomeReturn = {
  message?: string;
  data: {
    id: string;
    title: string;
    notes?: string;
    date: Date;
    amount: number;
    incomeSourceIconLabel: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

// Response interface for file info
export interface FileUploadResponse {
  message: string;
  file: {
    filename: string;
    originalname: string;
    path: string;
    size: number;
  };
}
export interface ErrorResponse {
  message: string;
}
