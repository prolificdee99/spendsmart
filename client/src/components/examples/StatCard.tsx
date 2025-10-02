import { StatCard } from "../StatCard";
import { Wallet, TrendingDown, Calendar } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-3 gap-3 p-4 max-w-md">
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
  );
}
