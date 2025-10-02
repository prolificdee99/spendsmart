import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Budget, InsertBudget } from "@shared/schema";

export function useBudgets() {
  return useQuery<Budget[]>({
    queryKey: ["/api/budgets"],
  });
}

type AnalyticsSummary = {
  totalSpent: number;
  categoryTotals: Record<string, number>;
  budgetSummary: Array<{
    id: string;
    userId: string;
    category: string;
    limit: string;
    period: string;
    createdAt: Date;
    updatedAt: Date;
    spent: number;
    remaining: number;
  }>;
  transactionCount: number;
};

export function useAnalyticsSummary() {
  return useQuery<AnalyticsSummary>({
    queryKey: ["/api/analytics/summary"],
  });
}

export function useCreateOrUpdateBudget() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<InsertBudget, "userId">) => {
      const res = await apiRequest("POST", "/api/budgets", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/summary"] });
      toast({
        title: "Success",
        description: "Budget saved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save budget",
        variant: "destructive",
      });
    },
  });
}

export function useDeleteBudget() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/budgets/${id}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/budgets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/summary"] });
      toast({
        title: "Success",
        description: "Budget deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete budget",
        variant: "destructive",
      });
    },
  });
}
