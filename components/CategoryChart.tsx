"use client";

import { Transaction } from "@/lib/types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useMemo } from "react";

type CategoryChartProps = {
  transactions: Transaction[];
};

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--muted))",
];

export default function CategoryChart({ transactions }: CategoryChartProps) {
  const categoryData = useMemo(() => {
    const data: { [key: string]: number } = {};

    transactions.forEach((transaction) => {
      if (!data[transaction.category]) {
        data[transaction.category] = 0;
      }
      data[transaction.category] += transaction.amount;
    });

    return Object.entries(data)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
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
      <PieChart>
        <Pie
          data={categoryData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {categoryData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Amount"]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
