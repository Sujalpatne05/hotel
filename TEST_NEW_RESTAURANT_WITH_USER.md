# Test: Create New Restaurant + Add User

**Goal**: Create a new restaurant, then add a user for that restaurant, and test login

**Time**: 10 minutes

---

## Step 1: Login as Super Admin

1. Open browser: http://localhost:8080
2. Click "Admin Login"
3. Enter:
   - Email: `superadmin@restrohub.local`
   - Password: `super123`
4. Click "Sign In"

**Expected**: ✅ Redirected to Super Admin Dashboard

---

## Step 2: Create New Restaurant

1. Go to "Restaurants" section
2. Click "Add Restaurant" button
3. Fill in the form:
   - **Name**: "Test Pizza House"
   - **Owner**: "Your Name"
   - **City**: "Your City"
4. Click "Create"

**Expected**:
- ✅ Restaurant created
- ✅ Success message shown
- ✅ Restaurant appears in list
- ✅ Auto-created admin user: `admin4@restrohub.local` / `admin4123`

**Backend logs should show**:
```
[RESTAURANT] ✅ Created restaurant: Test Pizza House (ID: 4)
[RESTAURANT] ✅ Created admin account: admin4@restrohub.local / admin4123
[RESTAURANT] ✅ Saved restaurants to file
[USERS] ✅ Users saved to file
```

---

## Step 3: Add New User for This Restaurant

1. Go to "User Access Control" section
2. Click "Add User" button
3. Fill in the form:
   - **Name**: "Pizza Manager"
   - **Email**: `pizzamgr@example.com`
   - **Password**: `pizza123`
   - **Role**: "Manager"
   - **Restaurant**: "Test Pizza House" (select from dropdown)
4. Click "Create"

**Expected**:
- ✅ User created
- ✅ Success message shown
- ✅ User appears in list

**Backend logs should show**:
```
[USER] ✅ Created user: pizzamgr@example.com (manager) for restaurant 4
[USERS] ✅ Users saved to file
```

---

## Step 4: Logout

1. Click profile icon (top right)
2. Click "Logout"

**Expected**: ✅ Redirected to login page

---

## Step 5: Test Login with New User

1. Click "Admin Login"
2. Enter:
   - Email: `pizzamgr@example.com`
   - Password: `pizza123`
3. Click "Sign In"

**Expected**:
- ✅ Login succeeds
- ✅ Redirected to Dashboard
- ✅ Dashboard shows "Test Pizza House" as restaurant name
- ✅ User sees only Test Pizza House data

---

## Step 6: Verify Data Isolation

1. Go to Menu page
2. Open DevTools (F12) → Network tab
3. Look for GET `/menu` request
4. Check Response tab

**Expected Response**:
```json
[
  { id: 1, restaurant_id: 4, name: "...", ... },
  { id: 2, restaurant_id: 4, name: "...", ... }
]
```

**Key**: All items have `restaurant_id: 4` (Test Pizza House)

---

## Step 7: Test Auto-Created Admin User

1. Logout
2. Click "Admin Login"
3. Enter:
   - Email: `admin4@restrohub.local`
   - Password: `admin4123`
4. Click "Sign In"

**Expected**:
- ✅ Login succeeds
- ✅ Redirected to Dashboard
- ✅ Dashboard shows "Test Pizza House"
- ✅ Admin user can see all restaurant data

---

## Step 8: Restart Server & Test Persistence

1. Stop backend: Ctrl+C
2. Start backend: `npm run dev`
3. Wait for server to start
4. Try login with new user:
   - Email: `pizzamgr@example.com`
   - Password: `pizza123`

**Expected**:
- ✅ Login still works
- ✅ User data persisted
- ✅ Restaurant data persisted

---

## Verification Checklist

✅ Restaurant created and saved
✅ Auto-created admin user works
✅ New user created and saved
✅ New user can login
✅ New user sees only their restaurant's data
✅ Data persists after server restart
✅ Both users can login after restart

---

## What Gets Saved

### In `server/data/restaurants.json`:
```json
{
  "id": 4,
  "name": "Test Pizza House",
  "owner": "Your Name",
  "city": "Your City",
  "status": "Active",
  "plan": "Standard",
  "logo": null,
  "created_at": "2026-03-27T..."
}
```

### In `server/data/users.json`:
```json
{
  "id": 8,
  "name": "Pizza Manager",
  "email": "pizzamgr@example.com",
  "password": "pizza123",
  "role": "manager",
  "restaurant_id": 4,
  "restaurant_name": "Test Pizza House",
  "is_active": true,
  "must_change_password": false
}
```

---

## Summary

This test verifies:
1. ✅ Restaurant creation works
2. ✅ Auto-created admin user works
3. ✅ Manual user creation works
4. ✅ Data isolation works (users see only their restaurant)
5. ✅ Data persistence works (survives server restart)
6. ✅ Multi-tenant system works correctly

**Everything should work!** 🎉

---
