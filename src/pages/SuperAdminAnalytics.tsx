import React, { useEffect, useState } from "react";
import SuperAdminLayout from "../components/SuperAdminLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from "recharts";
import { TrendingUp, ShoppingCart, Users, Building, ArrowUp, ArrowDown } from "lucide-react";
import { buildAuthHeaders } from "@/lib/session";

const API_BASE_URL = (() => {
  const configured = (import.meta.env.VITE_API_URL || "").trim();
  if (typeof window !== "undefined" && window.location.protocol === "https:" && configured.startsWith("http://")) return "/api";
  return configured || (typeof window !== "undefined" && window.location.hostname !== "localhost" ? "/api" : "http://localhost:5000");
})();

const monthlyData = [
  { month: "Jan", revenue: 120000, orders: 320, restaurants: 8 },
  { month: "Feb", revenue: 148000, orders: 400, restaurants: 10 },
  { month: "Mar", revenue: 164000, orders: 500, restaurants: 12 },
  { month: "Apr", revenue: 171000, orders: 450, restaurants: 14 },
  { month: "May", revenue: 198000, orders: 600, restaurants: 16 },
  { month: "Jun", revenue: 216000, orders: 550, restaurants: 18 },
  { month: "Jul", revenue: 229000, orders: 580, restaurants: 20 },
  { month: "Aug", revenue: 241000, orders: 520, restaurants: 22 },
  { month: "Sep", revenue: 254000, orders: 480, restaurants: 24 },
  { month: "Oct", revenue: 263000, orders: 510, restaurants: 26 },
  { month: "Nov", revenue: 279000, orders: 490, restaurants: 28 },
  { month: "Dec", revenue: 301000, orders: 610, restaurants: 30 },
];

const COLORS = ["#0ea5e9", "#10b981", "#f97316", "#8b5cf6"];

export default function SuperAdminAnalytics() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const headers = buildAuthHeaders() || {};
        const [rRes, oRes] = await Promise.all([
          fetch(`${API_BASE_URL}/superadmin/restaurants`, { headers }),
          fetch(`${API_BASE_URL}/orders`, { headers }),
        ]);
        const [rData, oData] = await Promise.all([rRes.json(), oRes.json()]);
        setRestaurants(Array.isArray(rData) ? rData : []);
        setOrders(Array.isArray(oData) ? oData : []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const activeRestaurants = restaurants.filter(r => r.status === "Active").length;

  // Order type distribution
  const orderTypeData = [
    { name: "Dine-in", value: orders.filter(o => o.orderType === "dine-in").length },
    { name: "Takeaway", value: orders.filter(o => o.orderType === "take-away").length },
    { name: "Delivery", value: orders.filter(o => o.orderType === "delivery").length },
  ].filter(d => d.value > 0);

  // Plan distribution
  const planData = [
    { name: "Premium", value: restaurants.filter(r => r.plan === "Premium").length },
    { name: "Standard", value: restaurants.filter(r => r.plan === "Standard").length },
  ];

  const kpis = [
    { title: "Total Platform Revenue", value: `₹${totalRevenue.toLocaleString("en-IN")}`, change: "+12.4%", up: true, icon: TrendingUp, color: "#0ea5e9" },
    { title: "Total Orders", value: totalOrders.toString(), change: "+8.2%", up: true, icon: ShoppingCart, color: "#10b981" },
    { title: "Avg Order Value", value: `₹${avgOrderValue}`, change: "-2.1%", up: false, icon: TrendingUp, color: "#f97316" },
    { title: "Active Restaurants", value: activeRestaurants.toString(), change: "+4 this month", up: true, icon: Building, color: "#8b5cf6" },
  ];

  return (
    <SuperAdminLayout>
      <div className="space-y-6 p-3 sm:p-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-500 mt-1">Comprehensive platform-wide performance metrics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(kpi => (
            <div key={kpi.title} className="bg-white rounded-xl border p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="p-2 rounded-lg" style={{ background: kpi.color + "20" }}>
                  <kpi.icon className="h-5 w-5" style={{ color: kpi.color }} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-bold ${kpi.up ? "text-green-600" : "text-red-500"}`}>
                  {kpi.up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                  {kpi.change}
                </span>
              </div>
              <p className="text-sm text-gray-500">{kpi.title}</p>
              <p className="text-2xl font-extrabold text-gray-900 mt-1">{loading ? "..." : kpi.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Revenue Trend</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, "Revenue"]} />
                  <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Orders Trend */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Monthly Orders</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Type Distribution */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Type Distribution</h2>
            {orderTypeData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400">No order data yet</div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={orderTypeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {orderTypeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Restaurant Growth */}
          <div className="bg-white rounded-xl border p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Restaurant Growth</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="restaurants" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
