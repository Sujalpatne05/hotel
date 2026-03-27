# Restaurant Warehouse - System Architecture

**Status**: Complete Overview
**Date**: March 27, 2026

---

## System Overview

**Restaurant Warehouse** is a **multi-tenant SaaS platform** for restaurant management. The system allows:

1. **Super Admin** to manage multiple restaurants
2. **Restaurant Admins** to manage their own restaurant
3. **Managers** to operate the restaurant
4. **Staff** to perform limited tasks

---

## User Flow & Workflow

### Step 1: Super Admin Creates Restaurant
- Super Admin logs in to `/superadmin-dashboard`
- Creates a new restaurant (e.g., "ABC Hotel")
- Restaurant is added to the system with ID, name, owner, city, etc.

### Step 2: Super Admin Creates Restaurant Admin
- Super Admin goes to "User Access Control"
- Clicks "Add User"
- Fills in:
  - **Name**: ABC Admin
  - **Email**: abc@example.com
  - **Password**: abc123
  - **Role**: Admin
  - **Restaurant**: ABC Hotel ← **KEY: Links user to restaurant**
- User is created and stored in backend

### Step 3: Restaurant Admin Logs In
- Goes to login page (`/`)
- Enters email: `abc@example.com`
- Enters password: `abc123`
- Backend validates credentials
- Backend returns token with `restaurant_id: 3` (ABC Hotel)
- Frontend stores `restaurantId` in localStorage
- User redirected to Dashboard

### Step 4: Restaurant Admin Sees Only Their Data
- Dashboard loads
- All API requests include `Authorization: Bearer token`
- Backend extracts `restaurant_id` from token
- Backend filters ALL data by `restaurant_id`
- User sees ONLY ABC Hotel data:
  - ABC Hotel menu items
  - ABC Hotel orders
  - ABC Hotel reservations
  - ABC Hotel staff
  - ABC Hotel inventory
  - etc.

### Step 5: Restaurant Admin Creates Staff/Manager
- Restaurant Admin goes to "User Access Control" (if implemented)
- Creates new user for their restaurant
- Staff/Manager can only see their restaurant's data

---

## Multi-Tenant Isolation

### Data Isolation by restaurant_id

Every data model has `restaurant_id`:

```javascript
// Menu items
{ id: 1, restaurant_id: 1, name: "Butter Chicken", ... }
{ id: 2, restaurant_id: 3, name: "Biryani", ... }

// Orders
{ id: 1001, restaurant_id: 1, table_number: 2, ... }
{ id: 1002, restaurant_id: 3, table_number: 5, ... }

// Users
{ id: 2, email: "admin@example.com", restaurant_id: 1, ... }
{ id: 6, email: "abc@example.com", restaurant_id: 3, ... }
```

### Backend Filtering

Every endpoint filters by `restaurant_id`:

```javascript
// GET /menu
const user = extractUserFromToken(req);
const restaurantMenu = menu.filter(m => m.restaurant_id === user.restaurant_id);
return restaurantMenu;
```

### Frontend Storage

After login, frontend stores:

```javascript
{
  authToken: "token_admin_1234567890",
  userRole: "admin",
  userName: "ABC Admin",
  restaurantName: "ABC Hotel",
  restaurantId: 3  // ← Used for filtering
}
```

---

## Role-Based Access Control (RBAC)

### Super Admin
- **Access**: Platform-wide
- **Can do**:
  - Create/manage restaurants
  - Create/manage users for any restaurant
  - View analytics across all restaurants
  - Manage subscriptions
  - View audit logs

### Admin (Restaurant Admin)
- **Access**: Own restaurant only
- **Can do**:
  - View all restaurant data
  - Manage menu, orders, reservations
  - Manage staff (create users)
  - View reports
  - Manage inventory
  - Full access to restaurant features

### Manager
- **Access**: Own restaurant only
- **Can do**:
  - View orders, reservations, inventory
  - Manage staff attendance
  - View operations data
  - **Cannot**: Access financial data, reports, payments

### Staff
- **Access**: Own restaurant only
- **Can do**:
  - View orders
  - View kitchen display
  - **Cannot**: Create/edit anything, access financial data

---

## Current Implementation Status

### ✅ Completed

1. **Multi-Tenant Architecture**
   - `restaurant_id` field in all data models
   - Backend filters by `restaurant_id`
   - Frontend stores `restaurantId`

2. **User Management**
   - Super Admin can create users
   - Users linked to restaurants
   - Users can login with email/password

3. **Role-Based Access**
   - Permission middleware checks roles
   - Data filtered by `restaurant_id`
   - Audit logging on all actions

4. **Restaurants**
   - Multiple restaurants supported
   - Each restaurant has own data
   - Demo Restaurant, Mitu Cafe, ABC Hotel

