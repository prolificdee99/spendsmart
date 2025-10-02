import { BudgetOverviewCard } from "../BudgetOverviewCard";

export default function BudgetOverviewCardExample() {
  return (
    <div className="p-4 max-w-md">
      <BudgetOverviewCard
        totalSpent={245.75}
        totalBudget={400}
        period="Monthly"
      />
    </div>
  );
}
