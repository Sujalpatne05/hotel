import React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="rounded-2xl bg-gradient-to-br from-orange-100 via-white to-orange-200 shadow-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-700 mb-2 drop-shadow">Welcome back, <span className="text-orange-500">SUJAL CAFE!</span></h1>
            <p className="text-base text-muted-foreground font-medium">Here’s your restaurant overview and latest insights.</p>
          </div>
          <img src="/logo192.png" alt="Cafe Logo" className="w-20 h-20 rounded-full shadow-md border-2 border-orange-200 bg-white" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Today's Revenue" value="₹35,200" change="+12.5% from yesterday" changeType="positive" icon={<span className="text-2xl">₹</span>} />
        <StatCard title="Total Orders" value="128" change="+8 from yesterday" changeType="positive" icon={<span className="text-2xl">🛒</span>} />
        <StatCard title="Active Customers" value="342" change="+24 this week" changeType="positive" icon={<span className="text-2xl">👥</span>} />
        <StatCard title="Avg Order Value" value="₹275" change="-2.1% from last week" changeType="negative" icon={<span className="text-2xl">📈</span>} />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-orange-700">Weekly Revenue</h2>
        {/* Replace below with your chart component */}
        <div className="w-full h-64 flex items-center justify-center">
          <img src="/chart-placeholder.png" alt="Weekly Revenue Chart" className="h-full object-contain" />
        </div>
      </div>
    </DashboardLayout>
  );
}
