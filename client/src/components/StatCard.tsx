import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: "up" | "down";
  trendValue?: string;
};

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
}: StatCardProps) {
  return (
    <Card className="p-4" data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1" data-testid="text-stat-title">
            {title}
          </p>
          <p className="text-2xl font-bold font-mono mb-1" data-testid="text-stat-value">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground" data-testid="text-stat-subtitle">
              {subtitle}
            </p>
          )}
          {trendValue && (
            <p
              className={`text-xs font-medium mt-1 ${
                trend === "up" ? "text-success" : "text-destructive"
              }`}
              data-testid="text-stat-trend"
            >
              {trend === "up" ? "↑" : "↓"} {trendValue}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
      </div>
    </Card>
  );
}
