import { createServer } from "node:http";
import { URL } from "node:url";

const PORT = Number(process.env.PORT || 5000);

let nextMenuId = 7;
let nextOrderId = 1003;
let nextReservationId = 2003;
let nextDeliveryId = 3003;
let nextTransactionId = 4001;
let nextTableId = 5007;

const profile = { id: 1, name: "Demo Admin", role: "admin" };

const menu = [
  { id: 1, name: "Butter Chicken", price: 350, available: true, image_url: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80" },
  { id: 2, name: "Paneer Tikka", price: 280, available: true, image_url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" },
  { id: 3, name: "Garlic Naan", price: 60, available: true, image_url: "https://images.unsplash.com/photo-1585238341710-4b4e6cefc068?auto=format&fit=crop&w=400&q=80" },
  { id: 4, name: "Jeera Rice", price: 180, available: true, image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80" },
  { id: 5, name: "Masala Chai", price: 80, available: true, image_url: "https://images.unsplash.com/photo-1597318972826-c0e0c1e8e8c0?auto=format&fit=crop&w=400&q=80" },
  { id: 6, name: "Gulab Jamun", price: 120, available: true, image_url: "https://images.unsplash.com/photo-1585518419759-8f0c4e4b7e8c?auto=format&fit=crop&w=400&q=80" },
];

const orders = [
  { id: 1001, user_id: 1, items: ["Paneer Tikka x1", "Garlic Naan x2"], total: 400, status: "pending" },
  { id: 1002, user_id: 1, items: ["Butter Chicken x1", "Jeera Rice x1"], total: 530, status: "preparing" },
];

const reservations = [
  {
    id: 2001,
    customer_name: "Aarav Sharma",
    customer_phone: "9876543210",
    reservation_date: "2026-03-07",
    reservation_time: "19:00",
    guests: 4,
    table_number: "T3",
    status: "confirmed",
  },
  {
    id: 2002,
    customer_name: "Maya Nair",
    customer_phone: "9988776655",
    reservation_date: "2026-03-07",
    reservation_time: "20:30",
    guests: 2,
    table_number: "T8",
    status: "pending",
  },
];

const deliveries = [
  {
    id: 3001,
    order_number: "ORD-301",
    customer_name: "Ria Verma",
    phone: "9123456780",
    address: "Sector 45, Noida",
    partner: "in-house",
    amount: 840,
    driver: "Aman",
    status: "assigned",
  },
  {
    id: 3002,
    order_number: "ORD-302",
    customer_name: "Kunal Jain",
    phone: "9012345678",
    address: "Andheri West, Mumbai",
    partner: "swiggy",
    amount: 460,
    driver: "Swiggy Rider",
    status: "in_transit",
  },
];

const tables = [
  { id: 5001, table_number: 1, capacity: 2, section: "Main Hall", status: "available", current_order: null, reserved_by: null, estimated_time: null },
  { id: 5002, table_number: 2, capacity: 4, section: "Main Hall", status: "occupied", current_order: "ORD-001", reserved_by: null, estimated_time: "30 min" },
  { id: 5003, table_number: 3, capacity: 4, section: "Main Hall", status: "reserved", current_order: null, reserved_by: "John Doe", estimated_time: "18:00" },
  { id: 5004, table_number: 4, capacity: 6, section: "Outdoor", status: "available", current_order: null, reserved_by: null, estimated_time: null },
  { id: 5005, table_number: 5, capacity: 8, section: "Private Room", status: "occupied", current_order: "ORD-002", reserved_by: null, estimated_time: "45 min" },
  { id: 5006, table_number: 6, capacity: 2, section: "Main Hall", status: "maintenance", current_order: null, reserved_by: null, estimated_time: null },
];

const posTransactions = [];

// Store uploaded images as base64
const uploadedImages = new Map();
let nextImageId = 1;

const crmCustomers = [
  { id: 1, name: "Rahul Sharma", email: "rahul@email.com", phone: "+91 98765 43210", visits: 32, total_spent: 24500, vip: true, last_visit: new Date().toISOString() },
  { id: 2, name: "Priya Singh", email: "priya@email.com", phone: "+91 87654 32109", visits: 18, total_spent: 12800, vip: false, last_visit: new Date(Date.now() - 86400000).toISOString() },
];

const inventory = [
  { id: 1, name: "Chicken", quantity: 25, unit: "kg", min_stock: 10, max_stock: 50, category: "Meat" },
  { id: 2, name: "Paneer", quantity: 8, unit: "kg", min_stock: 5, max_stock: 30, category: "Dairy" },
  { id: 3, name: "Basmati Rice", quantity: 45, unit: "kg", min_stock: 20, max_stock: 100, category: "Grains" },
];

const recipes = [
  { id: 1, name: "Paneer Tikka", category: "Starter", prep_time: 20, stock: "Available", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80", ingredients: "Paneer, Yogurt, Spices, Capsicum" },
  { id: 2, name: "Veg Biryani", category: "Main Course", prep_time: 30, stock: "Available", image: "https://images.unsplash.com/photo-1604908177522-432c5c7c1c8a?auto=format&fit=crop&w=400&q=80", ingredients: "Rice, Mixed Vegetables, Spices" },
];

const supportTickets = [
  { id: 1, subject: "Payment gateway issue", restaurant: "Demo Restaurant", status: "open", created_at: new Date().toISOString() },
  { id: 2, subject: "Menu not syncing", restaurant: "Demo Restaurant", status: "in-progress", created_at: new Date(Date.now() - 86400000).toISOString() },
];

const systemSettings = [
  { id: 1, setting_key: "Notifications", description: "Configure email and push notifications", enabled: true },
  { id: 2, setting_key: "Two-Factor Authentication", description: "Extra layer of account security", enabled: false },
  { id: 3, setting_key: "Auto Backups", description: "Daily backups for restaurant data", enabled: true },
];

const subscriptions = [
  { id: 1, restaurant_id: 1, restaurant_name: "Demo Restaurant", owner: "Platform Team", plan: "Standard", status: "Active", expiry_date: "2026-06-23" },
];

const restaurants = [
  { id: 1, name: "Demo Restaurant", owner: "Platform Team", city: "Delhi", status: "Active", plan: "Standard", created_at: new Date().toISOString() },
];

const users = [
  { id: 1, name: "Super Admin", email: "superadmin@restrohub.local", password: "super123", role: "superadmin", restaurant_id: null, restaurant_name: null, is_active: true },
  { id: 2, name: "Admin User", email: "admin@example.com", password: "admin123", role: "admin", restaurant_id: 1, restaurant_name: "Demo Restaurant", is_active: true },
];

let nextUserId = 3;

const payrollStaff = [
  { id: 1, name: "Amit Kumar", role: "Waiter", present: true, leaves: 2, salary: 15000 },
  { id: 2, name: "Priya Singh", role: "Chef", present: false, leaves: 1, salary: 22000 },
  { id: 3, name: "Rahul Verma", role: "Manager", present: true, leaves: 0, salary: 30000 },
];

const tasks = [
  { id: 1, title: "Check inventory", assigned_to: "Amit Kumar", status: "Pending" },
  { id: 2, title: "Clean kitchen", assigned_to: "Priya Singh", status: "In Progress" },
  { id: 3, title: "Update menu", assigned_to: "Rahul Verma", status: "Completed" },
];

const send = (res, status, payload) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(payload));
};

const notFound = (res) => send(res, 404, { error: "Not found" });

const parseBody = (req) =>
  new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error("Payload too large"));
      }
    });
    req.on("end", () => {
      if (!data) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });

