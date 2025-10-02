import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { UtensilsCrossed, Car, Phone, MoreHorizontal } from "lucide-react";

type TransactionCardProps = {
  id: string;
  amount: number;
  category: "Food" | "Transport" | "Airtime" | "Other";
  service: "AirtelTigo" | "MTN" | "Telecel";
  date: Date;
  notes?: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const categoryIcons = {
  Food: UtensilsCrossed,
  Transport: Car,
  Airtime: Phone,
  Other: MoreHorizontal,
};

const categoryColors = {
  Food: "bg-food/10 text-food",
  Transport: "bg-transport/10 text-transport",
  Airtime: "bg-airtime/10 text-airtime",
  Other: "bg-other/10 text-other",
};

const serviceColors = {
  AirtelTigo: "bg-destructive/10 text-destructive",
  MTN: "bg-warning/10 text-warning",
  Telecel: "bg-primary/10 text-primary",
};

export function TransactionCard({
  id,
  amount,
  category,
  service,
  date,
  notes,
  onEdit,
  onDelete,
}: TransactionCardProps) {
  const Icon = categoryIcons[category];

  return (
    <Card
      data-testid={`transaction-card-${id}`}
      className="p-4 hover-elevate active-elevate-2 cursor-pointer"
      onClick={() => onEdit?.()}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${categoryColors[category]}`}>
          <Icon className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-base" data-testid={`text-category-${id}`}>
              {category}
            </h3>
            <span
              className="text-lg font-bold font-mono whitespace-nowrap"
              data-testid={`text-amount-${id}`}
            >
              GHS {amount.toFixed(2)}
            </span>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <Badge
              variant="secondary"
              className={serviceColors[service]}
              data-testid={`badge-service-${id}`}
            >
              {service}
            </Badge>
            <span className="text-xs text-muted-foreground" data-testid={`text-date-${id}`}>
              {format(date, "MMM d, h:mm a")}
            </span>
          </div>
          
          {notes && (
            <p className="text-sm text-muted-foreground truncate" data-testid={`text-notes-${id}`}>
              {notes}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
