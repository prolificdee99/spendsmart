import { useState } from "react";
import { TransactionCard } from "@/components/TransactionCard";
import { AddTransactionSheet } from "@/components/AddTransactionSheet";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");

  const allTransactions = [
    {
      id: "1",
      amount: 25.50,
      category: "Food" as const,
      service: "MTN" as const,
      date: new Date(),
      notes: "Lunch at campus cafeteria",
    },
    {
      id: "2",
      amount: 10.00,
      category: "Transport" as const,
      service: "AirtelTigo" as const,
      date: new Date(Date.now() - 3600000),
    },
    {
      id: "3",
      amount: 5.00,
      category: "Airtime" as const,
      service: "Telecel" as const,
      date: new Date(Date.now() - 7200000),
      notes: "Data bundle",
    },
    {
      id: "4",
      amount: 15.00,
      category: "Food" as const,
      service: "MTN" as const,
      date: new Date(Date.now() - 86400000),
      notes: "Breakfast",
    },
    {
      id: "5",
      amount: 20.00,
      category: "Transport" as const,
      service: "Telecel" as const,
      date: new Date(Date.now() - 172800000),
    },
  ];

  const filteredTransactions = allTransactions.filter((t) => {
    const matchesSearch = t.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
    const matchesService = serviceFilter === "all" || t.service === serviceFilter;
    return matchesSearch && matchesCategory && matchesService;
  });

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
                onDelete={() => console.log("Delete", transaction.id)}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
        </div>
      </main>

      <AddTransactionSheet />
    </div>
  );
}
