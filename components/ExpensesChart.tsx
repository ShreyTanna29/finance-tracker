"use client";

import { Transaction } from "@/lib/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

type ExpensesChartProps = {
  transactions: Transaction[];
};

export default function ExpensesChart({ transactions }: ExpensesChartProps) {
  const monthlyData = useMemo(() => {
    const data: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthYear = `${date.toLocaleString("default", {
        month: "short",
      })} ${date.getFullYear()}`;

      if (!data[monthYear]) {
        data[monthYear] = 0;
      }
      data[monthYear] += transaction.amount;
    });

    return Object.entries(data)
      .map(([month, amount]) => ({
        month,
        amount,
      }))
      .sort((a, b) => {
        const [aMonth, aYear] = a.month.split(" ");
        const [bMonth, bYear] = b.month.split(" ");
        return (
          new Date(`${aMonth} 1, ${aYear}`).getTime() -
          new Date(`${bMonth} 1, ${bYear}`).getTime()
        );
      });
  }, [transactions]);

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
        />
        <Bar dataKey="amount" fill="hsl(var(--primary))" />
      </BarChart>
    </ResponsiveContainer>
  );
}
