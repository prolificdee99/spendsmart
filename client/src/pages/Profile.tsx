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
import { useState } from "react";

export default function Profile() {
  const [notifications, setNotifications] = useState(true);

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
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold" data-testid="text-user-name">John Doe</h2>
              <p className="text-sm text-muted-foreground" data-testid="text-user-email">
                john.doe@student.edu
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
              onClick={() => console.log("Export data")}
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
                <span className="font-semibold text-foreground">127</span>
              </div>
              <div className="flex justify-between">
                <span>Member Since</span>
                <span className="font-semibold text-foreground">Jan 2025</span>
              </div>
              <div className="flex justify-between">
                <span>Total Spent</span>
                <span className="font-semibold text-foreground font-mono">
                  GHS 1,245.50
                </span>
              </div>
            </div>
          </Card>

          <Button
            variant="destructive"
            className="w-full"
            onClick={() => console.log("Logout")}
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
