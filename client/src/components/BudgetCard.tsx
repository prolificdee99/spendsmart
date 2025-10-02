import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle } from "lucide-react";

type BudgetCardProps = {
  category: "Food" | "Transport" | "Airtime" | "Other";
  spent: number;
  limit: number;
  period: "daily" | "weekly" | "monthly";
};

const categoryColors = {
  Food: "food",
  Transport: "transport",
  Airtime: "airtime",
  Other: "other",
};

export function BudgetCard({ category, spent, limit, period }: BudgetCardProps) {
  const percentage = (spent / limit) * 100;
  const isNearLimit = percentage >= 80;
  const isOverLimit = percentage >= 100;
  const colorClass = categoryColors[category];

  return (
    <Card
      data-testid={`budget-card-${category.toLowerCase()}`}
      className={`p-4 border-l-4 ${
        isOverLimit
          ? "border-l-destructive"
          : isNearLimit
          ? "border-l-warning"
          : `border-l-${colorClass}`
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-base" data-testid={`text-category-${category.toLowerCase()}`}>
            {category}
          </h3>
          <p className="text-xs text-muted-foreground capitalize">{period} budget</p>
        </div>
        {isNearLimit && (
          <AlertCircle
            className={`w-5 h-5 ${
              isOverLimit ? "text-destructive" : "text-warning"
            }`}
            data-testid={`icon-alert-${category.toLowerCase()}`}
          />
        )}
      </div>
      
      <div className="space-y-2">
        <Progress
          value={Math.min(percentage, 100)}
          className="h-2"
          data-testid={`progress-${category.toLowerCase()}`}
        />
        
        <div className="flex justify-between items-baseline">
          <div>
            <span className="text-lg font-bold font-mono" data-testid={`text-spent-${category.toLowerCase()}`}>
              GHS {spent.toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground"> / GHS {limit.toFixed(2)}</span>
          </div>
          <span
            className={`text-sm font-medium ${
              isOverLimit
                ? "text-destructive"
                : isNearLimit
                ? "text-warning"
                : "text-muted-foreground"
            }`}
            data-testid={`text-percentage-${category.toLowerCase()}`}
          >
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>
    </Card>
  );
}
