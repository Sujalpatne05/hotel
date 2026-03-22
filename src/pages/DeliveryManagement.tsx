import { useEffect, useMemo, useState } from "react";
import { FaMotorcycle, FaUser, FaRupeeSign, FaCheckCircle, FaClock, FaShippingFast } from "react-icons/fa";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

import { useNavigate } from "react-router-dom";
import { buildAuthHeaders, clearAuthSession, isAuthError } from "@/lib/session";

type Delivery = {
  id: number;
  orderNumber: string;
  customerName: string;
  phone: string;
  address: string;
  partner: "in-house" | "swiggy" | "zomato";
  amount: number;
  driver: string;
  status: "pending" | "dispatched" | "delivered";
  createdAt: string;
};

type ApiKeys = {
  swiggy: string;
  zomato: string;
};


export default function DeliveryManagement() {
  // API key state
  const [apiKeys, setApiKeys] = useState<ApiKeys>({ swiggy: "", zomato: "" });
  const [apiKeySaving, setApiKeySaving] = useState(false);

  // Delivery state
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [newDelivery, setNewDelivery] = useState({
    id: 0,
    orderNumber: "",
    customerName: "",
    phone: "",
    address: "",
    partner: "in-house" as Delivery["partner"],
    amount: "",
    driver: "",
    status: "pending" as Delivery["status"],
    createdAt: new Date().toISOString(),
  });
  const [editingId, setEditingId] = useState<number|null>(null);

  // Delivery summary
  const summary = useMemo(() => {
    const total = deliveries.length;
    const delivered = deliveries.filter(d => d.status === "delivered").length;
    const pending = deliveries.filter(d => d.status === "pending").length;
    const dispatched = deliveries.filter(d => d.status === "dispatched").length;
    const totalAmount = deliveries.reduce((sum, d) => sum + (typeof d.amount === "number" ? d.amount : 0), 0);
    return { total, delivered, pending, dispatched, totalAmount };
  }, [deliveries]);

  const goToLogin = (message = "Session expired. Please login again.") => {
    setError(message);
    clearAuthSession();
    setTimeout(() => navigate("/admin-login"), 300);
  };

  // Load API keys from backend
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        setApiKeySaving(true);
        const headers = buildAuthHeaders();
        if (!headers) return;
        const res = await fetch(`${API_BASE_URL}/delivery-api-keys`, { headers });
        if (!res.ok) throw new Error("Failed to fetch API keys");
        const data = await res.json();
        // (API key fetch logic here if needed)
      } catch (err) {
        // Handle error if needed
      } finally {
        setApiKeySaving(false);
      }
    };
    fetchApiKeys();
  }, []);

  // Load deliveries from backend (placeholder, replace with real API)
  useEffect(() => {
    // TODO: Replace with real API call
    setDeliveries([
      {
        id: 1,
        orderNumber: "ORD-001",
        customerName: "John Doe",
        phone: "1234567890",
        address: "123 Main St",
        partner: "swiggy",
        amount: 299,
        driver: "Amit",
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        orderNumber: "ORD-002",
        customerName: "Jane Smith",
        phone: "9876543210",
        address: "456 Park Ave",
        partner: "zomato",
        amount: 499,
        driver: "Sunil",
        status: "delivered",
        createdAt: new Date().toISOString(),
      },
    ]);
  }, []);
  return (
    <DashboardLayout>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="flex flex-row items-center gap-4 p-4 bg-blue-50">
          <FaShippingFast className="text-2xl text-blue-600" />
          <div>
            <div className="text-lg font-bold">{summary.total}</div>
            <div className="text-xs text-gray-500">Total Deliveries</div>
          </div>
        </Card>
        <Card className="flex flex-row items-center gap-4 p-4 bg-green-50">
          <FaCheckCircle className="text-2xl text-green-600" />
          <div>
            <div className="text-lg font-bold">{summary.delivered}</div>
            <div className="text-xs text-gray-500">Delivered</div>
          </div>
        </Card>
        <Card className="flex flex-row items-center gap-4 p-4 bg-yellow-50">
          <FaClock className="text-2xl text-yellow-600" />
          <div>
            <div className="text-lg font-bold">{summary.pending}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
        </Card>
        <Card className="flex flex-row items-center gap-4 p-4 bg-purple-50">
          <FaRupeeSign className="text-2xl text-purple-600" />
          <div>
            <div className="text-lg font-bold">₹{summary.totalAmount}</div>
            <div className="text-xs text-gray-500">Total Revenue</div>
          </div>
        </Card>
      </div>
      {/* API Key Management */}
        {/* API Key Management */}
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <Label>Swiggy API Key</Label>
                <Input value={apiKeys.swiggy} readOnly placeholder="Not set" />
              </div>
              <div>
                <Label>Zomato API Key</Label>
                <Input value={apiKeys.zomato} readOnly placeholder="Not set" />
              </div>
              <Button type="button" disabled>Update Keys (Coming Soon)</Button>
            </form>
          </CardContent>
        </Card>

        {/* Delivery List */}
        <Card>
          <CardHeader>
            <CardTitle>Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              <Input
                placeholder="Search by customer or order number..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="max-w-xs"
              />
              <Button onClick={() => setEditingId(0)}>
                <FaMotorcycle className="mr-2" /> Add Delivery
              </Button>
            </div>
            <div className="overflow-x-auto rounded-lg border shadow-sm">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border">Order #</th>
                    <th className="p-2 border">Customer</th>
                    <th className="p-2 border">Phone</th>
                    <th className="p-2 border">Partner</th>
                    <th className="p-2 border">Amount</th>
                    <th className="p-2 border">Driver</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.filter(d =>
                    d.customerName.toLowerCase().includes(search.toLowerCase()) ||
                    d.orderNumber.toLowerCase().includes(search.toLowerCase())
                  ).map(delivery => (
                    <tr key={delivery.id} className="hover:bg-blue-50 transition">
                      <td className="p-2 border font-semibold">{delivery.orderNumber}</td>
                      <td className="p-2 border flex items-center gap-2"><FaUser className="text-gray-400" />{delivery.customerName}</td>
                      <td className="p-2 border">{delivery.phone}</td>
                      <td className="p-2 border">
                        <Badge variant={delivery.partner === "swiggy" ? "secondary" : delivery.partner === "zomato" ? "destructive" : "default"}>
                          {delivery.partner.charAt(0).toUpperCase() + delivery.partner.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-2 border font-semibold text-purple-700 flex items-center gap-1"><FaRupeeSign />{delivery.amount}</td>
                      <td className="p-2 border">{delivery.driver}</td>
                      <td className="p-2 border">
                        <Badge variant={delivery.status === "delivered" ? "success" : delivery.status === "dispatched" ? "secondary" : "default"}>
                          {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-2 border">
                        <Button size="sm" variant="outline" onClick={() => setEditingId(delivery.id)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Delivery Modal (simple inline form for now) */}
        {editingId !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative border">
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setEditingId(null)} aria-label="Close">&times;</button>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaMotorcycle className="text-blue-500" /> {editingId === 0 ? "Add Delivery" : "Edit Delivery"}
              </h2>
              <form className="flex flex-col gap-4">
                <Input placeholder="Order Number" value={newDelivery.orderNumber} onChange={e => setNewDelivery(d => ({ ...d, orderNumber: e.target.value }))} />
                <Input placeholder="Customer Name" value={newDelivery.customerName} onChange={e => setNewDelivery(d => ({ ...d, customerName: e.target.value }))} />
                <Input placeholder="Phone" value={newDelivery.phone} onChange={e => setNewDelivery(d => ({ ...d, phone: e.target.value }))} />
                <Input placeholder="Address" value={newDelivery.address} onChange={e => setNewDelivery(d => ({ ...d, address: e.target.value }))} />
                <Select value={newDelivery.partner} onValueChange={val => setNewDelivery(d => ({ ...d, partner: val as Delivery["partner"] }))}>
                  <SelectTrigger><SelectValue placeholder="Partner" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-house">In-House</SelectItem>
                    <SelectItem value="swiggy">Swiggy</SelectItem>
                    <SelectItem value="zomato">Zomato</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Amount" type="number" value={newDelivery.amount} onChange={e => setNewDelivery(d => ({ ...d, amount: e.target.value }))} />
                <Input placeholder="Driver" value={newDelivery.driver} onChange={e => setNewDelivery(d => ({ ...d, driver: e.target.value }))} />
                <div className="flex gap-3 mt-4">
                  <Button type="button" onClick={() => setEditingId(null)} variant="secondary">Cancel</Button>
                  <Button type="submit" disabled>Save (Demo Only)</Button>
                </div>
              </form>
            </div>
          </div>
        )}
    </DashboardLayout>
  );
}

