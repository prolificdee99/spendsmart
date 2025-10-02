import { BudgetCard } from "../BudgetCard";

export default function BudgetCardExample() {
  return (
    <div className="space-y-4 p-4 max-w-md">
      <BudgetCard category="Food" spent={120} limit={200} period="weekly" />
      <BudgetCard category="Transport" spent={85} limit={100} period="weekly" />
      <BudgetCard category="Airtime" spent={45} limit={50} period="monthly" />
      <BudgetCard category="Other" spent={15} limit={80} period="daily" />
    </div>
  );
}
