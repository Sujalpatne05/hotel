import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { NotificationBell, ThemeToggle, AISuggestionPanel } from "@/components/StatCard";
import { UserCog } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col relative">
          <header className="min-h-14 flex items-center justify-between border-b px-3 py-2 sm:px-4 bg-card relative gap-2">
            <SidebarTrigger />
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-end">
              <NotificationBell />
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
