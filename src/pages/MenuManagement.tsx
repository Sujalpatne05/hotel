import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Edit, Trash2, Star } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

const categories = ["All", "Starters", "Main Course", "Breads", "Rice", "Desserts", "Beverages"];
const API_BASE_URL = (() => {
  const configured = (import.meta.env.VITE_API_URL || "").trim();
  if (typeof window !== "undefined" && window.location.protocol === "https:" && configured.startsWith("http://")) {
    return "/api";
  }
  return configured || (typeof window !== "undefined" && window.location.hostname !== "localhost" ? "/api" : "http://localhost:5000");
})();

type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  available: boolean;
  popular: boolean;
  image_url: string;
};

type MenuItemForm = {
  name: string;
  category: string;
  price: string;
  available: boolean;
  image_url: string;
};

const MenuManagement = () => {
  const navigate = useNavigate();
  // Add missing state for image upload and preview
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState<MenuItemForm>({ name: "", category: "", price: "", available: true, image_url: "" });
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [error, setError] = useState("");

  const goToLogin = (message = "Session expired. Please login again.") => {
    setError(message);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isSuperAdmin");
    setTimeout(() => navigate("/admin-login"), 300);
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const toUiItem = (item: { id: number; name: string; price: number; available: boolean; image_url?: string }, fallback?: Partial<MenuItem>): MenuItem => ({
    id: item.id,
    name: item.name,
    category: fallback?.category || "Beverages",
    price: Number(item.price),
    available: item.available,
    popular: fallback?.popular ?? false,
    image_url: item.image_url || fallback?.image_url || "",
  });

  const loadMenuItems = async () => {
    try {
      setError("");
      const headers = getAuthHeaders();
      if (!headers) {
        goToLogin("Please login to manage menu items.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/menu`, {
        method: "GET",
        headers,
      });
      const data = await response.json();
      if (response.status === 401 || response.status === 403) {
        goToLogin(data?.error || "Session expired. Please login again.");
        return;
      }
      if (!response.ok) {
        setError(data?.error || "Unable to load menu items.");
        return;
      }
      setMenuItems((data || []).map((item: { id: number; name: string; price: number; available: boolean }) => toUiItem(item)));
    } catch {
      setError("Unable to connect to backend.");
    }
  };

  useEffect(() => {
    loadMenuItems();
  }, []);

  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditItemId(item.id);
      setNewItem({
        name: item.name,
        category: item.category,
        price: String(item.price),
        available: item.available,
        image_url: item.image_url || "",
      });
      setImagePreview(item.image_url || "");
    } else {
      setEditItemId(null);
      setNewItem({ name: "", category: "", price: "", available: true, image_url: "" });
      setImagePreview("");
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : false;
    setNewItem((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let imageUrl = newItem.image_url || "";
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }
    const payload = {
      name: newItem.name.trim(),
      price: Number(newItem.price),
      available: newItem.available,
      image_url: imageUrl,
    };

    try {
      setError("");
      const headers = getAuthHeaders();
      if (!headers) {
        goToLogin("Please login to manage menu items.");
        return;
      }
      const isEdit = editItemId !== null;
      const response = await fetch(
        isEdit ? `${API_BASE_URL}/menu/${editItemId}` : `${API_BASE_URL}/menu`,
        {
          method: isEdit ? "PUT" : "POST",
          headers,
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();
      if (response.status === 401 || response.status === 403) {
        goToLogin(data?.error || "Session expired. Please login again.");
        return;
      }
      if (!response.ok) {
        setError(data?.error || "Unable to save menu item.");
        return;
      }

      const fallbackValues = {
        category: newItem.category || "Beverages",
        popular: false,
      };
      const savedItem = toUiItem(data, fallbackValues);
      if (isEdit) {
        setMenuItems((prev) => prev.map((item) => (item.id === savedItem.id ? { ...item, ...savedItem } : item)));
      } else {
        setMenuItems((prev) => [...prev, savedItem]);
      }
      setNewItem({ name: "", category: "", price: "", available: true, image_url: "" });
      setEditItemId(null);
      handleCloseModal();
    } catch {
      setError("Unable to connect to backend.");
    }
  };

  const handleDelete = async (itemId: number) => {
    try {
      setError("");
      const headers = getAuthHeaders();
      if (!headers) {
        goToLogin("Please login to manage menu items.");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/menu/${itemId}`, {
        method: "DELETE",
        headers,
      });

      if (response.status === 401 || response.status === 403) {
        const data = await response.json();
        goToLogin(data?.error || "Session expired. Please login again.");
        return;
      }

      if (!response.ok) {
        const data = await response.json();
        setError(data?.error || "Unable to delete menu item.");
        return;
      }

      setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch {
      setError("Unable to connect to backend.");
    }
  };
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Menu Management</h1>
            <p className="text-muted-foreground">{menuItems.length} items across {categories.length - 1} categories</p>
          </div>
          <Button className="gradient-warm text-primary-foreground gap-2" onClick={() => handleOpenModal()}>
            <Plus className="h-4 w-4" /> Add Item
          </Button>
          <Transition appear show={isModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>
              <div className="fixed inset-0 flex items-center justify-center p-4">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 mb-4">
                      Add New Menu Item
                    </Dialog.Title>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" value={newItem.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Category</label>
                        <select name="category" value={newItem.category} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                          <option value="">Select category</option>
                          {categories.filter((cat) => cat !== "All").map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price</label>
                        <input type="number" name="price" value={newItem.price} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Food Image URL</label>
                        <input type="url" name="image_url" value={newItem.image_url} onChange={handleChange} placeholder="https://..." className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
                        {newItem.image_url && (
                          <img src={newItem.image_url} alt="Preview" className="mt-2 rounded w-full h-32 object-cover" />
                        )}
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" name="available" checked={newItem.available} onChange={handleChange} className="mr-2" />
                        <label className="text-sm">Available</label>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Add Item</button>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search menu items..." className="pl-9" />
        </div>

        <Tabs defaultValue="All">
          <TabsList className="flex-wrap h-auto gap-1">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="text-xs">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {menuItems
                  .filter((item) => cat === "All" || item.category === cat)
                  .map((item) => (
                    <Card key={item.id} className="shadow-card hover:shadow-elevated transition-shadow animate-scale-in">
                      <CardContent className="p-4">
                        {item.image_url && (
                          <img src={item.image_url} alt={item.name} className="rounded-lg w-full h-40 object-cover mb-2" />
                        )}
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                              {item.popular && (
                                <Badge className="gradient-warm text-primary-foreground text-[10px] border-0">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                            {/* No rating, only image, name, price, and availability */}
                          </div>
                          <p className="text-lg font-bold">₹{item.price}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t">
                          <Badge variant={item.available ? "outline" : "secondary"} className={item.available ? "text-success border-success/30" : ""}>
                            {item.available ? "Available" : "Unavailable"}
                          </Badge>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenModal(item)}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MenuManagement;

// Upload image to /public (for demo, replace with cloud upload for production)
const uploadImage = async (file: File): Promise<string> => {
  // This is a placeholder. In production, upload to S3/Cloudinary and return the URL.
  // For now, just return a fake URL for demo.
  return Promise.resolve(`/images/${file.name}`);
};

