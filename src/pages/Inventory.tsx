import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, AlertTriangle, Package } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { buildAuthHeaders, clearAuthSession, isAuthError } from "@/lib/session";

const API_BASE_URL = (() => {
  const configured = (import.meta.env.VITE_API_URL || "").trim();
  if (typeof window !== "undefined" && window.location.protocol === "https:" && configured.startsWith("http://")) {
    return "/api";
  }
  return configured || (typeof window !== "undefined" && window.location.hostname !== "localhost" ? "/api" : "http://localhost:5000");
})();

type InventoryItem = {
  id: number;
  name: string;
  unit: string;
  stock: number;
  min_stock: number;
  max_stock: number;
  category: string;
  updated_at: string;
};

const formatUpdatedLabel = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString();
};

const Inventory = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [restockModal, setRestockModal] = useState<{ open: boolean; itemId: number | null }>({ open: false, itemId: null });
  const [restockQty, setRestockQty] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({
    name: "",
    unit: "",
    stock: 0,
    minStock: 0,
    maxStock: 0,
    category: "",
  });

  const loadItems = useCallback(async () => {
    const headers = buildAuthHeaders();
    if (!headers) {
      clearAuthSession();
      window.location.href = "/admin-login";
      return;
    }

    const response = await fetch(`${API_BASE_URL}/inventory`, { headers });
    if (isAuthError(response.status)) {
      clearAuthSession();
      window.location.href = "/admin-login";
      return;
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data?.error || "Failed to load inventory");
    }

    setItems(Array.isArray(data) ? data : []);
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadItems();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    void bootstrap();
  }, [loadItems]);

  const handleModalClose = () => {
    setShowModal(false);
    setNewItem({ name: "", unit: "", stock: 0, minStock: 0, maxStock: 0, category: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "stock" || name === "minStock" || name === "maxStock" ? Number(value) : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const headers = buildAuthHeaders();
    if (!headers) return;

    const response = await fetch(`${API_BASE_URL}/inventory`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: newItem.name.trim(),
        unit: newItem.unit.trim(),
        stock: Number(newItem.stock),
        minStock: Number(newItem.minStock),
        maxStock: Number(newItem.maxStock),
        category: newItem.category.trim(),
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data?.error || "Unable to add inventory item");
      return;
    }

    await loadItems();
    handleModalClose();
  };

  const handleRestockOpen = (item: InventoryItem) => {
    setRestockModal({ open: true, itemId: item.id });
    setRestockQty(item.stock);
  };

  const handleRestockClose = () => {
    setRestockModal({ open: false, itemId: null });
    setRestockQty(0);
  };

  const handleRestockSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!restockModal.itemId) return;
    const headers = buildAuthHeaders();
    if (!headers) return;

    const response = await fetch(`${API_BASE_URL}/inventory/${restockModal.itemId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ stock: Number(restockQty) }),
    });

    if (!response.ok) {
      const data = await response.json();
      alert(data?.error || "Unable to update stock");
      return;
    }

    await loadItems();
    handleRestockClose();
  };

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const query = search.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query));
  }, [items, search]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Inventory</h1>
            <p className="text-muted-foreground">Track stock levels and supplies</p>
          </div>
          <Button className="gradient-warm text-primary-foreground gap-2" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" /> Add Stock
          </Button>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[350px] relative">
              <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={handleModalClose} aria-label="Close">x</button>
              <h2 className="text-lg font-bold mb-4">Add Stock Item</h2>
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <input name="name" value={newItem.name} onChange={handleInputChange} placeholder="Item Name" className="w-full border rounded px-2 py-1" required />
                <input name="unit" value={newItem.unit} onChange={handleInputChange} placeholder="Unit (kg/L)" className="w-full border rounded px-2 py-1" required />
                <input name="stock" type="number" value={newItem.stock} onChange={handleInputChange} placeholder="Stock" className="w-full border rounded px-2 py-1" required />
                <input name="minStock" type="number" value={newItem.minStock} onChange={handleInputChange} placeholder="Min Stock" className="w-full border rounded px-2 py-1" required />
                <input name="maxStock" type="number" value={newItem.maxStock} onChange={handleInputChange} placeholder="Max Stock" className="w-full border rounded px-2 py-1" required />
                <input name="category" value={newItem.category} onChange={handleInputChange} placeholder="Category" className="w-full border rounded px-2 py-1" required />
                <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded">Add</button>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Items" value={`${filteredItems.length}`} icon={<Package className="h-5 w-5" />} />
          <StatCard
            title="Low Stock Items"
            value={`${filteredItems.filter((item) => item.stock <= item.min_stock).length}`}
            change="Needs attention"
            changeType="negative"
            icon={<AlertTriangle className="h-5 w-5" />}
          />
          <StatCard title="Categories" value={String([...new Set(filteredItems.map((item) => item.category))].length)} icon={<Package className="h-5 w-5" />} />
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search inventory..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        <div className="grid gap-3">
          {!loading && filteredItems.length === 0 && (
            <Card className="shadow-card">
              <CardContent className="p-4 text-sm text-muted-foreground">No inventory items found for this restaurant.</CardContent>
            </Card>
          )}
          {filteredItems.map((item) => {
            const denominator = item.max_stock > 0 ? item.max_stock : Math.max(item.stock, 1);
            const percentage = Math.min((item.stock / denominator) * 100, 100);
            const isLow = item.stock <= item.min_stock;
            return (
              <Card key={item.id} className="shadow-card animate-fade-in">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{item.name}</h3>
                        {isLow && (
                          <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 text-[10px]">
                            Low Stock
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{item.category} - Updated {formatUpdatedLabel(item.updated_at)}</p>
                    </div>
                    <div className="flex items-center gap-6 sm:w-1/2">
                      <div className="flex-1">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Stock Level</span>
                          <span className="font-medium">
                            {item.stock} / {item.max_stock} {item.unit}
                          </span>
                        </div>
                        <Progress
                          value={percentage}
                          className={`h-2 ${isLow ? "[&>div]:bg-destructive" : "[&>div]:gradient-warm"}`}
                        />
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleRestockOpen(item)}>
                        Restock
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {restockModal.open && restockModal.itemId !== null && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white rounded-lg shadow-lg p-6 w-[350px] relative">
                <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={handleRestockClose} aria-label="Close">x</button>
                <h2 className="text-lg font-bold mb-4">Restock Item</h2>
                <form onSubmit={handleRestockSubmit} className="space-y-3">
                  <input type="number" min="0" value={restockQty} onChange={(e) => setRestockQty(Number(e.target.value))} className="w-full border rounded px-2 py-1" required />
                  <button type="submit" className="w-full bg-orange-500 text-white py-2 rounded">Update Stock</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Inventory;
