# Super Admin User Creation & Login Flow

**Status**: Fixed and Ready to Test
**Date**: March 27, 2026

---

## Overview

Super Admin can now create users through the UI, and those users can immediately login with their credentials.

---

## Step-by-Step Flow

### Step 1: Login as Super Admin
```
Email: superadmin@restrohub.local
Password: super123
```
- Go to `/superadmin-login`
- Enter credentials
- Click "Sign In"
- ✅ Redirected to Super Admin Dashboard

### Step 2: Navigate to User Access Control
- Click "User Access Control" in the sidebar
- You'll see the list of existing users
- Click "Add User" button (top right)

### Step 3: Create New User for Mitu Cafe
Fill in the form:
```
Full Name: Mitu Admin
Email (Login ID): mitu@example.com
Role: Admin (Full Access)
Restaurant: Mitu Cafe
Temporary Password: mitu123
```

Click "Create User"

**Response**: "Admin created. Temporary credentials dispatched (demo queue)."

### Step 4: Logout from Super Admin
- Click logout or go to `/`

### Step 5: Login as the New User
```
Email: mitu@example.com
Password: mitu123
```
- Go to login page (`/`)
- Enter the credentials
- Click "Sign In"
- ✅ Redirected to Dashboard with full access to Mitu Cafe

---

## What Happens Behind the Scenes

### User Creation (Super Admin)
```
POST /superadmin/users
{
  "name": "Mitu Admin",
  "email": "mitu@example.com",
  "role": "admin",
  "restaurantId": 2,
  "temporaryPassword": "mitu123"
}
```

**Backend**:
1. Validates all required fields
2. Checks if restaurant exists (Mitu Cafe - ID: 2)
3. Checks if user with this email already exists
4. Creates new user with:
   - `must_change_password: true` (flag set)
   - `is_active: true`
   - `password: "mitu123"` (stored as-is)
5. Adds user to `users` array
6. Returns success response

**Response**:
```json
{
  "id": 5,
  "name": "Mitu Admin",
  "email": "mitu@example.com",
  "role": "admin",
  "restaurant_id": 2,
  "restaurant_name": "Mitu Cafe",
  "is_active": true,
  "must_change_password": true
}
```

### User Login
```
POST /auth/login
{
  "username": "mitu@example.com",
  "password": "mitu123"
}
```

**Backend**:
1. Looks for user with matching email and password
2. Finds the user created above
3. Returns token with `mustChangePassword: true`

**Response**:
```json
{
  "token": "token_admin_1711507200000",
  "user": {
    "id": 5,
    "name": "Mitu Admin",
    "email": "mitu@example.com",
    "role": "admin",
    "restaurantId": 2,
    "restaurantName": "Mitu Cafe",
    "mustChangePassword": true
  }
}
```

### Frontend Behavior
1. Saves token and user info to localStorage
2. Detects `mustChangePassword: true`
3. Redirects to password change page (if implemented)
4. Or redirects to dashboard (current behavior)
5. User can now access Mitu Cafe dashboard

---

## Testing Checklist

- [ ] Login as Super Admin: `superadmin@restrohub.local` / `super123`
- [ ] Navigate to "User Access Control"
- [ ] Click "Add User"
- [ ] Fill in form with:
  - Name: `Test User`
  - Email: `test@example.com`
  - Role: `Manager`
  - Restaurant: `Mitu Cafe`
  - Password: `test123`
- [ ] Click "Create User"
- [ ] See success message
- [ ] Logout
- [ ] Login with new credentials: `test@example.com` / `test123`
- [ ] ✅ Should see Mitu Cafe dashboard

---

## Available Restaurants

Currently available restaurants:
1. **Demo Restaurant** (ID: 1)
2. **Mitu Cafe** (ID: 2)

To add more restaurants, edit the `restaurants` array in `server/mock-backend.mjs`.

---

## User Roles

### Admin
- Full access to all features
- Can view all data
- Can create/edit/delete items
- Can access reports and payments

### Manager
- Operations access (no financial data)
- Can view orders, reservations, inventory
- Can manage staff
- Cannot access reports or payments

### Staff
- Limited access
- Can view orders and kitchen display
- Cannot create or edit items
- Cannot access financial data

---

## Password Management

### Current Implementation
- Users created with `must_change_password: true`
- Frontend should redirect to password change page
- After password change, `must_change_password` becomes `false`

### Future Enhancement
- Implement password change endpoint
- Enforce password change on first login
- Add password strength validation

---

## Troubleshooting

### User Can't Login After Creation
**Problem**: Created user but login fails with "Invalid credentials"

**Solution**:
1. Check email is spelled correctly (case-insensitive)
2. Check password matches exactly (case-sensitive)
3. Check restaurant exists
4. Check user is active (not deactivated)
5. Check backend logs for errors

### User Sees Wrong Restaurant
**Problem**: User logs in but sees wrong restaurant data

**Solution**:
1. Check `restaurant_id` is correct in user object
2. Check `restaurant_name` matches the restaurant
3. Verify backend is filtering data by `restaurant_id`

### Can't Select Restaurant in Add User Form
**Problem**: Restaurant dropdown is empty

**Solution**:
1. Check restaurants exist in `server/mock-backend.mjs`
2. Check `/superadmin/restaurants` endpoint returns data
3. Refresh the page

---

## Next Steps

1. Test user creation flow
2. Test login with newly created user
3. Verify role-based access works
4. Implement password change page (Phase 4)
5. Add email notification for new users (Phase 4)