const server = createServer(async (req, res) => {
  if (!req.url || !req.method) {
    send(res, 400, { error: "Invalid request" });
    return;
  }

  if (req.method === "OPTIONS") {
    send(res, 200, { ok: true });
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const path = url.pathname;

  try {
    if (req.method === "GET" && path === "/health") {
      send(res, 200, { ok: true, service: "mock-backend" });
      return;
    }

    if (req.method === "GET" && path === "/debug/users") {
      send(res, 200, { 
        users: users.map(u => ({ 
          id: u.id, 
          name: u.name, 
          email: u.email, 
          role: u.role, 
          restaurant_id: u.restaurant_id,
          restaurant_name: u.restaurant_name 
        })) 
      });
      return;
    }

    if (req.method === "POST" && path === "/auth/login") {
      const body = await parseBody(req);
      const email = String(body.email || body.username || "").toLowerCase().trim();
      const password = String(body.password || "").trim();
      const role = body.role ? String(body.role).toLowerCase() : null;

      console.log(`[LOGIN] Attempting login with email: ${email}, role: ${role}`);
      console.log(`[LOGIN] Available users:`, users.map(u => ({ email: u.email, role: u.role })));

      // Check users array for matching credentials
      // If role is specified, match it; otherwise accept any role
      let user;
      if (role) {
        user = users.find(u => u.email.toLowerCase() === email && u.password === password && u.role === role);
      } else {
        user = users.find(u => u.email.toLowerCase() === email && u.password === password);
      }
      
      if (user) {
        console.log(`[LOGIN] ✅ Login successful for user: ${user.email}`);
        const token = `token_${user.role}_${Date.now()}`;
        send(res, 200, {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            restaurantId: user.restaurant_id,
            restaurantName: user.restaurant_name,
            mustChangePassword: false,
          },
        });
        return;
      }

      console.log(`[LOGIN] ❌ Login failed - invalid credentials`);
      send(res, 401, { error: "Invalid credentials" });
      return;
    }

    if (req.method === "GET" && path === "/profile") {
      send(res, 200, profile);
      return;
    }

    if (req.method === "GET" && path === "/menu") {
      send(res, 200, menu);
      return;
    }

    if (req.method === "POST" && path === "/menu/image") {
      // Handle JSON with base64 image data
      const body = await parseBody(req);
      
      if (body.image && typeof body.image === "string") {
        // Store the base64 image and return it
        const imageId = nextImageId++;
        uploadedImages.set(imageId, body.image);
        send(res, 200, { url: body.image });
      } else {
        // Fallback to placeholder images
        const placeholderImages = [
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1585238341710-4b4e6cefc068?auto=format&fit=crop&w=400&q=80",
        ];
        const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
        send(res, 200, { url: randomImage });
      }
      return;
    }

    if (req.method === "POST" && path === "/menu") {
      const body = await parseBody(req);
      if (!body.name || Number(body.price) <= 0) {
        send(res, 400, { error: "Invalid menu payload" });
        return;
      }
      const item = {
        id: nextMenuId++,
        name: String(body.name).trim(),
        price: Number(body.price),
        available: body.available !== false,
        image_url: String(body.image_url || ""),
      };
      menu.push(item);
      send(res, 201, item);
      return;
    }

    if (req.method === "PUT" && path.startsWith("/menu/")) {
      const id = Number(path.split("/").pop());
      const item = menu.find((m) => m.id === id);
      if (!item) {
        notFound(res);
        return;
      }
      const body = await parseBody(req);
      if (body.name !== undefined) item.name = String(body.name).trim();
      if (body.price !== undefined) item.price = Number(body.price);
      if (body.available !== undefined) item.available = Boolean(body.available);
      if (body.image_url !== undefined) item.image_url = String(body.image_url || "");
      send(res, 200, item);
      return;
    }

    if (req.method === "DELETE" && path.startsWith("/menu/")) {
      const id = Number(path.split("/").pop());
      const idx = menu.findIndex((m) => m.id === id);
      if (idx < 0) {
        notFound(res);
        return;
      }
      menu.splice(idx, 1);
      send(res, 200, { success: true });
      return;
    }

    if (req.method === "GET" && path === "/orders") {
      send(res, 200, orders);
      return;
    }

    if (req.method === "POST" && path === "/orders") {
      const body = await parseBody(req);
      if (!Array.isArray(body.items) || body.items.length === 0 || Number(body.total) <= 0) {
        send(res, 400, { error: "Invalid order payload" });
        return;
      }
      const order = {
        id: nextOrderId++,
        user_id: Number(body.userId || 1),
        items: body.items.map((item) => String(item)),
        total: Number(body.total),
        status: "pending",
      };
      orders.unshift(order);
      send(res, 201, order);
      return;
    }

    if (req.method === "GET" && path === "/reservations") {
      send(res, 200, reservations);
      return;
    }

    if (req.method === "POST" && path === "/reservations") {
      const body = await parseBody(req);
      if (!body.customer_name || !body.customer_phone || !body.reservation_date || !body.reservation_time) {
        send(res, 400, { error: "Invalid reservation payload" });
        return;
      }
      const reservation = {
        id: nextReservationId++,
        customer_name: String(body.customer_name).trim(),
        customer_phone: String(body.customer_phone).trim(),
        reservation_date: String(body.reservation_date),
        reservation_time: String(body.reservation_time),
        guests: Number(body.guests || 1),
        table_number: String(body.table_number || "T1"),
        status: String(body.status || "pending"),
      };
      reservations.unshift(reservation);
      send(res, 201, reservation);
      return;
    }

    if (req.method === "PATCH" && path.startsWith("/reservations/") && path.endsWith("/status")) {
      const id = Number(path.split("/")[2]);
      const body = await parseBody(req);
      const reservation = reservations.find((item) => item.id === id);
      if (!reservation) {
        notFound(res);
        return;
      }
      reservation.status = String(body.status || reservation.status);
      send(res, 200, reservation);
      return;
    }

    if (req.method === "GET" && path === "/deliveries") {
      send(res, 200, deliveries);
      return;
    }

    if (req.method === "GET" && path === "/tables") {
      send(res, 200, tables);
      return;
    }

    if (req.method === "POST" && path === "/tables") {
      const body = await parseBody(req);
      if (!body.table_number || !body.capacity || !body.section) {
        send(res, 400, { error: "Invalid table payload" });
        return;
      }
      const table = {
        id: nextTableId++,
        table_number: Number(body.table_number),
        capacity: Number(body.capacity),
        section: String(body.section),
        status: "available",
        current_order: null,
        reserved_by: null,
        estimated_time: null,
      };
      tables.push(table);
      send(res, 201, table);
      return;
    }

    if (req.method === "PATCH" && path.startsWith("/tables/") && path.endsWith("/status")) {
      const id = Number(path.split("/")[2]);
      const body = await parseBody(req);
      const table = tables.find((item) => item.id === id);
      if (!table) {
        notFound(res);
        return;
      }
      table.status = String(body.status || table.status);
      send(res, 200, table);
      return;
    }

    if (req.method === "DELETE" && path.startsWith("/tables/")) {
      const id = Number(path.split("/")[2]);
      const idx = tables.findIndex((item) => item.id === id);
      if (idx < 0) {
        notFound(res);
        return;
      }
      tables.splice(idx, 1);
      send(res, 200, { success: true });
      return;
    }

    if (req.method === "POST" && path === "/deliveries") {
      const body = await parseBody(req);
      if (!body.order_number || !body.customer_name || !body.address) {
        send(res, 400, { error: "Invalid delivery payload" });
        return;
      }
      const delivery = {
        id: nextDeliveryId++,
        order_number: String(body.order_number).trim().toUpperCase(),
        customer_name: String(body.customer_name).trim(),
        phone: String(body.phone || ""),
        address: String(body.address).trim(),
        partner: String(body.partner || "in-house"),
        amount: Number(body.amount || 0),
        driver: String(body.driver || "Unassigned"),
        status: String(body.status || "pending"),
      };
      deliveries.unshift(delivery);
      send(res, 201, delivery);
      return;
    }

    if (req.method === "PATCH" && path.startsWith("/deliveries/") && path.endsWith("/status")) {
      const id = Number(path.split("/")[2]);
      const body = await parseBody(req);
      const delivery = deliveries.find((item) => item.id === id);
      if (!delivery) {
        notFound(res);
        return;
      }
      delivery.status = String(body.status || delivery.status);
      send(res, 200, delivery);
      return;
    }

    if (req.method === "GET" && path === "/crm/customers") {
      send(res, 200, crmCustomers);
      return;
    }

    if (req.method === "POST" && path === "/crm/customers") {
      const body = await parseBody(req);
      if (!body.name || !body.email || !body.phone) {
        send(res, 400, { error: "Invalid customer payload" });
        return;
      }
      const customer = {
        id: Math.max(...crmCustomers.map(c => c.id), 0) + 1,
        name: String(body.name).trim(),
        email: String(body.email).trim(),
        phone: String(body.phone).trim(),
        visits: 1,
        total_spent: 0,
        vip: false,
        last_visit: new Date().toISOString(),
      };
      crmCustomers.push(customer);
      send(res, 201, customer);
      return;
    }

    if (req.method === "GET" && path === "/inventory") {
      send(res, 200, inventory);
      return;
    }

    if (req.method === "POST" && path === "/inventory") {
      const body = await parseBody(req);
      if (!body.name || Number(body.quantity) < 0) {
        send(res, 400, { error: "Invalid inventory payload" });
        return;
      }
      const item = {
        id: Math.max(...inventory.map(i => i.id), 0) + 1,
        name: String(body.name).trim(),
        quantity: Number(body.quantity),
        unit: String(body.unit || "kg"),
        min_stock: Number(body.min_stock || 0),
        max_stock: Number(body.max_stock || 0),
        category: String(body.category || "General"),
      };
      inventory.push(item);
      send(res, 201, item);
      return;
    }

    if (req.method === "GET" && path === "/recipes") {
      send(res, 200, recipes);
      return;
    }

    if (req.method === "POST" && path === "/recipes") {
      const body = await parseBody(req);
      if (!body.name) {
        send(res, 400, { error: "Invalid recipe payload" });
        return;
      }
      const recipe = {
        id: Math.max(...recipes.map(r => r.id), 0) + 1,
        name: String(body.name).trim(),
        category: String(body.category || "General"),
        prep_time: Number(body.prep_time || 15),
        stock: String(body.stock || "Available"),
        image: String(body.image || ""),
        ingredients: String(body.ingredients || ""),
      };
      recipes.push(recipe);
      send(res, 201, recipe);
      return;
    }

    if (req.method === "GET" && path === "/superadmin/support") {
      send(res, 200, supportTickets);
      return;
    }

    if (req.method === "POST" && path === "/superadmin/support") {
      const body = await parseBody(req);
      if (!body.subject) {
        send(res, 400, { error: "Invalid ticket payload" });
        return;
      }
      const ticket = {
        id: Math.max(...supportTickets.map(t => t.id), 0) + 1,
        subject: String(body.subject).trim(),
        restaurant: String(body.restaurant || ""),
        status: String(body.status || "open"),
        created_at: new Date().toISOString(),
      };
      supportTickets.push(ticket);
      send(res, 201, ticket);
      return;
    }

    if (req.method === "GET" && path === "/superadmin/settings") {
      send(res, 200, systemSettings);
      return;
    }

    if (req.method === "GET" && path === "/superadmin/restaurants") {
      send(res, 200, restaurants);
      return;
    }

    if (req.method === "POST" && path === "/superadmin/restaurants") {
      const body = await parseBody(req);
      if (!body.name || !body.owner) {
        send(res, 400, { error: "Invalid restaurant payload" });
        return;
      }
      const restaurant = {
        id: Math.max(...restaurants.map(r => r.id), 0) + 1,
        name: String(body.name).trim(),
        owner: String(body.owner).trim(),
        city: String(body.city || ""),
        status: String(body.status || "Active"),
        plan: String(body.plan || "Standard"),
        created_at: new Date().toISOString(),
      };
      restaurants.push(restaurant);
      
      // Create admin account for the restaurant
      // Use custom credentials if provided, otherwise generate them
      const adminEmail = String(body.admin_email || `admin${restaurant.id}@restrohub.local`).toLowerCase().trim();
      const adminPassword = String(body.admin_password || `admin${restaurant.id}123`).trim();
      const adminName = String(body.admin_name || `${restaurant.name} Admin`).trim();
      
      const adminUser = {
        id: nextUserId++,
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: "admin",
        restaurant_id: restaurant.id,
        restaurant_name: restaurant.name,
        is_active: true,
      };
      users.push(adminUser);
      
      console.log(`[RESTAURANT] ✅ Created restaurant: ${restaurant.name} (ID: ${restaurant.id})`);
      console.log(`[RESTAURANT] ✅ Created admin account: ${adminEmail} / ${adminPassword}`);
      console.log(`[RESTAURANT] Total users now: ${users.length}`);
      
      // Also create a subscription for the new restaurant
      const subscription = {
        id: Math.max(...subscriptions.map(s => s.id), 0) + 1,
        restaurant_id: restaurant.id,
        restaurant_name: restaurant.name,
        owner: restaurant.owner,
        plan: restaurant.plan,
        status: "Active",
        expiry_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      };
      subscriptions.push(subscription);
      
      send(res, 201, {
        ...restaurant,
        admin_created: true,
        admin_email: adminEmail,
        admin_password: adminPassword,
      });
      return;
    }

    if (req.method === "GET" && path === "/superadmin/subscriptions") {
      send(res, 200, subscriptions);
      return;
    }

    if (req.method === "POST" && path === "/superadmin/users") {
      const body = await parseBody(req);
      if (!body.email || !body.name || !body.role) {
        send(res, 400, { error: "Invalid user payload" });
        return;
      }

      const email = String(body.email || "").toLowerCase().trim();
      const password = String(body.temporaryPassword || `temp${Date.now()}`).trim();
      const name = String(body.name).trim();
      const role = String(body.role).toLowerCase();
      const restaurantId = body.restaurantId ? Number(body.restaurantId) : null;
      const restaurantName = String(body.restaurantName || "").trim();

      // Check if user already exists
      if (users.find(u => u.email.toLowerCase() === email)) {
        send(res, 400, { error: "User with this email already exists" });
        return;
      }

      const newUser = {
        id: nextUserId++,
        name: name,
        email: email,
        password: password,
        role: role,
        restaurant_id: restaurantId,
        restaurant_name: restaurantName,
        is_active: true,
      };

      users.push(newUser);
      console.log(`[USER] ✅ Created user: ${email} (${role})`);

      send(res, 201, {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        restaurant_id: newUser.restaurant_id,
        restaurant_name: newUser.restaurant_name,
      });
      return;
    }

    if (req.method === "GET" && path === "/payroll/staff") {
      send(res, 200, payrollStaff);
      return;
    }

    if (req.method === "POST" && path === "/payroll/staff") {
      const body = await parseBody(req);
      if (!body.name || !body.role) {
        send(res, 400, { error: "Invalid staff payload" });
        return;
      }
      const staff = {
        id: Math.max(...payrollStaff.map(s => s.id), 0) + 1,
        name: String(body.name).trim(),
        role: String(body.role).trim(),
        present: Boolean(body.present),
        leaves: Number(body.leaves || 0),
        salary: Number(body.salary || 0),
      };
      payrollStaff.push(staff);
      send(res, 201, staff);
      return;
    }

    if (req.method === "GET" && path === "/tasks") {
      send(res, 200, tasks);
      return;
    }

    if (req.method === "POST" && path === "/tasks") {
      const body = await parseBody(req);
      if (!body.title) {
        send(res, 400, { error: "Invalid task payload" });
        return;
      }
      const task = {
        id: Math.max(...tasks.map(t => t.id), 0) + 1,
        title: String(body.title).trim(),
        assigned_to: String(body.assigned_to || "Unassigned"),
        status: String(body.status || "Pending"),
      };
      tasks.push(task);
      send(res, 201, task);
      return;
    }

    if (req.method === "GET" && path === "/reports/overview") {
      // Get top items from menu based on orders
      const itemCounts = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          const itemName = String(item).split(' x')[0].trim();
          itemCounts[itemName] = (itemCounts[itemName] || 0) + 1;
        });
      });
      
      const topItems = Object.entries(itemCounts)
        .map(([name, count]) => ({ name, orders: count }))
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5);

      send(res, 200, {
        revenue: orders.reduce((sum, o) => sum + o.total, 0),
        totalOrders: orders.length,
        totalCustomers: crmCustomers.length,
        topItems: topItems.length > 0 ? topItems : [{ name: "Butter Chicken", orders: 5 }, { name: "Paneer Tikka", orders: 3 }],
      });
      return;
    }

    if (req.method === "GET" && path === "/pos/transactions") {
      send(res, 200, posTransactions);
      return;
    }

    if (req.method === "POST" && path === "/pos/transactions") {
      const body = await parseBody(req);
      if (!Array.isArray(body.items) || Number(body.total) <= 0) {
        send(res, 400, { error: "Invalid POS payload" });
        return;
      }
      const transaction = {
        id: nextTransactionId++,
        order_number: `POS-${Date.now()}`,
        items: body.items,
        subtotal: Number(body.subtotal || 0),
        tax: Number(body.tax || 0),
        total: Number(body.total),
        payment_method: String(body.payment_method || "cash"),
        created_at: new Date().toISOString(),
      };
      posTransactions.unshift(transaction);
      send(res, 201, transaction);
      return;
    }

    if (req.method === "PATCH" && path.startsWith("/orders/") && path.endsWith("/status")) {
      const id = Number(path.split("/")[2]);
      const body = await parseBody(req);
      const order = orders.find((item) => item.id === id);
      if (!order) {
        notFound(res);
        return;
      }
      if (body.status) {
        order.status = String(body.status);
      }
      send(res, 200, order);
      return;
    }

    notFound(res);
  } catch (err) {
    send(res, 400, { error: err instanceof Error ? err.message : "Request failed" });
  }
});

server.listen(PORT, () => {
  console.log(`Mock backend running on http://localhost:${PORT}`);
});
