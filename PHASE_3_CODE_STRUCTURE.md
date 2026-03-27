# Phase 3 - Code Structure Reference

This document shows the exact code structure you need to add to `server/mock-backend.mjs`.

---

## Import Statements (Add at top of file)

```javascript
import permissionMiddleware from './middleware/permissions.mjs';
import auditMiddleware from './middleware/audit.mjs';
```

---

## Pattern for Protected Endpoints

### Pattern 1: GET Endpoint (Read-only)

```javascript
if (req.method === "GET" && path === "/menu") {
  // 1. Check permission
  const permCheck = permissionMiddleware.requirePermission('menu', 'GET')(req);
  if (!permCheck.allowed) {
    auditMiddleware.logDenial(permCheck.user, 'GET', 'menu', permCheck.reason);
    send(res, 403, { error: permCheck.reason });
    return;
  }

  // 2. Extract user
  const user = permissionMiddleware.extractUser(req);

  // 3. Filter by restaurant_id
  const restaurantMenu = menu.filter(m => m.restaurant_id === user.restaurant_id);

  // 4. Log action
  auditMiddleware.logAction(user, 'READ', 'menu', { count: restaurantMenu.length });

  // 5. Send response
  send(res, 200, restaurantMenu);
  return;
}
```

### Pattern 2: POST Endpoint (Create)

```javascript
if (req.method === "POST" && path === "/menu") {
  // 1. Check permission
  const permCheck = permissionMiddleware.requirePermission('menu', 'POST')(req);
  if (!permCheck.allowed) {
    auditMiddleware.logDenial(permCheck.user, 'POST', 'menu', permCheck.reason);
    send(res, 403, { error: permCheck.reason });
    return;
  }

  // 2. Parse body
  const body = await parseBody(req);
  if (!body.name || Number(body.price) <= 0) {
    send(res, 400, { error: "Invalid menu payload" });
    return;
  }

  // 3. Extract user
  const user = permissionMiddleware.extractUser(req);

  // 4. Create item with restaurant_id
  const item = {
    id: nextMenuId++,
    restaurant_id: user.restaurant_id,  // ADD THIS
    name: String(body.name).trim(),
    category: String(body.category || "Beverages"),
    price: Number(body.price),
    available: body.available !== false,
    image_url: String(body.image_url || ""),
  };

  // 5. Save item
  menu.push(item);

  // 6. Log action
  auditMiddleware.logAction(user, 'CREATE', 'menu', { 
    item_id: item.id, 
    item_name: item.name 
  });

  // 7. Send response
  send(res, 201, item);
  return;
}
```

### Pattern 3: PUT/PATCH Endpoint (Update)

```javascript
if (req.method === "PUT" && path.startsWith("/menu/")) {
  // 1. Check permission
  const permCheck = permissionMiddleware.requirePermission('menu', 'PUT')(req);
  if (!permCheck.allowed) {
    auditMiddleware.logDenial(permCheck.user, 'PUT', 'menu', permCheck.reason);
    send(res, 403, { error: permCheck.reason });
    return;
  }

  // 2. Extract user and item ID
  const user = permissionMiddleware.extractUser(req);
  const id = Number(path.split("/").pop());

  // 3. Find item
  const item = menu.find((m) => m.id === id);
  if (!item) {
    notFound(res);
    return;
  }

  // 4. Verify user owns this item (restaurant_id check)
  if (item.restaurant_id !== user.restaurant_id) {
    auditMiddleware.logDenial(user, 'PUT', 'menu', 'Item belongs to different restaurant');
    send(res, 403, { error: "You cannot modify items from other restaurants" });
    return;
  }

  // 5. Parse body and update
  const body = await parseBody(req);
  if (body.name !== undefined) item.name = String(body.name).trim();
  if (body.category !== undefined) item.category = String(body.category);
  if (body.price !== undefined) item.price = Number(body.price);
  if (body.available !== undefined) item.available = Boolean(body.available);
  if (body.image_url !== undefined) item.image_url = String(body.image_url || "");

  // 6. Log action
  auditMiddleware.logAction(user, 'UPDATE', 'menu', { 
    item_id: item.id, 
    item_name: item.name 
  });

  // 7. Send response
  send(res, 200, item);
  return;
}
```

### Pattern 4: DELETE Endpoint

```javascript
if (req.method === "DELETE" && path.startsWith("/menu/")) {
  // 1. Check permission
  const permCheck = permissionMiddleware.requirePermission('menu', 'DELETE')(req);
  if (!permCheck.allowed) {
    auditMiddleware.logDenial(permCheck.user, 'DELETE', 'menu', permCheck.reason);
    send(res, 403, { error: permCheck.reason });
    return;
  }

  // 2. Extract user and item ID
  const user = permissionMiddleware.extractUser(req);
  const id = Number(path.split("/").pop());

  // 3. Find item
  const idx = menu.findIndex((m) => m.id === id);
  if (idx < 0) {
    notFound(res);
    return;
  }

  // 4. Verify user owns this item (restaurant_id check)
  if (menu[idx].restaurant_id !== user.restaurant_id) {
    auditMiddleware.logDenial(user, 'DELETE', 'menu', 'Item belongs to different restaurant');
    send(res, 403, { error: "You cannot delete items from other restaurants" });
    return;
  }

  // 5. Delete item
  const deletedItem = menu.splice(idx, 1)[0];

  // 6. Log action
  auditMiddleware.logAction(user, 'DELETE', 'menu', { 
    item_id: deletedItem.id, 
    item_name: deletedItem.name 
  });

  // 7. Send response
  send(res, 200, { success: true });
  return;
}
```

