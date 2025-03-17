"use client";

import { Transaction, Budget } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";

type SpendingInsightsProps = {
  transactions: Transaction[];
  budgets: Budget[];
};

export default function SpendingInsights({
  transactions,
  budgets,
}: SpendingInsightsProps) {
  const insights = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Get current month's transactions
    const monthlyTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    // Calculate spending by category
    const categorySpending = monthlyTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    // Compare with budgets
    const budgetWarnings = budgets
      .filter((b) => b.amount > 0 && categorySpending[b.category] > b.amount)
      .map((b) => ({
        category: b.category,
        amount: categorySpending[b.category],
        budget: b.amount,
        percentage:
          ((categorySpending[b.category] - b.amount) / b.amount) * 100,
      }))
      .sort((a, b) => b.percentage - a.percentage);

    // Find top spending categories
    const topSpending = Object.entries(categorySpending)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category, amount]) => ({
        category,
        amount,
      }));

    // Calculate month-over-month trends
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const lastMonthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date);
      return (
        transactionDate.getMonth() === lastMonth &&
        transactionDate.getFullYear() === lastMonthYear
      );
    });

    const totalThisMonth = monthlyTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const totalLastMonth = lastMonthTransactions.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const monthOverMonthChange = totalLastMonth
      ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100
      : 0;

    return {
      budgetWarnings,
      topSpending,
      monthOverMonthChange,
    };
  }, [transactions, budgets]);

  return (
    <div className="space-y-4">
      {insights.budgetWarnings.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-4 h-4" />
            Budget Alerts
          </h3>
          {insights.budgetWarnings.map((warning) => (
            <div key={warning.category} className="text-sm">
              <span className="font-medium">{warning.category}</span> is{" "}
              <span className="text-destructive">
                {warning.percentage.toFixed(0)}%
              </span>{" "}
              over budget (${warning.amount.toFixed(2)} / $
              {warning.budget.toFixed(2)})
            </div>
          ))}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="font-medium">Top Spending Categories</h3>
        {insights.topSpending.map((category) => (
          <div
            key={category.category}
            className="text-sm flex justify-between items-center"
          >
            <span className="text-muted-foreground">{category.category}</span>
            <span className="font-medium">${category.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Month-over-Month Trend</h3>
        <div className="flex items-center gap-2 text-sm">
          {insights.monthOverMonthChange > 0 ? (
            <>
              <TrendingUp className="w-4 h-4 text-destructive" />
              <span>
                Spending increased by{" "}
                {Math.abs(insights.monthOverMonthChange).toFixed(1)}%
              </span>
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4 text-green-500" />
              <span>
                Spending decreased by{" "}
                {Math.abs(insights.monthOverMonthChange).toFixed(1)}%
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
