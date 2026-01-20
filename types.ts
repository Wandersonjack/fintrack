export type AccountType = 'personal' | 'business';

export interface User {
  id: string;
  email: string;
  name: string;
  accountTypes: AccountType[]; // Can have both
  avatarUrl?: string;
}

export interface GrowthPlan {
  id: string;
  price: number;
  label?: string;
}

export type TransactionCategory = 
  | 'Housing' 
  | 'Food' 
  | 'Transportation' 
  | 'Utilities' 
  | 'Entertainment' 
  | 'Health' 
  | 'Business Operations' 
  | 'Marketing' 
  | 'Salary' 
  | 'Equipment'
  | 'Software'
  | 'Income'
  | 'Transfer';

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  category: TransactionCategory;
  description: string;
  date: string; // ISO date string
  accountType: AccountType;
  isRecurring: boolean;
  merchantName?: string;
  merchantLogo?: string;
  status: 'completed' | 'pending';
}

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  monthlyChange: number; // Percentage
}