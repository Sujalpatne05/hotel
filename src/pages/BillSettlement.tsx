import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import { CreditCard, DollarSign, Check } from "lucide-react";

type Order = {
  id: number;
  table_number: number;
  items: string[];
  total: number;
  status: string;
  orderType: string;
  paymentStatus: string;
  paymentMethod: string | null;
};

type Table = {
  id: number;
  number: number;
  capacity: number;
  status: string;
  section?: string;
};

const PAYMENT_METHODS = ["upi", "card", "cash"] as const;

const BillSettlement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<typeof PAYMENT_METHODS[number]>("cash");
  const [processingOrderId, setProcessingOrderId] = useState<number | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  // Fetch orders and tables
  useEffect(() => {
    fetchOrders();
    fetchTables();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(() => {
      fetchOrders();
      fetchTables();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await apiRequest<Order[]>("/orders", { method: "GET" }, true);
      // Filter for dine-in orders that are not paid yet
      const dineInOrders = data.filter(
        (o) => o.orderType === "dine-in" && o.paymentStatus === "unpaid"
      );
      setOrders(dineInOrders);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchTables = async () => {
    try {
      const data = await apiRequest<any[]>("/tables", { method: "GET" }, true);
      setTables(
        data.map((t) => ({
          id: t.id,
          number: t.number ?? t.table_number,
          capacity: t.capacity,
          status: t.status,
          section: t.section || "",
        }))
      );
    } catch (err) {
      toast.error("Failed to load tables");
    }
  };

  const handlePayment = async (orderId: number, tableNumber: number) => {
    setProcessingOrderId(orderId);
    try {
      // Update order payment status
      await apiRequest(`/orders/${orderId}`, {
        method: "PUT",
        body: JSON.stringify({
          paymentStatus: "paid",
          paymentMethod: selectedPaymentMethod,
          status: "completed",
        }),
      });

      // Update table status to available
      const table = tables.find((t) => t.number === tableNumber);
      if (table) {
        await apiRequest(`/tables/${table.id}`, {
          method: "PUT",
          body: JSON.stringify({
            status: "available",
            current_order: null,
          }),
        });
      }

      toast.success(`Payment collected for Table ${tableNumber}`);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      fetchTables();
    } catch (err: any) {
      toast.error(err.message || "Failed to process payment");
    } finally {
      setProcessingOrderId(null);
    }
  };

  const getTableInfo = (tableNumber: number) => {
    return tables.find((t) => t.number === tableNumber);
  };

  return (
    <DashboardLayout>
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-orange-50 via-white to-orange-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-orange-700 flex items-center gap-2 mb-2">
              <CreditCard className="text-orange-500" /> Bill Settlement
            </h1>
            <p className="text-muted-foreground">Collect payments from completed dine-in orders</p>
          </div>

          {/* Orders List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingOrders ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No pending payments. All tables are settled!
              </div>
            ) : (
              orders.map((order) => {
                const tableInfo = getTableInfo(order.table_number);
                const isExpanded = expandedOrderId === order.id;
                return (
                  <Card 
                    key={order.id} 
                    className="bg-white/90 shadow-lg border-orange-100 hover:shadow-xl transition-all cursor-pointer"
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl text-orange-700">
                            Table {order.table_number}
                          </CardTitle>
                          {tableInfo && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {tableInfo.section} • {tableInfo.capacity} seats
                            </p>
                          )}
                        </div>
                        <Badge className="bg-green-500">Ready</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Order Items */}
                      <div className="mb-4 pb-4 border-b">
                        <p className="font-semibold text-sm mb-2">Items:</p>
                        <ul className="text-sm space-y-1">
                          {order.items.map((item, idx) => (
                            <li key={idx} className="text-muted-foreground">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Total */}
                      <div className="mb-4 pb-4 border-b">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total Amount:</span>
                          <span className="text-2xl font-bold text-orange-600">
                            ₹{order.total}
                          </span>
                        </div>
                      </div>

                      {/* Payment Method Selection - Shows when expanded */}
                      {isExpanded && (
                        <div className="mb-4 pb-4 border-t pt-4">
                          <p className="font-semibold text-sm mb-3">Select Payment Method:</p>
                          <div className="flex gap-2 mb-4">
                            {PAYMENT_METHODS.map((method) => (
                              <Button
                                key={method}
                                size="sm"
                                variant={selectedPaymentMethod === method ? "default" : "outline"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPaymentMethod(method);
                                }}
                                className="capitalize flex-1"
                              >
                                {method.toUpperCase()}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Payment Button */}
                      <Button
                        className="w-full bg-green-500 hover:bg-green-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePayment(order.id, order.table_number);
                        }}
                        disabled={processingOrderId === order.id}
                      >
                        {processingOrderId === order.id ? (
                          "Processing..."
                        ) : (
                          <>
                            <Check size={16} className="mr-2" /> Collect Payment
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BillSettlement;
