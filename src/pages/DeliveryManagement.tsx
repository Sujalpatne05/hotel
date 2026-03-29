import { useEffect, useMemo, useState } from "react";
import { FaMotorcycle, FaUser, FaRupeeSign, FaCheckCircle, FaClock, FaShippingFast, FaTrash, FaEdit } from "react-icons/fa";
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

const API_BASE_URL = (() => {
  const configured = (import.meta.env.VITE_API_URL || "").trim();
  if (typeof window !== "undefined" && window.location.protocol === "https:" && configured.startsWith("http://")) {
    return "/api";
  }
  return configured || (typeof window !== "undefined" && window.location.hostname !== "localhost" ? "/api" : "http://localhost:5000");
})();

type Delivery = {
  id: number;
  order_number: string;
  customer_name: string;
  phone: string;
  address: string;
  partner: "in-house" | "swiggy" | "zomato";
  amount: number;
  driver: string;
  status: "pending" | "dispatched" | "delivered";
  createdAt?: string;
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
    order_number: "",
    customer_name: "",
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

  const handleSaveApiKeys = async () => {
    try {
      if (!apiKeys.swiggy && !apiKeys.zomato) {
        toast.error("Please enter at least one API key");
        return;
      }
      setApiKeySaving(true);
      const headers = buildAuthHeaders();
      if (!headers) {
        goToLogin();
        return;
      }
      const res = await fetch(`${API_BASE_URL}/delivery-api-keys`, {
        method: "PUT",
        headers,
        body: JSON.stringify(apiKeys),
      });
      if (isAuthError(res.status)) {
        goToLogin();
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to update API keys");
      }
      toast.success("API keys updated successfully");
    } catch (err: any) {
      const errorMsg = err?.message || "Error updating API keys";
      toast.error(errorMsg);
    } finally {
      setApiKeySaving(false);
    }
  };

  const handleSaveDelivery = async () => {
    try {
      // Validation
      if (!newDelivery.order_number || !newDelivery.order_number.trim()) {
        toast.error("Order number is required");
        return;
      }
      if (!newDelivery.customer_name || !newDelivery.customer_name.trim()) {
        toast.error("Customer name is required");
        return;
      }
      if (!newDelivery.address || !newDelivery.address.trim()) {
        toast.error("Address is required");
        return;
      }
      if (!newDelivery.phone || !newDelivery.phone.trim()) {
        toast.error("Phone number is required");
        return;
      }
      if (!/^\d{10}$/.test(newDelivery.phone.replace(/\D/g, ""))) {
        toast.error("Phone must be 10 digits");
        return;
      }
      if (!newDelivery.driver || !newDelivery.driver.trim()) {
        toast.error("Driver assignment is required");
        return;
      }
      const amount = Number(newDelivery.amount);
      if (isNaN(amount) || amount <= 0) {
        toast.error("Delivery amount must be greater than 0");
        return;
      }
      if (amount > 10000) {
        toast.error("Delivery amount seems unrealistic (max: 10,000)");
        return;
      }

      setSaving(true);
      const headers = buildAuthHeaders();
      if (!headers) {
        goToLogin();
        return;
      }

      const payload = {
        order_number: newDelivery.order_number,
        customer_name: newDelivery.customer_name,
        phone: newDelivery.phone,
        address: newDelivery.address,
        partner: newDelivery.partner,
        amount: Number(newDelivery.amount) || 0,
        driver: newDelivery.driver,
        status: newDelivery.status,
      };

      const isEdit = editingId && editingId !== 0;
      const url = isEdit ? `${API_BASE_URL}/deliveries/${editingId}` : `${API_BASE_URL}/deliveries`;
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      if (isAuthError(res.status)) {
        goToLogin();
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to save delivery");
      }

      const savedDelivery = await res.json();
      if (isEdit) {
        setDeliveries(deliveries.map(d => d.id === savedDelivery.id ? savedDelivery : d));
        toast.success("Delivery updated successfully");
      } else {
        setDeliveries([savedDelivery, ...deliveries]);
        toast.success("Delivery created successfully");
      }
      setEditingId(null);
      setNewDelivery({
        id: 0,
        order_number: "",
        customer_name: "",
        phone: "",
        address: "",
        partner: "in-house",
        amount: "",
        driver: "",
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    } catch (err: any) {
      const errorMsg = err?.message || "Error saving delivery";
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDelivery = async (id: number) => {
    if (!confirm("Are you sure you want to delete this delivery?")) return;

    try {
      const headers = buildAuthHeaders();
      if (!headers) {
        goToLogin();
        return;
      }

      const res = await fetch(`${API_BASE_URL}/deliveries/${id}`, {
        method: "DELETE",
        headers,
      });

      if (isAuthError(res.status)) {
        goToLogin();
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to delete delivery");
      }

      setDeliveries(deliveries.filter(d => d.id !== id));
      toast.success("Delivery deleted successfully");
    } catch (err: any) {
      const errorMsg = err?.message || "Error deleting delivery";
      toast.error(errorMsg);
    }
  };

  // Load API keys from backend
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const headers = buildAuthHeaders();
        if (!headers) return;
        const res = await fetch(`${API_BASE_URL}/delivery-api-keys`, { headers });
        if (!res.ok) {
          throw new Error("Failed to load API keys");
        }
        const data = await res.json();
        setApiKeys(data);
      } catch (err: any) {
        // API keys are optional, don't show error
      } finally {
        setApiKeySaving(false);
      }
    };
    fetchApiKeys();
  }, []);

  // Load deliveries from backend
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const headers = buildAuthHeaders();
        if (!headers) {
          goToLogin("Please login to continue.");
          return;
        }
        const res = await fetch(`${API_BASE_URL}/deliveries`, { headers });
        if (isAuthError(res.status)) {
          goToLogin("Session expired. Please login again.");
          return;
        }
        if (!res.ok) {
          throw new Error("Failed to load deliveries");
        }
        const data = await res.json();
        setDeliveries(Array.isArray(data) ? data : []);
      } catch (err: any) {
        const errorMsg = err?.message || "Failed to load deliveries";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    };
    fetchDeliveries();
  }, []);
  return (
    <DashboardLayout>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6">
        <Card className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-blue-50">
          <FaShippingFast className="text-xl sm:text-2xl text-blue-600 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-base sm:text-lg font-bold">{summary.total}</div>
            <div className="text-xs text-gray-500">Total Deliveries</div>
          </div>
        </Card>
        <Card className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-green-50">
          <FaCheckCircle className="text-xl sm:text-2xl text-green-600 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-base sm:text-lg font-bold">{summary.delivered}</div>
            <div className="text-xs text-gray-500">Delivered</div>
          </div>
        </Card>
        <Card className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-yellow-50">
          <FaClock className="text-xl sm:text-2xl text-yellow-600 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-base sm:text-lg font-bold">{summary.pending}</div>
            <div className="text-xs text-gray-500">Pending</div>
          </div>
        </Card>
        <Card className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-purple-50">
          <FaRupeeSign className="text-xl sm:text-2xl text-purple-600 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-base sm:text-lg font-bold">₹{summary.totalAmount}</div>
            <div className="text-xs text-gray-500">Total Revenue</div>
          </div>
        </Card>
      </div>

      {/* API Key Management */}
      <Card className="mb-6 max-w-full sm:max-w-xl">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">API Keys</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form className="space-y-3 sm:space-y-4">
            <div>
              <Label className="text-sm">Swiggy API Key</Label>
              <Input 
                value={apiKeys.swiggy} 
                onChange={e => setApiKeys({...apiKeys, swiggy: e.target.value})}
                placeholder="Enter Swiggy API key"
                className="text-sm mt-1"
              />
            </div>
            <div>
              <Label className="text-sm">Zomato API Key</Label>
              <Input 
                value={apiKeys.zomato} 
                onChange={e => setApiKeys({...apiKeys, zomato: e.target.value})}
                placeholder="Enter Zomato API key"
                className="text-sm mt-1"
              />
            </div>
            <Button type="button" onClick={handleSaveApiKeys} disabled={apiKeySaving} className="w-full sm:w-auto text-sm">
              {apiKeySaving ? "Saving..." : "Update Keys"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Delivery List */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">Deliveries</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Search by customer or order..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="text-sm flex-1"
            />
            <Button onClick={() => setEditingId(0)} className="text-sm w-full sm:w-auto">
              <FaMotorcycle className="mr-2 flex-shrink-0" /> Add Delivery
            </Button>
          </div>
          <div className="overflow-x-auto rounded-lg border shadow-sm -mx-4 sm:mx-0">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 sm:p-3 border text-left whitespace-nowrap">Order #</th>
                  <th className="p-2 sm:p-3 border text-left whitespace-nowrap hidden sm:table-cell">Customer</th>
                  <th className="p-2 sm:p-3 border text-left whitespace-nowrap hidden md:table-cell">Phone</th>
                  <th className="p-2 sm:p-3 border text-left whitespace-nowrap">Partner</th>
                  <th className="p-2 sm:p-3 border text-left whitespace-nowrap">Amount</th>
                  <th className="p-2 sm:p-3 border text-left whitespace-nowrap hidden lg:table-cell">Driver</th>
                  <th className="p-2 sm:p-3 border text-left whitespace-nowrap">Status</th>
                  <th className="p-2 sm:p-3 border text-left whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.filter(d =>
                  d.customer_name.toLowerCase().includes(search.toLowerCase()) ||
                  d.order_number.toLowerCase().includes(search.toLowerCase())
                ).map(delivery => (
                  <tr key={delivery.id} className="hover:bg-blue-50 transition border-b">
                    <td className="p-2 sm:p-3 border font-semibold whitespace-nowrap text-xs sm:text-sm">{delivery.order_number}</td>
                    <td className="p-2 sm:p-3 border hidden sm:table-cell">
                      <div className="flex items-center gap-1">
                        <FaUser className="text-gray-400 flex-shrink-0 text-xs" />
                        <span className="truncate text-xs sm:text-sm">{delivery.customer_name}</span>
                      </div>
                    </td>
                    <td className="p-2 sm:p-3 border whitespace-nowrap hidden md:table-cell text-xs sm:text-sm">{delivery.phone}</td>
                    <td className="p-2 sm:p-3 border">
                      <Badge variant={delivery.partner === "swiggy" ? "secondary" : delivery.partner === "zomato" ? "destructive" : "default"} className="text-xs">
                        {delivery.partner.charAt(0).toUpperCase() + delivery.partner.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-2 sm:p-3 border font-semibold text-purple-700 flex items-center gap-1 whitespace-nowrap text-xs sm:text-sm">
                      <FaRupeeSign className="flex-shrink-0 text-xs" />{delivery.amount}
                    </td>
                    <td className="p-2 sm:p-3 border whitespace-nowrap hidden lg:table-cell text-xs sm:text-sm">{delivery.driver}</td>
                    <td className="p-2 sm:p-3 border">
                      <Badge variant={delivery.status === "delivered" ? "success" : delivery.status === "dispatched" ? "secondary" : "default"} className="text-xs">
                        {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="p-2 sm:p-3 border">
                      <div className="flex gap-1 flex-wrap">
                        <Button size="sm" variant="outline" onClick={() => {
                          setNewDelivery({
                            id: delivery.id,
                            order_number: delivery.order_number,
                            customer_name: delivery.customer_name,
                            phone: delivery.phone,
                            address: delivery.address,
                            partner: delivery.partner,
                            amount: String(delivery.amount),
                            driver: delivery.driver,
                            status: delivery.status,
                            createdAt: delivery.createdAt || new Date().toISOString(),
                          });
                          setEditingId(delivery.id);
                        }} className="text-xs px-2 py-1">
                          <FaEdit className="mr-1 flex-shrink-0" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteDelivery(delivery.id)} className="text-xs px-2 py-1">
                          <FaTrash className="mr-1 flex-shrink-0" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Delivery Modal */}
      {editingId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-8 w-full max-w-lg relative border max-h-[90vh] overflow-y-auto">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setEditingId(null)} aria-label="Close">&times;</button>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center gap-2">
              <FaMotorcycle className="text-blue-500 flex-shrink-0" /> {editingId === 0 ? "Add Delivery" : "Edit Delivery"}
            </h2>
            <form className="flex flex-col gap-3 sm:gap-4" onSubmit={(e) => { e.preventDefault(); handleSaveDelivery(); }}>
              <Input placeholder="Order Number" value={newDelivery.order_number} onChange={e => setNewDelivery(d => ({ ...d, order_number: e.target.value }))} required className="text-sm" />
              <Input placeholder="Customer Name" value={newDelivery.customer_name} onChange={e => setNewDelivery(d => ({ ...d, customer_name: e.target.value }))} required className="text-sm" />
              <Input placeholder="Phone" value={newDelivery.phone} onChange={e => setNewDelivery(d => ({ ...d, phone: e.target.value }))} className="text-sm" />
              <Input placeholder="Address" value={newDelivery.address} onChange={e => setNewDelivery(d => ({ ...d, address: e.target.value }))} required className="text-sm" />
              <Select value={newDelivery.partner} onValueChange={val => setNewDelivery(d => ({ ...d, partner: val as Delivery["partner"] }))}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Partner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-house">In-House</SelectItem>
                  <SelectItem value="swiggy">Swiggy</SelectItem>
                  <SelectItem value="zomato">Zomato</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Amount" type="number" value={newDelivery.amount} onChange={e => setNewDelivery(d => ({ ...d, amount: e.target.value }))} className="text-sm" />
              <Input placeholder="Driver" value={newDelivery.driver} onChange={e => setNewDelivery(d => ({ ...d, driver: e.target.value }))} className="text-sm" />
              <Select value={newDelivery.status} onValueChange={val => setNewDelivery(d => ({ ...d, status: val as Delivery["status"] }))}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="dispatched">Dispatched</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2 sm:gap-3 mt-4">
                <Button type="button" onClick={() => setEditingId(null)} variant="secondary" className="flex-1 text-sm">Cancel</Button>
                <Button type="submit" disabled={saving} className="flex-1 text-sm">{saving ? "Saving..." : "Save"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

