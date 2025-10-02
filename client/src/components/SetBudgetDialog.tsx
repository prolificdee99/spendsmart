import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings } from "lucide-react";
import { useCreateOrUpdateBudget } from "@/hooks/use-budgets";

type SetBudgetDialogProps = {
  category?: string;
  currentLimit?: number;
  currentPeriod?: string;
};

export function SetBudgetDialog({
  category,
  currentLimit,
  currentPeriod,
}: SetBudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(currentLimit?.toString() || "");
  const [period, setPeriod] = useState(currentPeriod || "");
  
  const saveBudget = useCreateOrUpdateBudget();

  useEffect(() => {
    if (open) {
      setLimit(currentLimit?.toString() || "");
      setPeriod(currentPeriod || "");
    }
  }, [open, currentLimit, currentPeriod]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await saveBudget.mutateAsync({
      category: category as any,
      limit: parseFloat(limit),
      period: period as any,
    });
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          data-testid={`button-set-budget-${category?.toLowerCase()}`}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle data-testid="text-dialog-title">
            Set Budget {category ? `for ${category}` : ""}
          </DialogTitle>
          <DialogDescription>
            Configure your spending limit for this category
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="limit">Budget Limit (GHS)</Label>
            <Input
              id="limit"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
              data-testid="input-budget-limit"
              className="text-lg font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Select value={period} onValueChange={setPeriod} required>
              <SelectTrigger id="period" data-testid="select-budget-period">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
              data-testid="button-cancel-budget"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={saveBudget.isPending}
              data-testid="button-save-budget"
            >
              {saveBudget.isPending ? "Saving..." : "Save Budget"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
