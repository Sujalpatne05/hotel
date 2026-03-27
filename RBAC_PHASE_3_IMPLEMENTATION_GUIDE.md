# RBAC Phase 3 Implementation Guide
## Backend Permission Checks & Data Filtering

**Status**: Ready to Implement
**Estimated Time**: 15-23 hours (2-3 days)
**Priority**: HIGH - Critical for security

---

## Overview

Phase 3 implements backend permission checks to prevent unauthorized API access. Currently, the frontend shows role-based UI, but the backend doesn't validate permissions. This means a user could bypass the UI and directly call API endpoints they shouldn't access.

**Security Gap**: If a user knows the API endpoint, they can access data they shouldn't see.

---

## What's Been Created

### 1. Permission Middleware (`server/middleware/permissions.mjs`)
- ✅ Role-based permission matrix
- ✅ User extraction from requests
- ✅ Permission checking logic
- ✅ Resource and method validation

### 2. Audit Logging (`server/middleware/audit.mjs`)
- ✅ Action logging system
- ✅ Permission denial tracking
- ✅ Error logging
- ✅ Audit statistics

---

## Implementation Tasks

### Task 1: Integrate Permission Middleware into Backend

**File**: `server/mock-backend.mjs`

**What to do**:
1. Import permission middleware at top:
```javascript
import permissionMiddleware from './middleware/permissions.mjs';
import auditMiddleware from './middleware/audit.mjs';
```

2. For each API endpoint, add permission check:
```javascript
if (req.method === "GET" && path === "/menu") {
  // ADD THIS:
  const permCheck = permissionMiddleware.requirePermission('menu', 'GET')(req);
  if (!permCheck.allowed) {
    auditMiddleware.logDenial(permCheck.user, 'GET', 'menu', permCheck.reason);
    send(res, 403, { error: permCheck.reason });
    return;
  }
  
  // EXISTING CODE:
  send(res, 200, menu);
  return;
}
```

**Endpoints to protect** (Priority order):

#### High Priority (Do First)
- [ ] GET /menu
- [ ] POST /menu
- [ ] PUT /menu/:id
- [ ] DELETE /menu/:id
- [ ] GET /orders
- [ ] POST /orders
- [ ] GET /inventory
- [ ] POST /inventory
- [ ] PATCH /inventory/:id

#### Medium Priority
- [ ] GET /reservations
- [ ] POST /reservations
- [ ] GET /tables
- [ ] POST /tables
- [ ] GET /crm/customers
- [ ] POST /crm/customers
- [ ] GET /payroll/staff
- [ ] POST /payroll/staff

#### Low Priority (Admin only)
- [ ] GET /superadmin/users
- [ ] POST /superadmin/users
- [ ] PATCH /superadmin/users/:id
- [ ] DELETE /superadmin/users/:id
- [ ] GET /superadmin/restaurants
- [ ] POST /superadmin/restaurants

---

### Task 2: Add Data Filtering by Restaurant

**File**: `server/mock-backend.mjs`

**What to do**:
For each endpoint, filter data by `restaurant_id` from the user's token.

**Example**:
```javascript
if (req.method === "GET" && path === "/orders") {
  // Extract user's restaurant_id from token
  const user = permissionMiddleware.extractUser(req);
  
  // Filter orders by restaurant_id
  const userOrders = orders.filter(o => o.restaurant_id === user.restaurant_id);
  
  send(res, 200, userOrders);
  return;
}
```

**Data to filter**:
- [ ] Orders by restaurant_id
- [ ] Menu items by restaurant_id
- [ ] Inventory by restaurant_id
- [ ] Reservations by restaurant_id
- [ ] Tables by restaurant_id
- [ ] Staff by restaurant_id
- [ ] Customers by restaurant_id

---

### Task 3: Update Data Models

**File**: `server/mock-backend.mjs`

**What to do**:
Add `restaurant_id` field to all data objects:

```javascript
const orders = [
  { 
    id: 1001, 
    restaurant_id: 1,  // ADD THIS
    user_id: 1, 
    table_number: 2, 
    items: ["Paneer Tikka x1"], 
    total: 400, 
    status: "pending" 
  },
];
```

