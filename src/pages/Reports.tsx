import React, { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IndianRupee, TrendingUp, ShoppingCart, Users, Download, BarChart3, PieChart as PieChartIcon, Calendar } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import jsPDF from "jspdf";
import { apiRequest } from "@/lib/api";

type Order = {
  id: number;
  items: string[];
  total: number;
  status: string;
  orderType?: string;
  paymentStatus?: string;
  created_at?: string;
};

type ReportOverview = {
  revenue: number;
  totalOrders: number;
  totalCustomers: number;
  topItems: Array<{ name: string; orders: number }>;
};

const COLORS = ["#FF6B35", "#004E89", "#1B6CA8", "#F7931E", "#FDB913", "#C1272D"];

const Reports = () => {
  const [overview, setOverview] = useState<ReportOverview>({
    revenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    topItems: [],
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily");

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [overviewData, ordersData] = await Promise.all([
          apiRequest<ReportOverview>("/reports/overview"),
          apiRequest<Order[]>("/orders", { method: "GET" }, true),
        ]);
        setOverview(overviewData);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (error) {
        // Reports load error
      } finally {
        setLoading(false);
      }
    };
    void bootstrap();
  }, []);

  // Calculate top selling items with quantities
  const topSellingItems = useMemo(() => {
    const itemCounts: { [key: string]: number } = {};
    orders.forEach((order) => {
      if (Array.isArray(order.items)) {
        order.items.forEach((item) => {
          const match = item.match(/^(.+?)\s+x(\d+)$/);
          const itemName = match ? match[1] : item;
          const qty = match ? Number(match[2]) : 1;
          itemCounts[itemName] = (itemCounts[itemName] || 0) + qty;
        });
      }
    });
    return Object.entries(itemCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [orders]);

  // Calculate revenue by order type
  const revenueByType = useMemo(() => {
    const typeRevenue: { [key: string]: number } = {
      "dine-in": 0,
      "take-away": 0,
      delivery: 0,
    };
    orders.forEach((order) => {
      const type = order.orderType || "dine-in";
      typeRevenue[type] = (typeRevenue[type] || 0) + Number(order.total);
    });
    return Object.entries(typeRevenue).map(([name, value]) => ({
      name: name === "dine-in" ? "Dine-in" : name === "take-away" ? "Takeaway" : "Delivery",
      value,
    }));
  }, [orders]);

  // Calculate payment method breakdown
  const paymentMethodBreakdown = useMemo(() => {
    const methods: { [key: string]: number } = { cash: 0, card: 0, upi: 0 };
    orders.forEach((order) => {
      const method = order.paymentStatus === "paid" ? (order.paymentStatus || "cash") : "unpaid";
      if (method !== "unpaid") {
        methods[method] = (methods[method] || 0) + Number(order.total);
      }
    });
    return Object.entries(methods).map(([name, value]) => ({
      name: name.toUpperCase(),
      value,
    }));
  }, [orders]);

  // Daily revenue trend
  const dailyRevenue = useMemo(() => {
    const days: { [key: string]: number } = {};
    orders.forEach((order) => {
      if (order.created_at) {
        const date = new Date(order.created_at).toLocaleDateString("en-IN");
        days[date] = (days[date] || 0) + Number(order.total);
      }
    });
    return Object.entries(days)
      .map(([date, revenue]) => ({ date, revenue }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7);
  }, [orders]);

  // Order type distribution
  const orderTypeDistribution = useMemo(() => {
    const types: { [key: string]: number } = { "dine-in": 0, "take-away": 0, delivery: 0 };
    orders.forEach((order) => {
      const type = order.orderType || "dine-in";
      types[type] = (types[type] || 0) + 1;
    });
    return Object.entries(types).map(([name, count]) => ({
      name: name === "dine-in" ? "Dine-in" : name === "take-away" ? "Takeaway" : "Delivery",
      count,
    }));
  }, [orders]);

  const handleDownload = (type: "pdf" | "csv") => {
    if (type === "csv") {
      const csvRows = [
        "Restaurant Report",
        `Generated: ${new Date().toLocaleString("en-IN")}`,
        "",
        "SUMMARY",
        `Total Revenue,Rs ${Math.round(overview.revenue).toLocaleString("en-IN")}`,
        `Total Orders,${overview.totalOrders}`,
        `Total Customers,${overview.totalCustomers}`,
        "",
        "TOP SELLING ITEMS",
        "Item,Quantity",
        ...topSellingItems.map((item) => `${item.name},${item.count}`),
        "",
        "REVENUE BY ORDER TYPE",
        "Type,Amount",
        ...revenueByType.map((item) => `${item.name},Rs ${item.value}`),
      ];
      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `restaurant-report-${new Date().toISOString().split("T")[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const doc = new jsPDF();
    let yPos = 15;
    
    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, "bold");
    doc.text("Restaurant Report", 10, yPos);
    yPos += 10;
    
    // Generated date
    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`Generated: ${new Date().toLocaleString("en-IN")}`, 10, yPos);
    yPos += 8;

    // Summary section
    doc.setFont(undefined, "bold");
    doc.text("SUMMARY", 10, yPos);
    yPos += 6;
    doc.setFont(undefined, "normal");
    doc.text(`Total Revenue: Rs ${Math.round(overview.revenue).toLocaleString("en-IN")}`, 12, yPos);
    yPos += 5;
    doc.text(`Total Orders: ${overview.totalOrders}`, 12, yPos);
    yPos += 5;
    doc.text(`Total Customers: ${overview.totalCustomers}`, 12, yPos);
    yPos += 10;

    // Top Selling Items section
    doc.setFont(undefined, "bold");
    doc.text("TOP SELLING ITEMS", 10, yPos);
    yPos += 6;
    doc.setFont(undefined, "normal");
    topSellingItems.slice(0, 10).forEach((item, idx) => {
      doc.text(`${idx + 1}. ${item.name} - ${item.count} units`, 12, yPos);
      yPos += 5;
      if (yPos > 270) {
        doc.addPage();
        yPos = 15;
      }
    });

    yPos += 5;
    
    // Revenue by Order Type section
    doc.setFont(undefined, "bold");
    doc.text("REVENUE BY ORDER TYPE", 10, yPos);
    yPos += 6;
    doc.setFont(undefined, "normal");
    revenueByType.forEach((item) => {
      doc.text(`${item.name}: Rs ${item.value.toLocaleString("en-IN")}`, 12, yPos);
      yPos += 5;
    });

    doc.save(`restaurant-report-${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const topItemsChart = useMemo(() => {
    return overview.topItems && overview.topItems.length > 0 ? overview.topItems : [{ name: "No Data", orders: 0 }];
  }, [overview.topItems]);

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 p-3 sm:p-4 md:p-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="text-orange-500 flex-shrink-0" size={24} /> Reports & Analytics
          </h1>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-2 sm:mt-3">
            <button
              className="px-3 sm:px-4 py-2 rounded bg-orange-500 text-white font-semibold text-xs sm:text-sm hover:bg-orange-600 flex items-center gap-2 w-full sm:w-auto justify-center"
              onClick={() => handleDownload("pdf")}
            >
              <Download size={14} /> Download PDF
            </button>
            <button
              className="px-3 sm:px-4 py-2 rounded bg-blue-500 text-white font-semibold text-xs sm:text-sm hover:bg-blue-600 flex items-center gap-2 w-full sm:w-auto justify-center"
              onClick={() => handleDownload("csv")}
            >
              <Download size={14} /> Download CSV
            </button>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm mt-2">Comprehensive analytics and performance metrics</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <StatCard title="Total Revenue" value={`₹${Math.round(overview.revenue).toLocaleString("en-IN")}`} icon={<IndianRupee className="h-4 sm:h-5 w-4 sm:w-5" />} />
          <StatCard title="Total Orders" value={String(overview.totalOrders)} icon={<ShoppingCart className="h-4 sm:h-5 w-4 sm:w-5" />} />
          <StatCard title="Total Customers" value={String(overview.totalCustomers)} icon={<Users className="h-4 sm:h-5 w-4 sm:w-5" />} />
          <StatCard
            title="Avg Order Value"
            value={`₹${overview.totalOrders > 0 ? Math.round(overview.revenue / overview.totalOrders).toLocaleString("en-IN") : 0}`}
            icon={<TrendingUp className="h-4 sm:h-5 w-4 sm:w-5" />}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full overflow-x-auto flex gap-1 sm:gap-0 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="overview" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0">Overview</TabsTrigger>
            <TabsTrigger value="items" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0">Items</TabsTrigger>
            <TabsTrigger value="breakdown" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0 hidden sm:inline-flex">Breakdown</TabsTrigger>
            <TabsTrigger value="trends" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0">Trends</TabsTrigger>
            <TabsTrigger value="tally" className="text-xs sm:text-sm whitespace-nowrap flex-shrink-0">Tally</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-3 sm:space-y-4 mt-3 sm:mt-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                {/* Revenue by Order Type */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <PieChartIcon size={20} className="text-orange-500" /> Revenue by Order Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={revenueByType} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value">
                          {revenueByType.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${value}`} />
                        <Legend verticalAlign="bottom" height={36} formatter={(value, entry: any) => `${value}: ₹${entry.payload.value}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Order Type Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Type Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {orderTypeDistribution.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <span className="font-medium">{item.name}</span>
                          <Badge className="bg-orange-100 text-orange-800">{item.count} orders</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Top Items Tab */}
          {activeTab === "items" && (
            <div className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Top 10 Selling Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={topSellingItems}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#FF6B35" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Top Items List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detailed Item Sales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-2 px-3 font-semibold">Rank</th>
                          <th className="text-left py-2 px-3 font-semibold">Item Name</th>
                          <th className="text-right py-2 px-3 font-semibold">Quantity Sold</th>
                          <th className="text-right py-2 px-3 font-semibold">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topSellingItems.map((item, idx) => {
                          const total = topSellingItems.reduce((sum, i) => sum + i.count, 0);
                          const percentage = ((item.count / total) * 100).toFixed(1);
                          return (
                            <tr key={idx} className="border-b hover:bg-gray-50">
                              <td className="py-2 px-3 font-bold text-orange-600">#{idx + 1}</td>
                              <td className="py-2 px-3">{item.name}</td>
                              <td className="py-2 px-3 text-right font-semibold">{item.count}</td>
                              <td className="py-2 px-3 text-right">
                                <Badge className="bg-blue-100 text-blue-800">{percentage}%</Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Breakdown Tab */}
          {activeTab === "breakdown" && (
            <div className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Method Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={paymentMethodBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${value}`} />
                      <Bar dataKey="value" fill="#004E89" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentMethodBreakdown.map((item, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600 mb-2">{item.name}</p>
                      <p className="text-2xl font-bold text-orange-600">₹{item.value.toLocaleString("en-IN")}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Trends Tab */}
          {activeTab === "trends" && (
            <div className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Daily Revenue Trend (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dailyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => `₹${value}`} />
                      <Legend />
                      <Line type="monotone" dataKey="revenue" stroke="#FF6B35" strokeWidth={2} dot={{ fill: "#FF6B35", r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Tally Tab */}
          {activeTab === "tally" && (
            <div className="space-y-4 mt-4">
              {/* Period Selector */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPeriod("daily")}
                  className={`px-4 py-2 rounded font-semibold ${period === "daily" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"}`}
                >
                  Daily
                </button>
                <button
                  onClick={() => setPeriod("weekly")}
                  className={`px-4 py-2 rounded font-semibold ${period === "weekly" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"}`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setPeriod("monthly")}
                  className={`px-4 py-2 rounded font-semibold ${period === "monthly" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700"}`}
                >
                  Monthly
                </button>
              </div>

              {/* Tally Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">₹{Math.round(overview.revenue).toLocaleString("en-IN")}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">{overview.totalOrders}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Avg Order Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-purple-600">
                      ₹{overview.totalOrders > 0 ? Math.round(overview.revenue / overview.totalOrders).toLocaleString("en-IN") : 0}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">Total Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-orange-600">{overview.totalCustomers}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Methods */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Payment Methods</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {paymentMethodBreakdown.map((item, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border">
                        <p className="text-sm text-gray-600 mb-2">{item.name}</p>
                        <p className="text-2xl font-bold text-orange-600">₹{item.value.toLocaleString("en-IN")}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Type Revenue */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue by Order Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {revenueByType.map((item, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-gray-600 mb-2">{item.name}</p>
                        <p className="text-2xl font-bold text-blue-600">₹{item.value.toLocaleString("en-IN")}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bills List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar size={20} /> All Bills ({orders.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-3 px-4 font-semibold">Bill ID</th>
                          <th className="text-left py-3 px-4 font-semibold">Type</th>
                          <th className="text-left py-3 px-4 font-semibold">Items</th>
                          <th className="text-center py-3 px-4 font-semibold">Payment</th>
                          <th className="text-right py-3 px-4 font-semibold">Amount</th>
                          <th className="text-center py-3 px-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium text-orange-600">ORD-{order.id}</td>
                            <td className="py-3 px-4">
                              <Badge
                                className={
                                  order.orderType === "dine-in"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.orderType === "take-away"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-purple-100 text-purple-800"
                                }
                              >
                                {order.orderType === "dine-in" ? "Dine-in" : order.orderType === "take-away" ? "Takeaway" : "Delivery"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-gray-600 truncate max-w-xs">
                              {Array.isArray(order.items) ? order.items.join(", ") : "N/A"}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge className="bg-gray-100 text-gray-800">{order.paymentStatus === "paid" ? "Paid" : "Unpaid"}</Badge>
                            </td>
                            <td className="py-3 px-4 text-right font-bold">₹{Number(order.total).toLocaleString("en-IN")}</td>
                            <td className="py-3 px-4 text-center">
                              <Badge
                                className={
                                  order.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : order.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                                }
                              >
                                {order.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
