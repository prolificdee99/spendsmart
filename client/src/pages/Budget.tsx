import { BudgetCard } from "@/components/BudgetCard";
import { BudgetOverviewCard } from "@/components/BudgetOverviewCard";
import { SetBudgetDialog } from "@/components/SetBudgetDialog";
import { AddTransactionSheet } from "@/components/AddTransactionSheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card } from "@/components/ui/card";

export default function Budget() {
  const budgets = [
    { category: "Food" as const, spent: 120, limit: 200, period: "weekly" as const },
    { category: "Transport" as const, spent: 85, limit: 100, period: "weekly" as const },
    { category: "Airtime" as const, spent: 45, limit: 50, period: "monthly" as const },
    { category: "Other" as const, spent: 15, limit: 80, period: "daily" as const },
  ];

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
          totalSpent={265}
          totalBudget={400}
          period="Monthly"
        />

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Category Budgets</h2>
          {budgets.map((budget) => (
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
          ))}
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
