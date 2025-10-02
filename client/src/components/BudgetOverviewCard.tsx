import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type BudgetOverviewCardProps = {
  totalSpent: number;
  totalBudget: number;
  period: string;
};

export function BudgetOverviewCard({
  totalSpent,
  totalBudget,
  period,
}: BudgetOverviewCardProps) {
  const percentage = (totalSpent / totalBudget) * 100;
  const remaining = totalBudget - totalSpent;
  const isOverBudget = totalSpent > totalBudget;

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20" data-testid="card-budget-overview">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">
              {period} Budget
            </h2>
            <p className="text-4xl font-bold font-mono mt-1" data-testid="text-total-spent">
              GHS {totalSpent.toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              of GHS {totalBudget.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-muted-foreground">
              Remaining
            </p>
            <p
              className={`text-2xl font-bold font-mono mt-1 ${
                isOverBudget ? "text-destructive" : "text-success"
              }`}
              data-testid="text-remaining"
            >
              {isOverBudget ? "-" : ""}GHS {Math.abs(remaining).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Progress
            value={Math.min(percentage, 100)}
            className="h-3"
            data-testid="progress-budget"
          />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {percentage.toFixed(0)}% used
            </span>
            {percentage >= 80 && (
              <span
                className={`font-medium ${
                  isOverBudget ? "text-destructive" : "text-warning"
                }`}
              >
                {isOverBudget ? "Over budget!" : "Approaching limit"}
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
