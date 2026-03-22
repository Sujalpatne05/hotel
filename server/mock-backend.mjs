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
  { id: 1, name: "Butter Chicken", price: 350, available: true },
  { id: 2, name: "Paneer Tikka", price: 280, available: true },
  { id: 3, name: "Garlic Naan", price: 60, available: true },
  { id: 4, name: "Jeera Rice", price: 180, available: true },
  { id: 5, name: "Masala Chai", price: 80, available: true },
  { id: 6, name: "Gulab Jamun", price: 120, available: true },
];

const orders = [
  { id: 1001, user_id: 1, items: ["Paneer Tikka x1", "Garlic Naan x2"], total: 400 },
  { id: 1002, user_id: 1, items: ["Butter Chicken x1", "Jeera Rice x1"], total: 530 },
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

    if (req.method === "GET" && path === "/profile") {
      send(res, 200, profile);
      return;
    }

    if (req.method === "GET" && path === "/menu") {
      send(res, 200, menu);
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

    notFound(res);
  } catch (err) {
    send(res, 400, { error: err instanceof Error ? err.message : "Request failed" });
  }
});

server.listen(PORT, () => {
  console.log(`Mock backend running on http://localhost:${PORT}`);
});