5. **Users**
   - Super Admin: superadmin@restrohub.local
   - Demo Restaurant Admin: admin@example.com
   - Mitu Cafe Admin: mitu@example.com
   - ABC Hotel Admin: abc@example.com

### ⏳ To Verify

1. **User Creation Flow**
   - Super Admin creates user through UI
   - User is added to backend
   - User can login immediately

2. **Login Flow**
   - User enters email/password
   - Backend validates credentials
   - Backend returns token with restaurant_id
   - Frontend stores restaurant_id
   - User sees only their restaurant data

3. **Data Isolation**
   - ABC Hotel Admin sees only ABC Hotel data
   - Demo Restaurant Admin sees only Demo Restaurant data
   - No cross-restaurant data leakage

---

## Testing Checklist

### Test 1: Super Admin Creates Restaurant
- [ ] Login as Super Admin
- [ ] Create new restaurant
- [ ] Verify restaurant appears in list

### Test 2: Super Admin Creates User
- [ ] Go to User Access Control
- [ ] Create new user for restaurant
- [ ] Verify user appears in list

### Test 3: New User Logs In
- [ ] Logout from Super Admin
- [ ] Login with new user credentials
- [ ] Verify redirected to Dashboard
- [ ] Verify can see restaurant data

### Test 4: Data Isolation
- [ ] Login as ABC Hotel Admin
- [ ] Verify see only ABC Hotel data
- [ ] Logout and login as Demo Restaurant Admin
- [ ] Verify see only Demo Restaurant data
- [ ] Verify no cross-restaurant data

### Test 5: Role-Based Access
- [ ] Login as Admin - see all features
- [ ] Login as Manager - see limited features
- [ ] Login as Staff - see very limited features

---

## Key Files

### Backend
- `server/mock-backend.mjs` - Main backend with all endpoints
- `server/middleware/permissions.mjs` - Permission checks
- `server/middleware/audit.mjs` - Audit logging

### Frontend
- `src/pages/AdminLogin.tsx` - Login page
- `src/pages/SuperAdminUsers.tsx` - User management
- `src/lib/session.ts` - Session management
- `src/components/AppSidebar.tsx` - Role-based sidebar

### Data Models
- Menu items - `restaurant_id` field
- Orders - `restaurant_id` field
- Reservations - `restaurant_id` field
- Tables - `restaurant_id` field
- Inventory - `restaurant_id` field
- Staff/Payroll - `restaurant_id` field
- Users - `restaurant_id` field

---

## How It Works End-to-End

### Scenario: ABC Hotel Admin Creates Order

1. **ABC Hotel Admin logs in**
   ```
   Email: abc@example.com
   Password: abc123
   → Token: token_admin_1234567890
   → restaurantId: 3
   ```

2. **Frontend stores session**
   ```javascript
   localStorage.restaurantId = 3
   localStorage.authToken = "token_admin_1234567890"
   ```

3. **Admin creates order**
   ```
   POST /orders
   {
     table_number: 5,
     items: ["Biryani x1"],
     total: 250
   }
   ```

4. **Backend processes**
   ```javascript
   const user = extractUserFromToken(req);
   // user.restaurant_id = 3
   
   const order = {
     id: 1003,
     restaurant_id: 3,  // ← Automatically set
     table_number: 5,
     items: ["Biryani x1"],
     total: 250
   };
   
   orders.push(order);
   ```

5. **Admin views orders**
   ```
   GET /orders
   ```

6. **Backend filters**
   ```javascript
   const user = extractUserFromToken(req);
   const restaurantOrders = orders.filter(o => o.restaurant_id === user.restaurant_id);
   // Returns only ABC Hotel orders
   ```

7. **Frontend displays**
   - Shows only ABC Hotel orders
   - Admin sees their restaurant data only

---

## Security Features

1. **Multi-Tenant Isolation**
   - Every request filtered by `restaurant_id`
   - Users cannot access other restaurants' data

2. **Role-Based Access**
   - Permissions checked on every request
   - Staff cannot access admin features

3. **Audit Logging**
   - All actions logged with user, action, resource
   - Can track who did what and when

4. **Token-Based Auth**
   - JWT-like tokens with user info
   - Token includes restaurant_id
   - Backend validates token on every request

---

## Next Steps

1. **Verify user creation works**
   - Super Admin creates user through UI
   - User is added to backend
   - User can login

2. **Verify login works**
   - User enters credentials
   - Backend validates
   - User redirected to dashboard

3. **Verify data isolation**
   - Each user sees only their restaurant data
   - No cross-restaurant data leakage

4. **Test all roles**
   - Admin - full access
   - Manager - limited access
   - Staff - very limited access

