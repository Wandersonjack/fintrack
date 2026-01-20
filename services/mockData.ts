import { Transaction, User } from '../types';

export const MOCK_USER: User = {
  id: 'user_123',
  email: 'david@example.com',
  name: 'David Miller',
  accountTypes: ['personal', 'business'],
  avatarUrl: 'https://picsum.photos/200/200',
};

const today = new Date().toISOString();

export const MOCK_TRANSACTIONS: Transaction[] = [
  // Income
  {
    id: 'inc-1',
    amount: 4500.00,
    type: 'income',
    category: 'Salary',
    description: 'Monthly Salary',
    date: today,
    accountType: 'personal',
    isRecurring: true,
    status: 'completed'
  },
  // Business Expenses from snippet
  { id: 'b1', amount: 650, type: 'expense', category: 'Business Operations', description: 'Raid Group', date: today, accountType: 'business', isRecurring: true, status: 'completed' },
  { id: 'b2', amount: 69, type: 'expense', category: 'Business Operations', description: 'Mod', date: today, accountType: 'business', isRecurring: true, status: 'completed' },
  { id: 'b3', amount: 11, type: 'expense', category: 'Software', description: 'X.com AVO', date: today, accountType: 'business', isRecurring: true, status: 'completed' },
  { id: 'b4', amount: 24, type: 'expense', category: 'Software', description: 'ElevenLabs', date: today, accountType: 'business', isRecurring: true, status: 'completed' },
  { id: 'b5', amount: 22, type: 'expense', category: 'Software', description: 'Supabase', date: today, accountType: 'business', isRecurring: true, status: 'completed' },
  { id: 'b6', amount: 17, type: 'expense', category: 'Software', description: 'Framer', date: today, accountType: 'business', isRecurring: true, status: 'completed' },
  { id: 'b7', amount: 17, type: 'expense', category: 'Software', description: 'Vercel', date: today, accountType: 'business', isRecurring: true, status: 'completed' },
  { id: 'b8', amount: 12, type: 'expense', category: 'Software', description: 'ClickUp', date: today, accountType: 'business', isRecurring: true, status: 'completed' },
  { id: 'b9', amount: 8, type: 'expense', category: 'Software', description: 'Datafast', date: today, accountType: 'business', isRecurring: true, status: 'completed' },
  { id: 'b10', amount: 5, type: 'expense', category: 'Software', description: 'X.com Business', date: today, accountType: 'business', isRecurring: true, status: 'completed' },
  { id: 'b11', amount: 5, type: 'expense', category: 'Software', description: 'Railway', date: today, accountType: 'business', isRecurring: true, status: 'completed' },
  { id: 'b12', amount: 3.25, type: 'expense', category: 'Software', description: 'Telegram', date: today, accountType: 'business', isRecurring: true, status: 'completed' },
  
  // Personal Expenses from snippet
  { id: 'p1', amount: 1200, type: 'expense', category: 'Housing', description: 'Office Rent', date: today, accountType: 'business', isRecurring: true, status: 'completed' },
  { id: 'p2', amount: 240, type: 'expense', category: 'Food', description: 'Wilson Mango Grocery', date: today, accountType: 'personal', isRecurring: false, status: 'completed' },
  { id: 'p3', amount: 120, type: 'expense', category: 'Entertainment', description: 'Dribbble Subscription', date: today, accountType: 'personal', isRecurring: true, status: 'completed' },
  { id: 'p4', amount: 89.99, type: 'expense', category: 'Software', description: 'Adobe Creative Cloud', date: today, accountType: 'business', isRecurring: true, status: 'completed' },
  { id: 'p5', amount: 45, type: 'expense', category: 'Utilities', description: 'Ultra Plan', date: today, accountType: 'personal', isRecurring: true, status: 'completed' },
  { id: 'p6', amount: 22, type: 'expense', category: 'Software', description: 'Google AI', date: today, accountType: 'personal', isRecurring: true, status: 'completed' },
  { id: 'p7', amount: 10, type: 'expense', category: 'Software', description: 'Apple Cloud+', date: today, accountType: 'personal', isRecurring: true, status: 'completed' },
  { id: 'p8', amount: 8, type: 'expense', category: 'Entertainment', description: 'Skool', date: today, accountType: 'personal', isRecurring: true, status: 'completed' },
];

export const getTransactions = async (): Promise<Transaction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_TRANSACTIONS), 500);
  });
};

export const getUser = async (): Promise<User> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_USER), 300);
    });
}