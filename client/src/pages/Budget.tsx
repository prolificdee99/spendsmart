import { useMemo, useEffect } from "react";
import { BudgetCard } from "@/components/BudgetCard";
import { BudgetOverviewCard } from "@/components/BudgetOverviewCard";
import { SetBudgetDialog } from "@/components/SetBudgetDialog";
import { AddTransactionSheet } from "@/components/AddTransactionSheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useBudgets, useAnalyticsSummary } from "@/hooks/use-budgets";
import { useTransactions } from "@/hooks/use-transactions";
import { useToast } from "@/hooks/use-toast";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";

export default function Budget() {
  const { data: budgets, isLoading: budgetsLoading } = useBudgets();
  const { data: analytics, isLoading: analyticsLoading } = useAnalyticsSummary();
  const { data: transactions } = useTransactions();
  const { toast } = useToast();

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

  const overspendingCategories = useMemo(() => {
    return budgetsWithSpending.filter(b => b.spent > b.limit);
  }, [budgetsWithSpending]);

  const monthlyReview = useMemo(() => {
    if (!transactions) return [];
    
    const now = new Date();
    const months = [
      { label: "This Month", start: startOfMonth(now), end: endOfMonth(now) },
      { label: format(subMonths(now, 1), "MMM yyyy"), start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) },
      { label: format(subMonths(now, 2), "MMM yyyy"), start: startOfMonth(subMonths(now, 2)), end: endOfMonth(subMonths(now, 2)) },
    ];

    return months.map(month => {
      const monthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return date >= month.start && date <= month.end;
      });

      const spent = monthTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
      
      return {
        label: month.label,
        spent,
        transactionCount: monthTransactions.length,
      };
    });
  }, [transactions]);

  const spendingTrend = useMemo(() => {
    if (monthlyReview.length < 2) return "stable";
    const thisMonth = monthlyReview[0].spent;
    const lastMonth = monthlyReview[1].spent;
    if (thisMonth > lastMonth * 1.1) return "up";
    if (thisMonth < lastMonth * 0.9) return "down";
    return "stable";
  }, [monthlyReview]);

  useEffect(() => {
    if (overspendingCategories.length > 0) {
      overspendingCategories.forEach(budget => {
        const overspent = budget.spent - budget.limit;
        toast({
          title: `⚠️ Budget Alert: ${budget.category}`,
          description: `You've exceeded your ${budget.period} budget by GHS ${overspent.toFixed(2)}`,
          variant: "destructive",
        });
      });
    }
  }, [overspendingCategories.map(c => c.category).sort().join(','), toast]);

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
        {overspendingCategories.length > 0 && (
          <Alert variant="destructive" data-testid="alert-overspending">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Overspending Alert!</AlertTitle>
            <AlertDescription>
              You're over budget in {overspendingCategories.length} {overspendingCategories.length === 1 ? 'category' : 'categories'}: {overspendingCategories.map(b => b.category).join(', ')}
            </AlertDescription>
          </Alert>
        )}

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

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Monthly Review</h2>
          <Card className="p-4">
            <div className="space-y-4">
              {monthlyReview.map((month, index) => (
                <div key={month.label} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium" data-testid={`text-month-${index}`}>{month.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {month.transactionCount} transaction{month.transactionCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold font-mono" data-testid={`text-month-spent-${index}`}>
                      GHS {month.spent.toFixed(2)}
                    </p>
                    {index === 0 && spendingTrend !== "stable" && (
                      <div className="flex items-center gap-1 text-xs mt-1">
                        {spendingTrend === "up" ? (
                          <>
                            <TrendingUp className="w-3 h-3 text-destructive" />
                            <span className="text-destructive">Higher</span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-3 h-3 text-green-600" />
                            <span className="text-green-600">Lower</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
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
