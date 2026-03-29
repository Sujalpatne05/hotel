import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/StatCard";
import { ShoppingCart, Clock, CheckCircle, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { buildAuthHeaders, clearAuthSession, isAuthError } from "@/lib/session";

const API_BASE_URL = (() => {
  const configured = (import.meta.env.VITE_API_URL || "").trim();
  if (typeof window !== "undefined" && window.location.protocol === "https:" && configured.startsWith("http://")) {
    return "/api";
  }
  return configured || (typeof window !== "undefined" && window.location.hostname !== "localhost" ? "/api" : "http://localhost:5000");
})();

type OrderStatus = "pending" | "preparing" | "ready" | "served" | "completed";

type ApiOrder = {
  id: number;
  user_id: number;
  table_number?: number | null;
  items: string[];
  total: string | number;
  status: OrderStatus;
  orderType?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  created_at?: string;
};

type Order = {
  id: number;
  tableNumber: number | null;
  items: string[];
  total: number;
  status: OrderStatus;
  orderType?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  createdAt: Date;
};

const statusStyle: Record<OrderStatus, string> = {
  pending: "bg-yellow-500 text-white",
  preparing: "bg-blue-500 text-white",
  ready: "bg-green-600 text-white",
  served: "bg-gray-500 text-white",
  completed: "bg-green-700 text-white",
};

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  const goToLogin = (message = "Session expired. Please login again.") => {
    setError(message);
    clearAuthSession();
    setTimeout(() => navigate("/admin-login"), 300);
  };

  const loadOrders = async () => {
    try {
      setError("");
      const headers = buildAuthHeaders();
      if (!headers) {
        goToLogin("Please login to continue.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/orders`, { headers });
      const data = await response.json();

      if (isAuthError(response.status)) {
        goToLogin(data?.error || "Session expired. Please login again.");
        return;
      }

      if (!response.ok) {
        setError(data?.error || "Unable to load orders.");
        return;
      }

      const mapped = (Array.isArray(data) ? data : []).map((order: ApiOrder) => {
        // Use the actual order status from backend
        // Don't override based on payment status - let KDS control the workflow
        const displayStatus = order.status || "pending";
        
        return {
          id: order.id,
          tableNumber: order.table_number ?? null,
          items: Array.isArray(order.items) ? order.items : [],
          total: Number(order.total),
          status: displayStatus,
          orderType: order.orderType,
          paymentStatus: order.paymentStatus,
          paymentMethod: order.paymentMethod,
          createdAt: order.created_at ? new Date(order.created_at) : new Date(),
        };
      });

      setOrders(mapped);
    } catch (e) {
      setError("Unable to connect to backend.");
    }
  };

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(
    () => ({
      pending: orders.filter((o) => o.status === "pending").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      ready: orders.filter((o) => o.status === "ready").length,
      served: orders.filter((o) => o.status === "served").length,
      completed: orders.filter((o) => o.status === "completed").length,
    }),
    [orders],
  );

  const getOrderTypeLabel = (orderType?: string) => {
    switch (orderType) {
      case "dine-in":
        return "Dine-in";
      case "take-away":
        return "Takeaway";
      case "delivery":
        return "Delivery";
      default:
        return "Order";
    }
  };

  const getOrderTypeColor = (orderType?: string) => {
    switch (orderType) {
      case "dine-in":
        return "bg-blue-100 text-blue-800";
      case "take-away":
        return "bg-orange-100 text-orange-800";
      case "delivery":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodLabel = (method?: string) => {
    if (!method) return "Not specified";
    return method.toUpperCase();
  };

  const renderOrders = (filter: "all" | OrderStatus) => {
    const list = filter === "all" ? orders : orders.filter((order) => order.status === filter);

    if (list.length === 0) {
      return <p className="text-xs sm:text-sm text-muted-foreground">No orders found.</p>;
    }

    return (
      <div className="grid gap-3 sm:gap-4">
        {list.map((order) => (
          <Card key={order.id} className="shadow-card">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col gap-2 sm:gap-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm sm:text-base">ORD-{order.id}</span>
                      <Badge className={`${statusStyle[order.status]} text-xs`}>{order.status}</Badge>
                      <Badge className={`${getOrderTypeColor(order.orderType)} text-xs`}>
                        {getOrderTypeLabel(order.orderType)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{order.createdAt.toLocaleString()}</p>
                    {order.tableNumber !== null && (
                      <p className="text-xs text-muted-foreground">Table {order.tableNumber}</p>
                    )}
                    <p className="text-xs sm:text-sm mt-2 break-words">{order.items.join(", ")}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-sm sm:text-base">Rs. {order.total.toLocaleString("en-IN")}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 pt-2 border-t text-xs">
                  <div className="min-w-0">
                    <span className="text-muted-foreground">Payment: </span>
                    <span className="font-semibold">{getPaymentMethodLabel(order.paymentMethod)}</span>
                  </div>
                  <div className="min-w-0">
                    <span className="text-muted-foreground">Status: </span>
                    <span className={`font-semibold ${order.paymentStatus === "paid" ? "text-green-600" : "text-orange-600"}`}>
                      {order.paymentStatus === "paid" ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Orders</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Live order feed from billing and kitchen</p>
        </div>

        {error && <div className="text-xs sm:text-sm text-red-600">{error}</div>}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
          <StatCard title="Pending" value={String(stats.pending)} icon={<ShoppingCart className="h-4 sm:h-5 w-4 sm:w-5" />} />
          <StatCard title="Preparing" value={String(stats.preparing)} icon={<Clock className="h-4 sm:h-5 w-4 sm:w-5" />} />
          <StatCard title="Ready" value={String(stats.ready)} icon={<CheckCircle className="h-4 sm:h-5 w-4 sm:w-5" />} />
          <StatCard title="Served" value={String(stats.served)} icon={<Truck className="h-4 sm:h-5 w-4 sm:w-5" />} />
          <StatCard title="Completed" value={String(stats.completed)} icon={<CheckCircle className="h-4 sm:h-5 w-4 sm:w-5" />} />
        </div>

        <Tabs defaultValue="all">
          <TabsList className="w-full grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-0">
            <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
            <TabsTrigger value="pending" className="text-xs sm:text-sm">Pending</TabsTrigger>
            <TabsTrigger value="preparing" className="text-xs sm:text-sm">Prep</TabsTrigger>
            <TabsTrigger value="ready" className="text-xs sm:text-sm hidden sm:inline-flex">Ready</TabsTrigger>
            <TabsTrigger value="served" className="text-xs sm:text-sm hidden sm:inline-flex">Served</TabsTrigger>
            <TabsTrigger value="completed" className="text-xs sm:text-sm">Done</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">{renderOrders("all")}</TabsContent>
          <TabsContent value="pending" className="mt-4">{renderOrders("pending")}</TabsContent>
          <TabsContent value="preparing" className="mt-4">{renderOrders("preparing")}</TabsContent>
          <TabsContent value="ready" className="mt-4">{renderOrders("ready")}</TabsContent>
          <TabsContent value="served" className="mt-4">{renderOrders("served")}</TabsContent>
          <TabsContent value="completed" className="mt-4">{renderOrders("completed")}</TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

