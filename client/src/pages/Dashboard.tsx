import { useState, useMemo } from "react";
import { CategoryChart } from "@/components/CategoryChart";
import { SpendingTrendChart } from "@/components/SpendingTrendChart";
import { StatCard } from "@/components/StatCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AddTransactionSheet } from "@/components/AddTransactionSheet";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { useTransactions } from "@/hooks/use-transactions";
import { useAnalyticsSummary } from "@/hooks/use-budgets";
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";

const CATEGORY_COLORS: Record<string, string> = {
  Food: "hsl(25 90% 60%)",
  Transport: "hsl(270 70% 60%)",
  Airtime: "hsl(340 85% 55%)",
  Other: "hsl(200 70% 50%)",
};

export default function Dashboard() {
  const [chartType, setChartType] = useState<"category" | "trend">("category");
  const { data: transactions, isLoading: transactionsLoading } = useTransactions();
  const { data: analytics, isLoading: analyticsLoading } = useAnalyticsSummary();

  const categoryData = useMemo(() => {
    if (!transactions) return [];
    
    const categoryTotals: Record<string, number> = {};
    
    transactions.forEach(t => {
      const category = t.category;
      const amount = parseFloat(t.amount);
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
      color: CATEGORY_COLORS[category] || "hsl(200 70% 50%)",
    }));
  }, [transactions]);

  const trendData = useMemo(() => {
    if (!transactions) return [];
    
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    const dailyTotals: Record<string, number> = {};
    
    transactions.forEach(t => {
      const date = format(new Date(t.date), "MMM d");
      const amount = parseFloat(t.amount);
      dailyTotals[date] = (dailyTotals[date] || 0) + amount;
    });

    return days.slice(0, 7).map(day => {
      const dateStr = format(day, "MMM d");
      return {
        date: dateStr,
        amount: dailyTotals[dateStr] || 0,
      };
    });
  }, [transactions]);

  const highestCategory = useMemo(() => {
    if (categoryData.length === 0) return { name: "N/A", amount: 0 };
    const highest = categoryData.reduce((max, cat) => cat.amount > max.amount ? cat : max);
    return { name: highest.category, amount: highest.amount };
  }, [categoryData]);

  const lowestCategory = useMemo(() => {
    if (categoryData.length === 0) return { name: "N/A", amount: 0 };
    const lowest = categoryData.reduce((min, cat) => cat.amount < min.amount ? cat : min);
    return { name: lowest.category, amount: lowest.amount };
  }, [categoryData]);

  const totalBudget = useMemo(() => {
    if (!analytics?.budgetSummary) return 0;
    return (analytics.budgetSummary as any[]).reduce((sum: number, b: any) => sum + parseFloat(b.limit), 0);
  }, [analytics]);

  const thisMonthSpent = useMemo(() => {
    if (!transactions) return 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }, [transactions]);

  const lastMonthSpent = useMemo(() => {
    if (!transactions) return 0;
    const now = new Date();
    const lastMonth = now.getMonth() - 1;
    const lastMonthYear = lastMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
    const adjustedLastMonth = lastMonth < 0 ? 11 : lastMonth;
    
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === adjustedLastMonth && date.getFullYear() === lastMonthYear;
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }, [transactions]);

  if (transactionsLoading || analyticsLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
            <h1 className="text-xl font-bold" data-testid="text-page-title">Dashboard</h1>
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
          <h1 className="text-xl font-bold" data-testid="text-page-title">Dashboard</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            title="Highest"
            value={highestCategory.name}
            subtitle={`GHS ${highestCategory.amount.toFixed(0)}`}
            icon={TrendingUp}
          />
          <StatCard
            title="Budget"
            value={`GHS ${totalBudget.toFixed(0)}`}
            subtitle="Monthly"
            icon={DollarSign}
          />
          <StatCard
            title="Lowest"
            value={lowestCategory.name}
            subtitle={`GHS ${lowestCategory.amount.toFixed(0)}`}
            icon={TrendingDown}
          />
        </div>

        <div className="flex gap-2 p-1 bg-muted rounded-lg">
          <Button
            variant={chartType === "category" ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setChartType("category")}
            data-testid="button-chart-category"
          >
            By Category
          </Button>
          <Button
            variant={chartType === "trend" ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setChartType("trend")}
            data-testid="button-chart-trend"
          >
            Trend
          </Button>
        </div>

        {chartType === "category" ? (
          categoryData.length > 0 ? (
            <CategoryChart data={categoryData} />
          ) : (
            <p className="text-center text-muted-foreground py-8">No category data available</p>
          )
        ) : (
          trendData.length > 0 ? (
            <SpendingTrendChart data={trendData} />
          ) : (
            <p className="text-center text-muted-foreground py-8">No trend data available</p>
          )
        )}

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Monthly Comparison</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              title="This Month"
              value={`GHS ${thisMonthSpent.toFixed(0)}`}
              trend={thisMonthSpent > lastMonthSpent ? "up" : "down"}
              trendValue={lastMonthSpent > 0 ? `${Math.abs(((thisMonthSpent - lastMonthSpent) / lastMonthSpent) * 100).toFixed(0)}%` : undefined}
            />
            <StatCard
              title="Last Month"
              value={`GHS ${lastMonthSpent.toFixed(0)}`}
            />
          </div>
        </div>
      </main>

      <AddTransactionSheet />
    </div>
  );
}
