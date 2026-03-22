import React from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  Building,
  CircleCheck,
  Clock3,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SuperAdminLayout from "../components/SuperAdminLayout";

const monthlyPerformance = [
  { month: "Jan", revenue: 1200000, churnRisk: 11 },
  { month: "Feb", revenue: 1480000, churnRisk: 9 },
  { month: "Mar", revenue: 1640000, churnRisk: 8 },
  { month: "Apr", revenue: 1710000, churnRisk: 9 },
  { month: "May", revenue: 1980000, churnRisk: 7 },
  { month: "Jun", revenue: 2160000, churnRisk: 6 },
  { month: "Jul", revenue: 2290000, churnRisk: 5 },
  { month: "Aug", revenue: 2410000, churnRisk: 5 },
  { month: "Sep", revenue: 2540000, churnRisk: 4 },
  { month: "Oct", revenue: 2630000, churnRisk: 4 },
  { month: "Nov", revenue: 2790000, churnRisk: 3 },
  { month: "Dec", revenue: 3010000, churnRisk: 3 },
];

const alerts = [
  { id: 1, title: "3 restaurants in payment grace", severity: "high", action: "Review subscriptions" },
  { id: 2, title: "API latency crossed 450ms in West zone", severity: "medium", action: "Open platform analytics" },
  { id: 3, title: "7 unresolved support tickets > 12h", severity: "high", action: "Escalate support queue" },
  { id: 4, title: "Inventory sync failed for 2 stores", severity: "low", action: "Trigger data sync" },
];

const topRestaurants = [
  { name: "Taj Palace", city: "Delhi", mrr: "Rs. 2.8L", uptime: "99.95%" },
  { name: "Leela Ambience", city: "Gurgaon", mrr: "Rs. 2.3L", uptime: "99.92%" },
  { name: "Spice Republic", city: "Bengaluru", mrr: "Rs. 1.9L", uptime: "99.88%" },
  { name: "Coastal Kitchen", city: "Mumbai", mrr: "Rs. 1.6L", uptime: "99.83%" },
];

const kpis = [
  {
    title: "Platform MRR",
    value: "Rs. 30.1L",
    trend: "+12.4%",
    icon: <CreditCard className="h-5 w-5 text-sky-700" />,
    tone: "from-sky-50 to-sky-100 border-sky-200",
  },
  {
    title: "Active Restaurants",
    value: "128 / 142",
    trend: "+4 this month",
    icon: <Building className="h-5 w-5 text-emerald-700" />,
    tone: "from-emerald-50 to-emerald-100 border-emerald-200",
  },
  {
    title: "SLA Resolution",
    value: "96.2%",
    trend: "-1.1%",
    icon: <ShieldCheck className="h-5 w-5 text-amber-700" />,
    tone: "from-amber-50 to-amber-100 border-amber-200",
  },
  {
    title: "Total Users",
    value: "8,540",
    trend: "+382",
    icon: <Users className="h-5 w-5 text-violet-700" />,
    tone: "from-violet-50 to-violet-100 border-violet-200",
  },
];

function getSeverityClasses(severity: string) {
  if (severity === "high") return "bg-red-50 text-red-700 border-red-200";
  if (severity === "medium") return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-sky-50 text-sky-700 border-sky-200";
}

export default function SuperAdminDashboard() {
  const navigate = useNavigate();

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 px-4 py-6 text-white sm:px-6 sm:py-8">
          <div className="absolute -top-20 -right-16 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute -bottom-20 left-0 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                <Sparkles className="h-3.5 w-3.5" />
                Live Command Center
              </p>
              <h1 className="text-2xl font-extrabold sm:text-3xl">Super Admin Control Tower</h1>
              <p className="mt-2 max-w-2xl text-sm text-cyan-100 sm:text-base">
                Revenue, subscription health, incidents, and tenant performance at one place. Prioritize risks before they impact growth.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => navigate("/superadmin-support")}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-left text-sm font-semibold transition hover:bg-white/20"
              >
                Open Incidents
                <div className="mt-1 text-cyan-100">7 pending</div>
              </button>
              <button
                onClick={() => navigate("/superadmin-subscriptions")}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-left text-sm font-semibold transition hover:bg-white/20"
              >
                Payment Risk
                <div className="mt-1 text-cyan-100">3 grace accounts</div>
              </button>
              <button
                onClick={() => navigate("/superadmin-restaurants")}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-left text-sm font-semibold transition hover:bg-white/20"
              >
                Restaurant Health
                <div className="mt-1 text-cyan-100">89.4 score</div>
              </button>
              <button
                onClick={() => navigate("/superadmin-analytics")}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-left text-sm font-semibold transition hover:bg-white/20"
              >
                Analytics Deep Dive
                <div className="mt-1 text-cyan-100">Open charts</div>
              </button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <article key={kpi.title} className={`rounded-xl border bg-gradient-to-b p-4 shadow-sm ${kpi.tone}`}>
              <div className="flex items-start justify-between">
                <div className="rounded-lg bg-white/70 p-2">{kpi.icon}</div>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-xs font-bold text-slate-700">
                  <ArrowUpRight className="h-3 w-3" />
                  {kpi.trend}
                </span>
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-700">{kpi.title}</p>
              <p className="mt-1 text-2xl font-extrabold text-slate-900">{kpi.value}</p>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Revenue Growth vs Churn Risk</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Last 12 months</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyPerformance} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mrrFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#64748b" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" fontSize={12} />
                  <Tooltip formatter={(value: number, name: string) => [name === "revenue" ? `Rs. ${value.toLocaleString("en-IN")}` : `${value}%`, name === "revenue" ? "Revenue" : "Churn Risk"]} />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#0284c7" fill="url(#mrrFill)" strokeWidth={2.5} />
                  <Line yAxisId="right" type="monotone" dataKey="churnRisk" stroke="#f97316" strokeWidth={2.5} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Priority Alerts</h2>
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className={`rounded-xl border p-3 ${getSeverityClasses(alert.severity)}`}>
                  <p className="text-sm font-semibold">{alert.title}</p>
                  <button className="mt-2 inline-flex items-center gap-1 text-xs font-bold underline underline-offset-2" onClick={() => navigate(alert.action.includes("support") ? "/superadmin-support" : "/superadmin-subscriptions")}>
                    {alert.action}
                  </button>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Top Performing Restaurants</h2>
              <button onClick={() => navigate("/superadmin-restaurants")} className="text-sm font-semibold text-sky-700 hover:text-sky-800">
                View all
              </button>
            </div>
            <div className="space-y-3">
              {topRestaurants.map((store) => (
                <div key={store.name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
                  <div>
                    <p className="font-semibold text-slate-900">{store.name}</p>
                    <p className="text-xs text-slate-500">{store.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-700">{store.mrr}</p>
                    <p className="text-xs text-slate-500">Uptime {store.uptime}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Today&apos;s Platform Checklist</h2>
              <Clock3 className="h-5 w-5 text-slate-500" />
            </div>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <CircleCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-emerald-900">Daily backup completed</p>
                  <p className="text-xs text-emerald-700">Completed at 04:30 AM</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3">
                <Zap className="mt-0.5 h-4 w-4 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-amber-900">Pending: ticket SLA audit</p>
                  <p className="text-xs text-amber-700">7 tickets approaching SLA breach</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50 p-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-sky-700" />
                <div>
                  <p className="text-sm font-semibold text-sky-900">Security policy check</p>
                  <p className="text-xs text-sky-700">2FA compliance is at 88%, target 95%</p>
                </div>
              </li>
            </ul>
          </article>
        </section>
      </div>
    </SuperAdminLayout>
  );
}