**Objects to update**:
- [ ] orders
- [ ] menu items
- [ ] inventory items
- [ ] reservations
- [ ] tables
- [ ] payroll staff
- [ ] crm customers
- [ ] deliveries

---

### Task 4: Add Audit Logging to Endpoints

**File**: `server/mock-backend.mjs`

**What to do**:
Log all successful actions:

```javascript
if (req.method === "POST" && path === "/menu") {
  // ... existing code ...
  
  menu.push(item);
  
  // ADD THIS:
  const user = permissionMiddleware.extractUser(req);
  auditMiddleware.logAction(user, 'CREATE', 'menu', { item_id: item.id, item_name: item.name });
  
  send(res, 201, item);
  return;
}
```

**Actions to log**:
- [ ] CREATE (POST)
- [ ] READ (GET)
- [ ] UPDATE (PUT/PATCH)
- [ ] DELETE (DELETE)

---

### Task 5: Create Audit Log Endpoints

**File**: `server/mock-backend.mjs`

**What to do**:
Add endpoints to retrieve audit logs (admin only):

```javascript
if (req.method === "GET" && path === "/superadmin/audit-logs") {
  // Check permission
  const permCheck = permissionMiddleware.requirePermission('audit', 'GET')(req);
  if (!permCheck.allowed) {
    send(res, 403, { error: permCheck.reason });
    return;
  }
  
  // Get logs with optional filters
  const filters = Object.fromEntries(url.searchParams);
  const logs = auditMiddleware.getAuditLogs(filters);
  
  send(res, 200, logs);
  return;
}
```

**Endpoints to create**:
- [ ] GET /superadmin/audit-logs (list logs)
- [ ] GET /superadmin/audit-logs/stats (get statistics)
- [ ] DELETE /superadmin/audit-logs (clear logs - admin only)

---

## Implementation Steps

### Step 1: Update Backend with Permission Checks (2-3 hours)
1. Import middleware
2. Add permission checks to all endpoints
3. Test with different roles
4. Verify 403 responses for unauthorized access

### Step 2: Add Data Filtering (2-3 hours)
1. Add restaurant_id to all data models
2. Filter data by restaurant_id in GET endpoints
3. Validate restaurant_id in POST/PUT/PATCH endpoints
4. Test data isolation between restaurants

### Step 3: Add Audit Logging (2-3 hours)
1. Log all successful actions
2. Log permission denials
3. Create audit log endpoints
4. Test audit log retrieval

### Step 4: Testing (2-3 hours)
1. Test each role with different endpoints
2. Verify permission denials
3. Verify data filtering
4. Verify audit logs

---

## Testing Checklist

### Permission Tests
- [ ] Staff cannot POST /menu
- [ ] Staff cannot DELETE /orders
- [ ] Manager cannot GET /reports
- [ ] Manager cannot GET /payments
- [ ] Admin can access all endpoints
- [ ] SuperAdmin can access all endpoints

### Data Filtering Tests
- [ ] User A cannot see User B's orders
- [ ] User A cannot see User B's menu items
- [ ] User A cannot see User B's inventory
- [ ] User A cannot see User B's customers

### Audit Logging Tests
- [ ] All actions are logged
- [ ] Permission denials are logged
- [ ] Logs can be retrieved
- [ ] Logs can be filtered by role
- [ ] Logs can be filtered by resource

---

## Code Examples

### Example 1: Protected GET Endpoint
```javascript
if (req.method === "GET" && path === "/menu") {
  // Check permission
  const permCheck = permissionMiddleware.requirePermission('menu', 'GET')(req);
  if (!permCheck.allowed) {
    auditMiddleware.logDenial(permCheck.user, 'GET', 'menu', permCheck.reason);
    send(res, 403, { error: permCheck.reason });
    return;
  }

  // Filter by restaurant
  const user = permissionMiddleware.extractUser(req);
  const restaurantMenu = menu.filter(m => m.restaurant_id === user.restaurant_id);

  // Log action
  auditMiddleware.logAction(user, 'READ', 'menu', { count: restaurantMenu.length });

  send(res, 200, restaurantMenu);
  return;
}
```

