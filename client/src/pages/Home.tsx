import { BudgetOverviewCard } from "@/components/BudgetOverviewCard";
import { StatCard } from "@/components/StatCard";
import { TransactionCard } from "@/components/TransactionCard";
import { AddTransactionSheet } from "@/components/AddTransactionSheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Wallet, TrendingDown, Calendar } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTransactions } from "@/hooks/use-transactions";
import { useAnalyticsSummary } from "@/hooks/use-budgets";
import { useMemo } from "react";

export default function Home() {
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();
  const { data: analytics, isLoading: analyticsLoading } = useAnalyticsSummary();

  const recentTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map(t => ({
        ...t,
        amount: parseFloat(t.amount),
        date: new Date(t.date),
        category: t.category as "Food" | "Transport" | "Airtime" | "Other",
        service: t.service as "MTN" | "AirtelTigo" | "Telecel",
        notes: t.notes || undefined,
      }));
  }, [transactions]);

  const totalSpent = useMemo(() => {
    if (!transactions) return 0;
    return transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }, [transactions]);

  const totalBudget = useMemo(() => {
    if (!analytics?.budgetSummary) return 0;
    return (analytics.budgetSummary as any[]).reduce((sum: number, b: any) => sum + parseFloat(b.limit), 0);
  }, [analytics]);

  const avgDaily = useMemo(() => {
    if (!transactions || transactions.length === 0) return 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDay = now.getDate();
    
    const monthlySpent = transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    return currentDay > 0 ? monthlySpent / currentDay : 0;
  }, [transactions]);

  const daysLeft = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const currentDay = now.getDate();
    return daysInMonth - currentDay;
  }, []);

  if (transactionsLoading || analyticsLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
            <h1 className="text-xl font-bold" data-testid="text-page-title">Expense Tracker</h1>
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
          <h1 className="text-xl font-bold" data-testid="text-page-title">Expense Tracker</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <BudgetOverviewCard
          totalSpent={totalSpent}
          totalBudget={totalBudget}
          period="Monthly"
        />

        <div className="grid grid-cols-3 gap-3">
          <StatCard
            title="Total Spent"
            value={`GHS ${totalSpent.toFixed(0)}`}
            icon={Wallet}
          />
          <StatCard
            title="Days Left"
            value={daysLeft.toString()}
            subtitle="This month"
            icon={Calendar}
          />
          <StatCard
            title="Avg Daily"
            value={`GHS ${avgDaily.toFixed(0)}`}
            icon={TrendingDown}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <Link href="/transactions">
              <Button variant="ghost" size="sm" data-testid="button-view-all">
                View All
              </Button>
            </Link>
          </div>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                {...transaction}
                onEdit={() => console.log("Edit", transaction.id)}
              />
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">No transactions yet</p>
          )}
        </div>
      </main>

      <AddTransactionSheet />
    </div>
  );
}
