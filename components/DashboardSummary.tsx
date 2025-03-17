"use client";

import { Transaction, Budget } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { useMemo } from "react";
import { TrendingUp, Wallet, Clock } from "lucide-react";

type DashboardSummaryProps = {
  transactions: Transaction[];
  budgets: Budget[];
};

export default function DashboardSummary({
  transactions,
  budgets,
}: DashboardSummaryProps) {
  const summary = useMemo(() => {
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

    const total = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);

    const categoryTotals = monthlyTransactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

    const topCategories = Object.entries(categoryTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    const recentTransactions = [...transactions]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 3);

    return {
      total,
      totalBudget,
      topCategories,
      recentTransactions,
      percentageOfBudget: totalBudget ? (total / totalBudget) * 100 : 0,
    };
  }, [transactions, budgets]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="p-6 shadow-lg backdrop-blur-sm bg-card/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Monthly Expenses</h3>
          </div>
          <p className="text-3xl font-bold text-primary mb-1">
            ${summary.total.toFixed(2)}
          </p>
          {summary.totalBudget > 0 && (
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                of ${summary.totalBudget.toFixed(2)} budgeted
              </p>
              <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-in-out"
                  style={{
                    width: `${Math.min(summary.percentageOfBudget, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6 shadow-lg backdrop-blur-sm bg-card/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-chart-2/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-chart-2/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-chart-2" />
            </div>
            <h3 className="text-lg font-semibold">Top Categories</h3>
          </div>
          <div className="space-y-3">
            {summary.topCategories.map(([category, amount], index) => (
              <div key={category} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full bg-chart-${index + 1}`}
                  />
                  <span className="text-muted-foreground">{category}</span>
                </div>
                <span className="font-medium">${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-6 shadow-lg backdrop-blur-sm bg-card/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-chart-3/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-chart-3/10 rounded-lg">
              <Clock className="w-5 h-5 text-chart-3" />
            </div>
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
          </div>
          <div className="space-y-3">
            {summary.recentTransactions.map((t) => (
              <div
                key={t.id}
                className="flex justify-between items-center group"
              >
                <div className="flex flex-col">
                  <span className="font-medium group-hover:text-primary transition-colors">
                    {t.description}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(t.date).toLocaleDateString()}
                  </span>
                </div>
                <span className="font-medium">${t.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
