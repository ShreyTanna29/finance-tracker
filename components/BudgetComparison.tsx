"use client";

import { Transaction, Budget } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMemo } from "react";

type BudgetComparisonProps = {
  transactions: Transaction[];
  budgets: Budget[];
};

export default function BudgetComparison({
  transactions,
  budgets,
}: BudgetComparisonProps) {
  const comparisonData = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const monthlyTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const categorySpending = monthlyTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    return budgets
      .filter((b) => b.amount > 0)
      .map((budget) => ({
        category: budget.category,
        budget: budget.amount,
        actual: categorySpending[budget.category] || 0,
      }))
      .sort((a, b) => b.budget - a.budget);
  }, [transactions, budgets]);

  if (budgets.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No budgets set
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={comparisonData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, ""]} />
        <Legend />
        <Bar dataKey="budget" name="Budget" fill="hsl(var(--chart-1))" />
        <Bar dataKey="actual" name="Actual" fill="hsl(var(--chart-2))" />
      </BarChart>
    </ResponsiveContainer>
  );
}