### Example 2: Protected POST Endpoint
```javascript
if (req.method === "POST" && path === "/menu") {
  // Check permission
  const permCheck = permissionMiddleware.requirePermission('menu', 'POST')(req);
  if (!permCheck.allowed) {
    auditMiddleware.logDenial(permCheck.user, 'POST', 'menu', permCheck.reason);
    send(res, 403, { error: permCheck.reason });
    return;
  }

  const body = await parseBody(req);
  if (!body.name || Number(body.price) <= 0) {
    send(res, 400, { error: "Invalid menu payload" });
    return;
  }

  const user = permissionMiddleware.extractUser(req);
  const item = {
    id: nextMenuId++,
    restaurant_id: user.restaurant_id,  // Add restaurant_id
    name: String(body.name).trim(),
    category: String(body.category || "Beverages"),
    price: Number(body.price),
    available: body.available !== false,
    image_url: String(body.image_url || ""),
  };

  menu.push(item);

  // Log action
  auditMiddleware.logAction(user, 'CREATE', 'menu', { item_id: item.id, item_name: item.name });

  send(res, 201, item);
  return;
}
```

### Example 3: Audit Log Endpoint
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

  const logs = auditMiddleware.getAuditLogs(filters);
  send(res, 200, logs);
  return;
}
```

---

## Permission Matrix Reference

```
SUPERADMIN:
├─ users: GET, POST, PATCH, DELETE
├─ restaurants: GET, POST, PATCH, DELETE
├─ subscriptions: GET, POST, PATCH, DELETE
├─ analytics: GET
└─ revenue: GET

ADMIN:
├─ menu: GET, POST, PUT, DELETE
├─ orders: GET, POST, PUT, PATCH
├─ reservations: GET, POST, PATCH
├─ tables: GET, POST, PUT, PATCH, DELETE
├─ inventory: GET, POST, PATCH
├─ staff: GET, POST, PATCH, DELETE
├─ payroll: GET, POST, PATCH
├─ reports: GET
├─ payments: GET
├─ deliveries: GET, POST, PATCH
├─ crm: GET, POST, PATCH, DELETE
└─ users: GET, POST, PATCH

MANAGER:
├─ menu: GET, POST, PUT
├─ orders: GET, POST, PUT, PATCH
├─ reservations: GET, POST, PATCH
├─ tables: GET, POST, PUT, PATCH
├─ inventory: GET, PATCH
├─ staff: GET, PATCH
├─ payroll: GET, PATCH
├─ deliveries: GET, PATCH
└─ crm: GET, PATCH

STAFF:
├─ orders: GET
├─ tables: GET
└─ menu: GET
```

---

## Next Steps

1. **Review this guide** - Understand the implementation plan
2. **Start with Task 1** - Add permission checks to high-priority endpoints
3. **Test each endpoint** - Verify permissions work correctly
4. **Move to Task 2** - Add data filtering
5. **Add Task 3** - Implement audit logging
6. **Final testing** - Comprehensive testing of all features

---

## Success Criteria

✅ All API endpoints protected with permission checks
✅ Users cannot access endpoints they don't have permission for
✅ Data filtered by restaurant_id
✅ Users cannot see other restaurants' data
✅ All actions logged in audit trail
✅ Permission denials logged
✅ Audit logs retrievable by admin

---

## Files Modified

- `server/mock-backend.mjs` - Add permission checks and data filtering
- `server/middleware/permissions.mjs` - ✅ Created
- `server/middleware/audit.mjs` - ✅ Created

---

## Estimated Timeline

```
Task 1: Permission Checks     2-3 hours
Task 2: Data Filtering        2-3 hours
Task 3: Audit Logging         2-3 hours
Task 4: Testing               2-3 hours
─────────────────────────────────────
Total:                        8-12 hours (1-2 days)
```

---

## Questions?

Refer to:
- `RBAC_FINAL_STATUS.md` - Overall status
- `RBAC_PERMISSION_MATRIX.md` - Permission details
- `RBAC_MULTI_TENANT_ISOLATION.md` - Multi-tenant details

