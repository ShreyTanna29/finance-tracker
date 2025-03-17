"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Settings, LineChart } from "lucide-react";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import ExpensesChart from "@/components/ExpensesChart";
import CategoryChart from "@/components/CategoryChart";
import DashboardSummary from "@/components/DashboardSummary";
import BudgetSettings from "@/components/BudgetSettings";
import BudgetComparison from "@/components/BudgetComparison";
import SpendingInsights from "@/components/SpendingInsights";
import { Budget, Transaction } from "@/lib/types";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBudgetSettingsOpen, setIsBudgetSettingsOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
    setIsFormOpen(false);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactions(
      transactions.map((t) => (t.id === transaction.id ? transaction : t))
    );
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleUpdateBudgets = (newBudgets: Budget[]) => {
    setBudgets(newBudgets);
    setIsBudgetSettingsOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card rounded-lg p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-lg">
              <LineChart className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Finance Tracker
            </h1>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              onClick={() => setIsBudgetSettingsOpen(true)}
              variant="outline"
              className="flex-1 sm:flex-none items-center gap-2 bg-background/50 backdrop-blur-sm hover:bg-background/80"
            >
              <Settings className="w-4 h-4" />
              Budget Settings
            </Button>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="flex-1 sm:flex-none items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Add Transaction
            </Button>
          </div>
        </div>

        <DashboardSummary transactions={transactions} budgets={budgets} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 shadow-lg backdrop-blur-sm bg-card/50">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-chart-1 rounded-full"></span>
              Monthly Expenses
            </h2>
            <ExpensesChart transactions={transactions} />
          </Card>

          <Card className="p-6 shadow-lg backdrop-blur-sm bg-card/50">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-chart-2 rounded-full"></span>
              Budget vs Actual
            </h2>
            <BudgetComparison transactions={transactions} budgets={budgets} />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 shadow-lg backdrop-blur-sm bg-card/50">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-chart-3 rounded-full"></span>
              Expenses by Category
            </h2>
            <CategoryChart transactions={transactions} />
          </Card>

          <Card className="p-6 shadow-lg backdrop-blur-sm bg-card/50">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-chart-4 rounded-full"></span>
              Spending Insights
            </h2>
            <SpendingInsights transactions={transactions} budgets={budgets} />
          </Card>
        </div>

        <Card className="p-6 shadow-lg backdrop-blur-sm bg-card/50">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-chart-5 rounded-full"></span>
            Recent Transactions
          </h2>
          <TransactionList
            transactions={transactions}
            onEdit={setEditingTransaction}
            onDelete={handleDeleteTransaction}
          />
        </Card>

        <TransactionForm
          isOpen={isFormOpen || !!editingTransaction}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTransaction(null);
          }}
          onSubmit={
            editingTransaction ? handleEditTransaction : handleAddTransaction
          }
          transaction={editingTransaction}
        />

        <BudgetSettings
          isOpen={isBudgetSettingsOpen}
          onClose={() => setIsBudgetSettingsOpen(false)}
          budgets={budgets}
          onSave={handleUpdateBudgets}
        />
      </div>
    </div>
  );
}
