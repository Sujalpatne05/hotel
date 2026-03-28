# Super Admin Backend Endpoint Analysis

## Status: INCOMPLETE - Missing 3 Critical Endpoints

---

## ✅ EXISTING ENDPOINTS

### Dashboard
- ✅ GET `/superadmin/restaurants` - Load restaurants
- ✅ GET `/superadmin/users` - Load users  
- ✅ GET `/superadmin/subscriptions` - Load subscriptions

### Restaurants
- ✅ GET `/superadmin/restaurants` - List all restaurants
- ✅ POST `/superadmin/restaurants` - Create restaurant
- ✅ PUT `/superadmin/restaurants/:id` - Update restaurant
- ✅ DELETE `/superadmin/restaurants/:id` - Delete restaurant

### Users
- ✅ GET `/superadmin/users` - List all users
- ✅ POST `/superadmin/users` - Create user
- ✅ PATCH `/superadmin/users/:id` - Toggle user status
- ✅ POST `/superadmin/users/:id/reset-password` - Reset password
- ✅ DELETE `/superadmin/users/:id` - Delete user

### Subscriptions
- ✅ GET `/superadmin/subscriptions` - List subscriptions
- ✅ PATCH `/superadmin/subscriptions/:id` - Update subscription

### Revenue
- ✅ GET `/orders` - Used for revenue calculations

### Analytics
- ✅ GET `/superadmin/restaurants` - Restaurant data
- ✅ GET `/orders` - Order data

### Settings
- ✅ GET `/superadmin/settings` - List settings

### Support
- ✅ GET `/superadmin/support` - List tickets
- ✅ POST `/superadmin/support` - Create ticket

---

## ❌ MISSING ENDPOINTS (3 Required)

### 1. PATCH `/superadmin/settings/:id`
**Used by:** SuperAdminSettings.tsx
**Purpose:** Toggle system settings on/off
**Frontend Code:**
```typescript
await apiRequest(`/superadmin/settings/${setting.id}`, {
  method: "PATCH",
  body: JSON.stringify({ enabled: !setting.enabled }),
});
```

**Required Implementation:**
```javascript
if (req.method === "PATCH" && path.match(/^\/superadmin\/settings\/\d+$/)) {
  const id = Number(path.split("/").pop());
  const body = await parseBody(req);
  const index = systemSettings.findIndex(s => s.id === id);
  
  if (index === -1) {
    send(res, 404, { error: "Setting not found" });
    return;
  }
  
  if (body.enabled !== undefined) {
    systemSettings[index].enabled = Boolean(body.enabled);
  }
  
  send(res, 200, systemSettings[index]);
  return;
}
```

---

### 2. PATCH `/superadmin/support/:id`
**Used by:** SuperAdminSupport.tsx
**Purpose:** Update ticket status, subject, restaurant
**Frontend Code:**
```typescript
await apiRequest(`/superadmin/support/${ticket.id}`, {
  method: "PATCH",
  body: JSON.stringify({ subject, restaurant, status }),
});
```

**Required Implementation:**
```javascript
if (req.method === "PATCH" && path.match(/^\/superadmin\/support\/\d+$/)) {
  const id = Number(path.split("/").pop());
  const body = await parseBody(req);
  const index = supportTickets.findIndex(t => t.id === id);
  
  if (index === -1) {
    send(res, 404, { error: "Ticket not found" });
    return;
  }
  
  if (body.subject) supportTickets[index].subject = body.subject;
  if (body.restaurant) supportTickets[index].restaurant = body.restaurant;
  if (body.status) supportTickets[index].status = body.status;
  
  send(res, 200, supportTickets[index]);
  return;
}
```

---

### 3. DELETE `/superadmin/support/:id`
**Used by:** SuperAdminSupport.tsx
**Purpose:** Delete support ticket
**Frontend Code:**
```typescript
await apiRequest(`/superadmin/support/${ticket.id}`, {
  method: "DELETE",
});
```

**Required Implementation:**
```javascript
if (req.method === "DELETE" && path.match(/^\/superadmin\/support\/\d+$/)) {
  const id = Number(path.split("/").pop());
  const index = supportTickets.findIndex(t => t.id === id);
  
  if (index === -1) {
    send(res, 404, { error: "Ticket not found" });
    return;
  }
  
  supportTickets.splice(index, 1);
  send(res, 200, { success: true, message: "Ticket deleted" });
  return;
}
```

---

## 📊 SUMMARY

### Total Endpoints Required: 20
- ✅ Implemented: 17 (85%)
- ❌ Missing: 3 (15%)

### Missing Endpoints by Page:
1. **SuperAdminSettings** - 1 endpoint missing (PATCH)
2. **SuperAdminSupport** - 2 endpoints missing (PATCH, DELETE)

### Impact:
- **Settings Page**: Cannot toggle settings on/off
- **Support Page**: Cannot edit or delete tickets

---

## 🔧 FIX REQUIRED

Add the 3 missing endpoints to `server/mock-backend.mjs`:
1. PATCH `/superadmin/settings/:id`
2. PATCH `/superadmin/support/:id`
3. DELETE `/superadmin/support/:id`

Location: After line 759 (after GET /superadmin/settings)

---

## ✅ WORKING PAGES (No Backend Issues)

1. **SuperAdminDashboard** - All endpoints exist
2. **SuperAdminRestaurants** - All CRUD operations work
3. **SuperAdminUsers** - All CRUD operations work (just fixed)
4. **SuperAdminSubscriptions** - All operations work
5. **SuperAdminRevenue** - Read-only, works
6. **SuperAdminAnalytics** - Read-only, works

---

## 🚨 BROKEN PAGES (Need Fixes)

1. **SuperAdminSettings** - Toggle doesn't work
2. **SuperAdminSupport** - Edit and Delete don't work

---

## NEXT STEPS

1. Add PATCH `/superadmin/settings/:id` endpoint
2. Add PATCH `/superadmin/support/:id` endpoint  
3. Add DELETE `/superadmin/support/:id` endpoint
4. Restart backend server
5. Test Settings toggle
6. Test Support edit/delete

---

Generated: 2026-03-28
