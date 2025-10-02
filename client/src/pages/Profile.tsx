import { ThemeToggle } from "@/components/ThemeToggle";
import { AddTransactionSheet } from "@/components/AddTransactionSheet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  User,
  Bell,
  Download,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useAuth } from "@/lib/auth";
import { useTransactions } from "@/hooks/use-transactions";
import { useBudgets } from "@/hooks/use-budgets";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [notifications, setNotifications] = useState(true);
  const { user, logout } = useAuth();
  const { data: transactions } = useTransactions();
  const { data: budgets } = useBudgets();
  const { toast } = useToast();

  const userInitials = useMemo(() => {
    if (!user?.name) return "U";
    const names = user.name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return user.name.slice(0, 2).toUpperCase();
  }, [user]);

  const totalTransactions = useMemo(() => {
    return transactions?.length || 0;
  }, [transactions]);

  const totalSpent = useMemo(() => {
    if (!transactions) return 0;
    return transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  }, [transactions]);

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "N/A";
    return format(new Date(user.createdAt), "MMM yyyy");
  }, [user]);

  const exportData = () => {
    try {
      if (!transactions || transactions.length === 0) {
        toast({
          title: "No data to export",
          description: "You don't have any transactions to export yet.",
          variant: "destructive",
        });
        return;
      }

      let csvContent = "data:text/csv;charset=utf-8,";
      
      csvContent += "TRANSACTIONS\n";
      csvContent += "Date,Category,Service,Amount (GHS),Notes\n";
      
      transactions.forEach(t => {
        const date = format(new Date(t.date), "yyyy-MM-dd HH:mm");
        const notes = (t.notes || "").replace(/,/g, ";");
        csvContent += `${date},${t.category},${t.service},${t.amount},"${notes}"\n`;
      });

      csvContent += "\n\nBUDGETS\n";
      csvContent += "Category,Limit (GHS),Period\n";
      
      if (budgets && budgets.length > 0) {
        budgets.forEach(b => {
          csvContent += `${b.category},${b.limit},${b.period}\n`;
        });
      }

      csvContent += "\n\nSUMMARY\n";
      csvContent += `Total Transactions,${totalTransactions}\n`;
      csvContent += `Total Spent,${totalSpent.toFixed(2)}\n`;
      csvContent += `Member Since,${memberSince}\n`;
      csvContent += `Export Date,${format(new Date(), "yyyy-MM-dd HH:mm")}\n`;

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `expense-tracker-export-${format(new Date(), "yyyy-MM-dd")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export successful",
        description: `Your data has been exported successfully.`,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "An error occurred while exporting your data.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
          <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
            <h1 className="text-xl font-bold" data-testid="text-page-title">Profile</h1>
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
          <h1 className="text-xl font-bold" data-testid="text-page-title">Profile</h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold" data-testid="text-user-name">{user.name}</h2>
              <p className="text-sm text-muted-foreground" data-testid="text-user-email">
                {user.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              data-testid="button-edit-profile"
              onClick={() => console.log("Edit profile")}
            >
              <User className="w-5 h-5" />
            </Button>
          </div>
        </Card>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">
            SETTINGS
          </h3>

          <Card className="divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <Label htmlFor="notifications" className="text-base cursor-pointer">
                  Notifications
                </Label>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
                data-testid="switch-notifications"
              />
            </div>

            <button
              className="w-full p-4 flex items-center justify-between hover-elevate active-elevate-2"
              onClick={exportData}
              data-testid="button-export-data"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-muted-foreground" />
                <span className="text-base">Export Data</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground px-1">
            ACCOUNT
          </h3>

          <Card className="p-4">
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Total Transactions</span>
                <span className="font-semibold text-foreground">{totalTransactions}</span>
              </div>
              <div className="flex justify-between">
                <span>Member Since</span>
                <span className="font-semibold text-foreground">{memberSince}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Spent</span>
                <span className="font-semibold text-foreground font-mono">
                  GHS {totalSpent.toFixed(2)}
                </span>
              </div>
            </div>
          </Card>

          <Button
            variant="destructive"
            className="w-full"
            onClick={() => logout()}
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </main>

      <AddTransactionSheet />
    </div>
  );
}
