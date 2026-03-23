import React, { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { IndianRupee, TrendingUp, ShoppingCart, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import { apiRequest } from "@/lib/api";

type ReportOverview = {
  revenue: number;
  totalOrders: number;
  totalCustomers: number;
  topItems: Array<{ name: string; orders: number }>;
};

const Reports = () => {
  const [overview, setOverview] = useState<ReportOverview>({
    revenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    topItems: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const data = await apiRequest<ReportOverview>("/reports/overview");
        setOverview(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void bootstrap();
  }, []);

  const topItemsChart = useMemo(() => {
    if (overview.topItems && overview.topItems.length > 0) return overview.topItems;
    return [{ name: "No Data", orders: 0 }];
  }, [overview.topItems]);

  const handleDownload = (type: "pdf" | "csv") => {
    if (type === "csv") {
      const csvRows = ["Item,Orders", ...(overview.topItems || []).map((item) => `${item.name},${item.orders}`)];
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "restaurant-report.csv";
      anchor.click();
      URL.revokeObjectURL(url);
      return;
    }

    const doc = new jsPDF();
    doc.text("Restaurant Report", 10, 12);
    doc.text(`Revenue: Rs ${Math.round(overview.revenue).toLocaleString("en-IN")}`, 10, 24);
    doc.text(`Orders: ${overview.totalOrders}`, 10, 32);
    doc.text(`Customers: ${overview.totalCustomers}`, 10, 40);
    doc.text("Top Items:", 10, 50);
    (overview.topItems || []).forEach((item, idx) => {
      doc.text(`${idx + 1}. ${item.name} - ${item.orders}`, 14, 58 + idx * 8);
    });
    doc.save("restaurant-report.pdf");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <button className="px-3 py-1 rounded bg-orange-100 text-orange-700 font-semibold text-sm border shadow" onClick={() => handleDownload("pdf")}>Download PDF</button>
            <button className="px-3 py-1 rounded bg-orange-100 text-orange-700 font-semibold text-sm border shadow" onClick={() => handleDownload("csv")}>Download CSV</button>
          </div>
          <p className="text-muted-foreground">Tenant-isolated performance metrics for current restaurant</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <StatCard title="Total Revenue" value={`Rs ${Math.round(overview.revenue).toLocaleString("en-IN")}`} icon={<IndianRupee className="h-5 w-5" />} />
          <StatCard title="Total Orders" value={String(overview.totalOrders)} icon={<ShoppingCart className="h-5 w-5" />} />
          <StatCard title="Total Customers" value={String(overview.totalCustomers)} icon={<Users className="h-5 w-5" />} />
          <StatCard title="Growth" value={loading ? "..." : `${Math.min(100, Math.round((overview.totalOrders / Math.max(1, overview.totalCustomers)) * 10))}%`} icon={<TrendingUp className="h-5 w-5" />} />
        </div>

        <Card className="shadow-card animate-slide-up w-full mb-4">
          <CardHeader>
            <CardTitle className="text-base">Top Ordered Items</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topItemsChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
