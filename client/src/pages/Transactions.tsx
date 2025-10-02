import { useState, useMemo } from "react";
import { TransactionCard } from "@/components/TransactionCard";
import { AddTransactionSheet } from "@/components/AddTransactionSheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { useTransactions, useDeleteTransaction } from "@/hooks/use-transactions";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  
  const { data: transactions, isLoading } = useTransactions();
  const deleteTransaction = useDeleteTransaction();

  const allTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions
      .map(t => ({
        ...t,
        amount: parseFloat(t.amount),
        date: new Date(t.date),
        category: t.category as "Food" | "Transport" | "Airtime" | "Other",
        service: t.service as "MTN" | "AirtelTigo" | "Telecel",
        notes: t.notes || undefined,
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((t) => {
      const matchesSearch = t.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
      const matchesService = serviceFilter === "all" || t.service === serviceFilter;
      return matchesSearch && matchesCategory && matchesService;
    });
  }, [allTransactions, searchTerm, categoryFilter, serviceFilter]);

  const handleDelete = (id: string) => {
    deleteTransaction.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
            <h1 className="text-xl font-bold" data-testid="text-page-title">Transactions</h1>
            <ThemeToggle />
          </div>
        </header>
        <main className="max-w-md mx-auto px-4 py-6">
          <p className="text-center text-muted-foreground">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-xl font-bold" data-testid="text-page-title">Transactions</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>

        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="flex-1" data-testid="select-filter-category">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Transport">Transport</SelectItem>
              <SelectItem value="Airtime">Airtime</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="flex-1" data-testid="select-filter-service">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              <SelectItem value="MTN">MTN</SelectItem>
              <SelectItem value="AirtelTigo">AirtelTigo</SelectItem>
              <SelectItem value="Telecel">Telecel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                {...transaction}
                onEdit={() => console.log("Edit", transaction.id)}
                onDelete={() => handleDelete(transaction.id)}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {allTransactions.length === 0 ? "No transactions yet" : "No transactions found"}
              </p>
            </div>
          )}
        </div>
      </main>

      <AddTransactionSheet />
    </div>
  );
}
