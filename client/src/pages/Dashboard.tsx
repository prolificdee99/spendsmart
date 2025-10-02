import { useState } from "react";
import { CategoryChart } from "@/components/CategoryChart";
import { SpendingTrendChart } from "@/components/SpendingTrendChart";
import { StatCard } from "@/components/StatCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AddTransactionSheet } from "@/components/AddTransactionSheet";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export default function Dashboard() {
  const [chartType, setChartType] = useState<"category" | "trend">("category");

  const categoryData = [
    { category: "Food", amount: 120, color: "hsl(25 90% 60%)" },
    { category: "Transport", amount: 85, color: "hsl(270 70% 60%)" },
    { category: "Airtime", amount: 45, color: "hsl(340 85% 55%)" },
    { category: "Other", amount: 30, color: "hsl(200 70% 50%)" },
  ];

  const trendData = [
    { date: "Jan 1", amount: 20 },
    { date: "Jan 2", amount: 35 },
    { date: "Jan 3", amount: 15 },
    { date: "Jan 4", amount: 45 },
    { date: "Jan 5", amount: 30 },
    { date: "Jan 6", amount: 50 },
    { date: "Jan 7", amount: 25 },
  ];

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
            value="Food"
            subtitle="GHS 120"
            icon={TrendingUp}
          />
          <StatCard
            title="Budget"
            value="GHS 400"
            subtitle="Monthly"
            icon={DollarSign}
          />
          <StatCard
            title="Lowest"
            value="Other"
            subtitle="GHS 30"
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
          <CategoryChart data={categoryData} />
        ) : (
          <SpendingTrendChart data={trendData} />
        )}

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Monthly Comparison</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              title="This Month"
              value="GHS 245"
              trend="up"
              trendValue="12%"
            />
            <StatCard
              title="Last Month"
              value="GHS 218"
              trend="down"
              trendValue="5%"
            />
          </div>
        </div>
      </main>

      <AddTransactionSheet />
    </div>
  );
}
