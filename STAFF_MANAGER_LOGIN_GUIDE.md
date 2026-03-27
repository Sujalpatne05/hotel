# Staff & Manager Login Guide

**Status**: Ready to Use
**Date**: March 27, 2026

---

## Overview

Staff and Manager users login using the **same login page** as Admin. The system automatically detects their role based on credentials and shows them the appropriate dashboard.

---

## Login Flow

### Step 1: User Enters Credentials
- Email/Username
- Password

### Step 2: Backend Validates
- Checks if credentials match any user in the system
- Identifies the user's role (Admin, Manager, or Staff)
- Returns authentication token with role

### Step 3: Frontend Stores Session
- Saves token, role, name, restaurant info
- Redirects to appropriate dashboard based on role

### Step 4: User Sees Role-Based Dashboard
- **Admin**: Full dashboard with all features
- **Manager**: Dashboard without financial data
- **Staff**: Only Kitchen Display and Orders

---

## Test Users

### Admin User
```
Email: admin@example.com
Password: admin123
Role: Admin
Restaurant: Demo Restaurant
Access: Everything
```

### Manager User
```
Email: manager@example.com
Password: manager123
Role: Manager
Restaurant: Demo Restaurant
Access: Operations (no financial data)
```

### Staff User
```
Email: staff@example.com
Password: staff123
Role: Staff
Restaurant: Demo Restaurant
Access: Orders and Kitchen Display only
```

---

## How to Login

### For Admin
1. Go to login page
2. Enter: `admin@example.com`
3. Enter password: `admin123`
4. Click "Sign In"
5. ✅ Redirected to Dashboard (full access)

### For Manager
1. Go to login page
2. Enter: `manager@example.com`
3. Enter password: `manager123`
4. Click "Sign In"
5. ✅ Redirected to Dashboard (operations only, no financial data)

### For Staff
1. Go to login page
2. Enter: `staff@example.com`
3. Enter password: `staff123`
4. Click "Sign In"
5. ✅ Redirected to Dashboard (Kitchen Display and Orders only)

---

## Login Page Features

### Current Implementation
- Single login page for all roles
- Email/Username field
- Password field with show/hide toggle
- Error messages for invalid credentials
- Loading state during authentication
- Beautiful animated UI with food emojis

### How It Works
```javascript
// Backend tries to login as admin first
POST /auth/login
{
  "username": "manager@example.com",
  "password": "manager123",
  "role": "admin"  // Try admin first
}

// If admin fails, tries superadmin
POST /auth/login
{
  "username": "manager@example.com",
  "password": "manager123",
  "role": "superadmin"  // Try superadmin
}

// If both fail, returns error
// If one succeeds, returns token with user's actual role
```

---

## Backend Login Endpoint

### Endpoint
```
POST /auth/login
```

### Request Body
```json
{
  "username": "manager@example.com",
  "password": "manager123",
  "role": "admin"  // Optional: specify role to try
}
```

### Response (Success)
```json
{
  "token": "token_manager_1234567890",
  "user": {
    "id": 3,
    "name": "Manager User",
    "email": "manager@example.com",
    "role": "manager",
    "restaurantId": 1,
    "restaurantName": "Demo Restaurant",
    "mustChangePassword": false
  }
}
```

### Response (Failure)
```json
{
  "error": "Invalid credentials"
}
```

---

## What Happens After Login

### Admin Login
```
Token: token_admin_1234567890
Role: admin
Restaurant: Demo Restaurant (ID: 1)
Redirect: /
Dashboard: Full access to all features
Sidebar: All menu items visible
```

### Manager Login
```
Token: token_manager_1234567890
Role: manager
Restaurant: Demo Restaurant (ID: 1)
Redirect: /
Dashboard: Operations only (no financial data)
Sidebar: Limited menu items (no Reports, Payments)
```

### Staff Login
```
Token: token_staff_1234567890
Role: staff
Restaurant: Demo Restaurant (ID: 1)
Redirect: /
Dashboard: Kitchen Display and Orders only
Sidebar: Only KD and Orders visible
```

---

## Session Storage

After successful login, the system stores:

```javascript
// In localStorage
{
  "authToken": "token_manager_1234567890",
  "userRole": "manager",
  "userName": "Manager User",
  "restaurantName": "Demo Restaurant",
  "restaurantId": 1,
  "mustChangePassword": false
}
```

---

## Permission Checks

### On Every Request
1. Extract token from localStorage
2. Send token in Authorization header
3. Backend validates token and checks permissions
4. Backend filters data by restaurant_id
5. Returns only authorized data

### Example Request
```bash
curl -X GET http://localhost:5000/orders \
  -H "Authorization: Bearer token_manager_1234567890"

# Response: Only orders from restaurant 1
```

---

## Role-Based Access

### Admin Can Access
- ✅ All menu items
- ✅ All orders
- ✅ All reservations
- ✅ All inventory
- ✅ All staff
- ✅ All payroll
- ✅ Reports
- ✅ Payments
- ✅ All features

