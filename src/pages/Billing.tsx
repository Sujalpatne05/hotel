


import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import React, { useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import { getAuthToken, getStoredRole } from "@/lib/session";
import { toast } from "@/components/ui/sonner";
import { useLocation } from "react-router-dom";
import { Monitor, ShoppingCart, UtensilsCrossed } from "lucide-react";

const ORDER_TYPES = ["dine-in", "take-away", "delivery"] as const;
const PAYMENT_METHODS = ["upi", "card", "cash"] as const;
type Table = { id: number; number: number; capacity: number; status: string };
type MenuItem = { id: number; name: string; price: number; category: string; available: boolean; image_url?: string };

const MENU_CATEGORIES_DEFAULT = ["All"];
type OrderItem = { id: number; name: string; price: number; qty: number };




const Billing: React.FC = () => {
	const location = useLocation();
	const [orderType, setOrderType] = useState<typeof ORDER_TYPES[number]>("dine-in");
	const [selectedTable, setSelectedTable] = useState<number | null>(null);
	const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
	const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
	const [paymentMethod, setPaymentMethod] = useState<typeof PAYMENT_METHODS[number]>("cash");
	const [menuCategory, setMenuCategory] = useState<string>("All");
	const [menuSearch, setMenuSearch] = useState<string>("");
	const [menu, setMenu] = useState<MenuItem[]>([]);
	const [menuCategories, setMenuCategories] = useState<string[]>(MENU_CATEGORIES_DEFAULT);
	const [loadingMenu, setLoadingMenu] = useState(false);
	const [tables, setTables] = useState<Table[]>([]);
	const [loadingTables, setLoadingTables] = useState(false);

	// Fetch menu from backend
	useEffect(() => {
		setLoadingMenu(true);
		apiRequest<MenuItem[]>("/menu", { method: "GET" }, true)
			.then(data => {
				setMenu(data);
				// Generate categories from menu
				const cats = Array.from(new Set(data.map(item => item.category)));
				setMenuCategories(["All", ...cats]);
			})
			.catch(() => {
				toast.error("Failed to load menu");
			})
			.finally(() => setLoadingMenu(false));
	}, []);

	// Fetch tables from backend
	useEffect(() => {
		setLoadingTables(true);
		apiRequest<any[]>("/tables", { method: "GET" }, true)
			.then(data => {
				// Map backend table_number to number for dropdown compatibility
				setTables(data.map(t => ({
					id: t.id,
					number: t.number ?? t.table_number, // support both
					capacity: t.capacity,
					status: t.status
				})));
			})
			.catch(() => toast.error("Failed to load tables"))
			.finally(() => setLoadingTables(false));
	}, []);

	// Auto-select table from query string
	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const tableParam = params.get("table");
		if (tableParam && !selectedTable) {
			const tableNum = Number(tableParam);
			if (!isNaN(tableNum)) setSelectedTable(tableNum);
		}
	}, [location.search, selectedTable]);

	const addItem = (item: { id: number; name: string; price: number }) => {
		setOrderItems((prev) => {
			const found = prev.find((i) => i.id === item.id);
			if (found) {
				return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
			}
			return [...prev, { ...item, qty: 1 }];
		});
	};
	const removeItem = (id: number) => {
		setOrderItems((prev) => {
			const found = prev.find((i) => i.id === id);
			if (found && found.qty > 1) {
				return prev.map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i));
			}
			return prev.filter((i) => i.id !== id);
		});
	};
	const subtotal = orderItems.reduce((sum, i) => sum + i.price * i.qty, 0);
	const tax = Math.round(subtotal * 0.05);
	const total = subtotal + tax;
	const handlePlaceOrder = async () => {
		if (!orderItems.length) return;
		// Prevent dine-in order without table
		if (orderType === "dine-in" && !selectedTable) {
			toast.error("Please select a table for dine-in orders.");
			return;
		}
		// Simulate userId from session (in real app, get from session)
		const userId = 1; // TODO: Replace with actual userId from session if available
		const payload = {
			userId,
			items: orderItems.map(i => i.name),
			total,
			orderType,
			paymentMethod,
			table_number: orderType === "dine-in" ? selectedTable : null,
		};
		try {
			await apiRequest("/orders", {
				method: "POST",
				body: JSON.stringify(payload),
			});
			toast.success("Order placed successfully!");
			setOrderItems([]);
			setCustomer({ name: "", phone: "", address: "" });
			setSelectedTable(null);
		} catch (err: any) {
			toast.error(err.message || "Failed to place order");
		}
	};

	// Filtered menu
	const filteredMenu = menu.filter(item =>
		(menuCategory === "All" || item.category === menuCategory) &&
		item.name.toLowerCase().includes(menuSearch.toLowerCase())
	);

	return (
		<DashboardLayout>
			<div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-orange-50 via-white to-orange-100 flex flex-col justify-between">
				{/* Header */}
				<div className="py-6 px-2 md:px-0 max-w-6xl mx-auto w-full">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
						<div>
							<h1 className="text-3xl font-bold text-orange-700 flex items-center gap-2 mb-1">
								<ShoppingCart className="inline-block text-orange-500" /> POS Billing
							</h1>
							<div className="text-muted-foreground text-sm">Welcome to RestroHub! Please select items and complete the order below.</div>
						</div>
						<div className="flex items-center gap-4">
							<span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">Restaurant: pk cafe</span>
							<span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">KDS <Monitor className="inline-block ml-1" size={16} /></span>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{/* Menu Section */}
						<Card className="md:col-span-2 bg-white/90 shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl flex items-center gap-2">
									<UtensilsCrossed className="text-orange-500" /> Menu
								</CardTitle>
								<Tabs value={orderType} onValueChange={v => setOrderType(v as typeof orderType)}>
									<TabsList className="mt-2">
										{ORDER_TYPES.map(type => (
											<TabsTrigger key={type} value={type} className="capitalize">
												{type.replace("-", " ")}
											</TabsTrigger>
										))}
									</TabsList>
								</Tabs>
								{orderType === "dine-in" && (
									<div className="my-6">
										<div className="border-t border-orange-100 mb-4"></div>
										<label className="block mb-2 text-base font-semibold text-orange-700">Table</label>
										<div className="flex gap-2 items-center">
											<select
												className="border rounded px-3 py-2 bg-orange-50 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 transition-all"
												value={selectedTable ?? ""}
												onChange={e => setSelectedTable(Number(e.target.value))}
												disabled={loadingTables}
											>
												<option value="">Select Table</option>
												{tables.map(t => (
													<option key={t.id} value={t.number}>{t.number}</option>
												))}
											</select>
										</div>
									</div>
								)}
								{/* Category Tabs and Search */}
								<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-2 mb-4">
									<div className="flex flex-wrap gap-2">
										{menuCategories.map(cat => (
											<Button
												key={cat}
												size="sm"
												variant={menuCategory === cat ? "default" : "outline"}
												onClick={() => setMenuCategory(cat)}
											>
												{cat}
											</Button>
										))}
									</div>
									<Input
										className="max-w-xs mt-2 md:mt-0"
										placeholder="Search menu..."
										value={menuSearch}
										onChange={e => setMenuSearch(e.target.value)}
									/>
								</div>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
									{loadingMenu ? (
										<div className="col-span-full text-center text-muted-foreground py-8">Loading menu...</div>
									) : filteredMenu.length === 0 ? (
										<div className="col-span-full text-center text-muted-foreground py-8">No items found.</div>
									) : (
										filteredMenu.map(item => (
											<Card key={item.id} className="p-3 flex flex-col items-center bg-orange-50/80 border-orange-100 shadow-sm hover:shadow-md transition-all">
												<div className="mb-2 text-3xl"><UtensilsCrossed className="text-orange-500" /></div>
												<span className="font-semibold text-base mb-1">{item.name}</span>
												<Badge className="mb-2 bg-orange-500/90 text-white">₹{item.price}</Badge>
												<Button size="sm" onClick={() => addItem(item)} variant="outline" disabled={!item.available}>Add</Button>
												{!item.available && <span className="text-xs text-red-500 mt-1">Unavailable</span>}
											</Card>
										))
									)}
								</div>
							</CardContent>
						</Card>

						{/* Order Summary Section */}
						<Card className="bg-white/90 shadow-lg">
							<CardHeader>
								<CardTitle className="text-xl flex items-center gap-2">
									<ShoppingCart className="text-orange-500" /> Order Summary
								</CardTitle>
							</CardHeader>
							<CardContent>
								{orderItems.length === 0 ? (
									<div className="text-muted-foreground mb-4">No items selected.</div>
								) : (
									<ul className="mb-4">
										{orderItems.map(item => (
											<li key={item.id} className="flex justify-between items-center mb-2 bg-orange-50 rounded px-2 py-1 shadow-sm">
												<span className="font-medium">{item.name} <span className="text-xs text-muted-foreground">x {item.qty}</span></span>
												<span className="font-semibold">₹{item.price * item.qty}</span>
												<Button size="sm" variant="ghost" onClick={() => removeItem(item.id)}>-</Button>
											</li>
										))}
									</ul>
								)}
								<div className="border-t pt-2 flex flex-col gap-1 mb-4">
									<div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal}</span></div>
									<div className="flex justify-between"><span>Tax (5%)</span><span>₹{tax}</span></div>
									<div className="flex justify-between font-bold text-lg text-orange-700"><span>Total</span><span>₹{total}</span></div>
								</div>
								{(orderType === "take-away" || orderType === "delivery") && (
									<div className="mb-4">
										<div className="font-medium mb-1">Customer Details</div>
										<Input
											className="mb-2"
											placeholder="Name"
											value={customer.name}
											onChange={e => setCustomer({ ...customer, name: e.target.value })}
										/>
										<Input
											className="mb-2"
											placeholder="Phone"
											value={customer.phone}
											onChange={e => setCustomer({ ...customer, phone: e.target.value })}
										/>
										{orderType === "delivery" && (
											<Input
												className="mb-2"
												placeholder="Address"
												value={customer.address}
												onChange={e => setCustomer({ ...customer, address: e.target.value })}
											/>
										)}
									</div>
								)}
								<div className="mb-4">
									<div className="font-medium mb-1">Payment Method</div>
									<div className="flex gap-2">
										{PAYMENT_METHODS.map(method => (
											<Button
												key={method}
												size="sm"
												variant={paymentMethod === method ? "default" : "outline"}
												onClick={() => setPaymentMethod(method)}
											>
												{method.toUpperCase()}
											</Button>
										))}
									</div>
								</div>
								<Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handlePlaceOrder} disabled={orderItems.length === 0}>
									Place Order
								</Button>
							</CardContent>
						</Card>
					</div>
				</div>
				{/* Footer */}
				<footer className="w-full text-center py-4 text-muted-foreground text-xs bg-transparent mt-8">
					&copy; {new Date().getFullYear()} RestroHub POS &mdash; Powered by pk cafe
				</footer>
			</div>
		</DashboardLayout>
	);
};

export default Billing;
