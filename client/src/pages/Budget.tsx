import { useMemo } from "react";
import { BudgetCard } from "@/components/BudgetCard";
import { BudgetOverviewCard } from "@/components/BudgetOverviewCard";
import { SetBudgetDialog } from "@/components/SetBudgetDialog";
import { AddTransactionSheet } from "@/components/AddTransactionSheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { useBudgets, useAnalyticsSummary } from "@/hooks/use-budgets";
import { useTransactions } from "@/hooks/use-transactions";

export default function Budget() {
  const { data: budgets, isLoading: budgetsLoading } = useBudgets();
  const { data: analytics, isLoading: analyticsLoading } = useAnalyticsSummary();
  const { data: transactions } = useTransactions();

  const categorySpending = useMemo(() => {
    if (!transactions) return {};
    
    const spending: Record<string, number> = {};
    transactions.forEach(t => {
      const category = t.category;
      const amount = parseFloat(t.amount);
      spending[category] = (spending[category] || 0) + amount;
    });
    
    return spending;
  }, [transactions]);

  const budgetsWithSpending = useMemo(() => {
    if (!budgets) return [];
    
    return budgets.map(budget => ({
      category: budget.category as "Food" | "Transport" | "Airtime" | "Other",
      spent: categorySpending[budget.category] || 0,
      limit: parseFloat(budget.limit),
      period: budget.period as "daily" | "weekly" | "monthly",
    }));
  }, [budgets, categorySpending]);

  const totalSpent = useMemo(() => {
    if (!transactions) return 0;
    return transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }, [transactions]);

  const totalBudget = useMemo(() => {
    if (!analytics?.budgetSummary) return 0;
    return (analytics.budgetSummary as any[]).reduce((sum: number, b: any) => sum + parseFloat(b.limit), 0);
  }, [analytics]);

  if (budgetsLoading || analyticsLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
            <h1 className="text-xl font-bold" data-testid="text-page-title">Budget</h1>
            <ThemeToggle />
          </div>
        </header>
        <main className="max-w-md mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl font-bold" data-testid="text-page-title">Budget</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <BudgetOverviewCard
          totalSpent={totalSpent}
          totalBudget={totalBudget}
          period="Monthly"
        />

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Category Budgets</h2>
          {budgetsWithSpending.length > 0 ? (
            budgetsWithSpending.map((budget) => (
              <div key={budget.category} className="relative">
                <BudgetCard {...budget} />
                <div className="absolute top-4 right-4">
                  <SetBudgetDialog
                    category={budget.category}
                    currentLimit={budget.limit}
                    currentPeriod={budget.period}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No budgets set yet. Set a budget to start tracking your spending.
            </p>
          )}
        </div>

        <Card className="p-4 bg-muted/30">
          <h3 className="font-semibold mb-2">Budget Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Set realistic budgets based on your spending patterns</li>
            <li>• Review and adjust budgets monthly</li>
            <li>• Track daily spending to stay within limits</li>
            <li>• Use alerts to avoid overspending</li>
          </ul>
        </Card>
      </main>

      <AddTransactionSheet />
    </div>
  );
}