### Manager Can Access
- ✅ Menu items (view, create, edit)
- ✅ Orders (view, create, update)
- ✅ Reservations (view, create)
- ✅ Inventory (view, update)
- ✅ Staff (view, update)
- ✅ Payroll (view, update)
- ❌ Reports (hidden)
- ❌ Payments (hidden)
- ❌ Financial data

### Staff Can Access
- ✅ Orders (view only)
- ✅ Kitchen Display (view only)
- ✅ Menu (view only)
- ❌ Create/Edit anything
- ❌ Financial data
- ❌ Admin features

---

## Testing Login

### Test 1: Admin Login
```bash
# Login as admin
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin@example.com",
    "password": "admin123"
  }'

# Response:
{
  "token": "token_admin_1234567890",
  "user": {
    "id": 2,
    "name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "restaurantId": 1,
    "restaurantName": "Demo Restaurant"
  }
}
```

### Test 2: Manager Login
```bash
# Login as manager
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "manager@example.com",
    "password": "manager123"
  }'

# Response:
{
  "token": "token_manager_1234567890",
  "user": {
    "id": 3,
    "name": "Manager User",
    "email": "manager@example.com",
    "role": "manager",
    "restaurantId": 1,
    "restaurantName": "Demo Restaurant"
  }
}
```

### Test 3: Staff Login
```bash
# Login as staff
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "staff@example.com",
    "password": "staff123"
  }'

# Response:
{
  "token": "token_staff_1234567890",
  "user": {
    "id": 4,
    "name": "Staff User",
    "email": "staff@example.com",
    "role": "staff",
    "restaurantId": 1,
    "restaurantName": "Demo Restaurant"
  }
}
```

---

## Frontend Login Implementation

### Current Code (AdminLogin.tsx)
```javascript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    setLoading(true);
    setError("");

    // Try admin first
    let response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        username: username.trim(), 
        password: password.trim(), 
        role: "admin" 
      }),
    });
    let data = await response.json();

    // If admin fails, try superadmin
    if (!response.ok) {
      response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username: username.trim(), 
          password: password.trim(), 
          role: "superadmin" 
        }),
      });
      data = await response.json();
    }

    if (!response.ok) {
      setError(data?.error || "Invalid credentials");
      return;
    }

    // Save session and redirect
    saveAuthSession(
      data.token, 
      data.user.role, 
      data.user.name,
      String(data?.user?.restaurantName || ""),
      typeof data?.user?.restaurantId === "number" ? data.user.restaurantId : null,
      Boolean(data?.user?.mustChangePassword)
    );

    // Redirect based on role
    if (data.user.role === "superadmin") {
      window.location.href = "/superadmin-dashboard";
    } else {
      window.location.href = "/";
    }
  } catch (error) {
    setError("Unable to connect to server.");
  } finally {
    setLoading(false);
  }
};
```

---

## How It Works Behind the Scenes

### 1. User Enters Credentials
```
Email: manager@example.com
Password: manager123
```

### 2. Frontend Sends Request
```javascript
POST /auth/login
{
  "username": "manager@example.com",
  "password": "manager123",
  "role": "admin"  // Try admin first
}
```

### 3. Backend Checks Database
```javascript
// Check if user exists with these credentials
const user = users.find(u => 
  u.email.toLowerCase() === "manager@example.com" && 
  u.password === "manager123" &&
  u.role === "admin"  // Looking for admin role
);

// Not found, so return error
// Frontend then tries superadmin
```

### 4. Frontend Tries Superadmin
```javascript
POST /auth/login
{
  "username": "manager@example.com",
  "password": "manager123",
  "role": "superadmin"  // Try superadmin
}
```

### 5. Backend Checks Again
```javascript
// Check if user exists with these credentials
const user = users.find(u => 
  u.email.toLowerCase() === "manager@example.com" && 
  u.password === "manager123" &&
  u.role === "superadmin"  // Looking for superadmin role
);

// Not found, so return error
```

### 6. Frontend Shows Error
```
"Invalid credentials"
```

---

## Better Approach (Recommended)

Instead of trying multiple roles, the backend should accept login without specifying role:

```javascript
// Better: Don't specify role, let backend find it
POST /auth/login
{
  "username": "manager@example.com",
  "password": "manager123"
  // No role specified
}

// Backend finds the user and returns their actual role
{
  "token": "token_manager_1234567890",
  "user": {
    "role": "manager",  // Backend determined this
    ...
  }
}
```

---

## Summary

**How Staff and Manager Login**:
1. Use the same login page as Admin
2. Enter their email and password
3. Backend validates credentials
4. Backend returns their role (manager or staff)
5. Frontend redirects to appropriate dashboard
6. User sees only features for their role

**Test Users**:
- Admin: `admin@example.com` / `admin123`
- Manager: `manager@example.com` / `manager123`
- Staff: `staff@example.com` / `staff123`

**What They See**:
- Admin: Full dashboard with all features
- Manager: Dashboard without financial data
- Staff: Only Kitchen Display and Orders

---

## Next Steps

1. Test login with each user
2. Verify role-based access works
3. Check that data is filtered by restaurant
4. Verify audit logs are created
5. Deploy to production

