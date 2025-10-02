import { BudgetOverviewCard } from "@/components/BudgetOverviewCard";
import { StatCard } from "@/components/StatCard";
import { TransactionCard } from "@/components/TransactionCard";
import { AddTransactionSheet } from "@/components/AddTransactionSheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Wallet, TrendingDown, Calendar } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Home() {
  const recentTransactions = [
    {
      id: "1",
      amount: 25.50,
      category: "Food" as const,
      service: "MTN" as const,
      date: new Date(),
      notes: "Lunch at campus cafeteria",
    },
    {
      id: "2",
      amount: 10.00,
      category: "Transport" as const,
      service: "AirtelTigo" as const,
      date: new Date(Date.now() - 3600000),
    },
    {
      id: "3",
      amount: 5.00,
      category: "Airtime" as const,
      service: "Telecel" as const,
      date: new Date(Date.now() - 7200000),
      notes: "Data bundle",
    },
  ];

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
          totalSpent={245.75}
          totalBudget={400}
          period="Monthly"
        />

        <div className="grid grid-cols-3 gap-3">
          <StatCard
            title="Total Spent"
            value="GHS 245"
            icon={Wallet}
            trend="up"
            trendValue="12%"
          />
          <StatCard
            title="Days Left"
            value="15"
            subtitle="This month"
            icon={Calendar}
          />
          <StatCard
            title="Avg Daily"
            value="GHS 16"
            icon={TrendingDown}
            trend="down"
            trendValue="5%"
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
          {recentTransactions.map((transaction) => (
            <TransactionCard
              key={transaction.id}
              {...transaction}
              onEdit={() => console.log("Edit", transaction.id)}
            />
          ))}
        </div>
      </main>

      <AddTransactionSheet />
    </div>
  );
}