---

## Audit Log Endpoints

### Get Audit Logs

```javascript
if (req.method === "GET" && path === "/superadmin/audit-logs") {
  // Check permission (admin only)
  const permCheck = permissionMiddleware.requirePermission('audit', 'GET')(req);
  if (!permCheck.allowed) {
    send(res, 403, { error: permCheck.reason });
    return;
  }

  // Get filters from query string
  const filters = {};
  if (url.searchParams.has('role')) filters.user_role = url.searchParams.get('role');
  if (url.searchParams.has('resource')) filters.resource = url.searchParams.get('resource');
  if (url.searchParams.has('status')) filters.status = url.searchParams.get('status');

  // Get logs
  const logs = auditMiddleware.getAuditLogs(filters);
  send(res, 200, logs);
  return;
}
```

### Get Audit Statistics

```javascript
if (req.method === "GET" && path === "/superadmin/audit-logs/stats") {
  // Check permission (admin only)
  const permCheck = permissionMiddleware.requirePermission('audit', 'GET')(req);
  if (!permCheck.allowed) {
    send(res, 403, { error: permCheck.reason });
    return;
  }

  // Get statistics
  const stats = auditMiddleware.getAuditStats();
  send(res, 200, stats);
  return;
}
```

---

## Data Model Updates

### Add restaurant_id to all data objects

```javascript
// Before
const menu = [
  { id: 1, name: "Butter Chicken", category: "Main Course", price: 350, available: true },
];

// After
const menu = [
  { id: 1, restaurant_id: 1, name: "Butter Chicken", category: "Main Course", price: 350, available: true },
];
```

### Add restaurant_id to all arrays

```javascript
// Orders
const orders = [
  { id: 1001, restaurant_id: 1, user_id: 1, table_number: 2, items: [...], total: 400, status: "pending" },
];

// Inventory
const inventory = [
  { id: 1, restaurant_id: 1, name: "Chicken", quantity: 25, unit: "kg" },
];

// Reservations
const reservations = [
  { id: 2001, restaurant_id: 1, customer_name: "Aarav Sharma", ... },
];

// Tables
const tables = [
  { id: 5001, restaurant_id: 1, table_number: 1, capacity: 2, ... },
];

// Payroll Staff
const payrollStaff = [
  { id: 1, restaurant_id: 1, name: "Amit Kumar", role: "Waiter", ... },
];

// CRM Customers
const crmCustomers = [
  { id: 1, restaurant_id: 1, name: "Rahul Sharma", email: "rahul@email.com", ... },
];
```

---

## Endpoints to Protect (Priority Order)

### High Priority (Do First)
- [ ] GET /menu
- [ ] POST /menu
- [ ] PUT /menu/:id
- [ ] DELETE /menu/:id
- [ ] GET /orders
- [ ] POST /orders
- [ ] PUT /orders/:id
- [ ] GET /inventory
- [ ] POST /inventory
- [ ] PATCH /inventory/:id

### Medium Priority
- [ ] GET /reservations
- [ ] POST /reservations
- [ ] GET /tables
- [ ] POST /tables
- [ ] GET /crm/customers
- [ ] POST /crm/customers
- [ ] GET /payroll/staff
- [ ] POST /payroll/staff

### Low Priority (Admin only)
- [ ] GET /superadmin/users
- [ ] POST /superadmin/users
- [ ] PATCH /superadmin/users/:id
- [ ] DELETE /superadmin/users/:id

---

## Testing Code

### Test with Staff User (Should be denied)

```javascript
// Staff user token
const token = "token_staff_1234567890";

// Try to POST /menu (should be denied)
fetch('http://localhost:5000/menu', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Test Item',
    price: 100
  })
})
.then(res => res.json())
.then(data => console.log(data)); // Should return 403 error
```

### Test with Admin User (Should be allowed)

```javascript
// Admin user token
const token = "token_admin_1234567890";

// Try to POST /menu (should be allowed)
fetch('http://localhost:5000/menu', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Test Item',
    price: 100
  })
})
.then(res => res.json())
.then(data => console.log(data)); // Should return 201 with item
```

---

## Summary

1. Import middleware at top of file
2. For each endpoint:
   - Check permission
   - Extract user
   - Filter by restaurant_id
   - Log action
   - Send response
3. Add restaurant_id to all data models
4. Create audit log endpoints
5. Test with different roles

---

## Next Steps

1. Read this document
2. Read RBAC_PHASE_3_IMPLEMENTATION_GUIDE.md
3. Start implementing endpoints one by one
4. Test each endpoint
5. Move to next endpoint

