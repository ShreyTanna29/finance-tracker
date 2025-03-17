export type Transaction = {
  id: string;
  amount: number;
  date: Date;
  description: string;
  category: string;
};

export type Budget = {
  category: string;
  amount: number;
};

export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Education",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
