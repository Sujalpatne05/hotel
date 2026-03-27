# 🧪 Quick Testing Guide - Demo Users

**Frontend**: http://localhost:8080
**Backend**: http://localhost:5000

---

## TEST 1: Login as Super Admin

**Purpose**: Access Super Admin Dashboard to create new restaurants and users

```
Email: superadmin@restrohub.local
Password: super123
```

**Steps**:
1. Open http://localhost:8080
2. Click "Admin Login"
3. Enter credentials above
4. Click "Sign In"

**Expected**: ✅ Redirected to Super Admin Dashboard

---

## TEST 2: Login as Admin User

**Purpose**: Test admin access to Demo Restaurant

```
Email: admin@example.com
Password: admin123
```

**Steps**:
1. Open http://localhost:8080
2. Click "Admin Login"
3. Enter credentials above
4. Click "Sign In"

**Expected**: 
- ✅ Redirected to Dashboard
- ✅ Dashboard shows "Demo Restaurant"
- ✅ Admin can see all restaurant data

---

## TEST 3: Login as Manager User

**Purpose**: Test manager access (limited permissions)

```
Email: manager@example.com
Password: manager123
```

**Steps**:
1. Open http://localhost:8080
2. Click "Admin Login"
3. Enter credentials above
4. Click "Sign In"

**Expected**:
- ✅ Redirected to Dashboard
- ✅ Dashboard shows "Demo Restaurant"
- ✅ Manager sees limited menu options (no admin features)

---

## TEST 4: Login as Staff User

**Purpose**: Test staff access (most limited permissions)

```
Email: staff@example.com
Password: staff123
```

**Steps**:
1. Open http://localhost:8080
2. Click "Admin Login"
3. Enter credentials above
4. Click "Sign In"

**Expected**:
- ✅ Redirected to Dashboard
- ✅ Dashboard shows "Demo Restaurant"
- ✅ Staff sees only basic features

---

## TEST 5: Login as SS Manager

**Purpose**: Test another manager account

```
Email: ss
Password: ss
```

**Steps**:
1. Open http://localhost:8080
2. Click "Admin Login"
3. Enter credentials above
4. Click "Sign In"

**Expected**:
- ✅ Redirected to Dashboard
- ✅ Dashboard shows "Demo Restaurant"
- ✅ Manager sees same features as Manager User

---

## TEST 6: Create New Restaurant (Super Admin Only)

**Purpose**: Test restaurant creation and auto-admin user creation

**Steps**:
1. Login as Super Admin
2. Go to "Restaurants" section
3. Click "Add Restaurant"
4. Fill form:
   - Name: "Test Pizza House"
   - Owner: "Your Name"
   - City: "Your City"
5. Click "Create"

**Expected**:
- ✅ Restaurant created (ID: 2)
- ✅ Auto-admin created: `admin2@restrohub.local` / `admin2123`
- ✅ Data saved to JSON file
- ✅ Success message shown

---

## TEST 7: Create New User (Super Admin Only)

**Purpose**: Test user creation for new restaurant

**Steps**:
1. Login as Super Admin
2. Go to "User Access Control"
3. Click "Add User"
4. Fill form:
   - Name: "Pizza Manager"
   - Email: `pizzamgr@example.com`
   - Password: `pizza123`
   - Role: Manager
   - Restaurant: Test Pizza House
5. Click "Create"

**Expected**:
- ✅ User created (ID: 8)
- ✅ Data saved to JSON file
- ✅ Success message shown

---

## TEST 8: Test Data Isolation

**Purpose**: Verify users see only their restaurant's data

**Steps**:
1. Login as `pizzamgr@example.com` / `pizza123`
2. Go to Menu page
3. Open DevTools (F12) → Network tab
4. Look for GET `/menu` request
5. Check Response tab

**Expected Response**:
```json
[
  { id: 1, restaurant_id: 2, name: "...", ... },
  { id: 2, restaurant_id: 2, name: "...", ... }
]
```

**Key**: All items have `restaurant_id: 2` (Test Pizza House)

---

## TEST 9: Test Persistence

**Purpose**: Verify data survives server restart

**Steps**:
1. Stop backend: Ctrl+C in terminal
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

## TESTING CHECKLIST

### Demo Users
- [ ] Super Admin login works
- [ ] Admin User login works
- [ ] Manager User login works
- [ ] Staff User login works
- [ ] SS Manager login works

### New Restaurant & User
- [ ] Create new restaurant works
- [ ] Auto-admin user created
- [ ] Create new user works
- [ ] New user can login
- [ ] Data isolation works
- [ ] Data persists after restart

---

## SUMMARY

**5 Demo Users Ready to Test**:
1. Super Admin - Full system access
2. Admin User - Full restaurant access
3. Manager User - Limited restaurant access
4. Staff User - Basic access
5. SS Manager - Manager access

**All users belong to Demo Restaurant (ID: 1)**

**Next IDs when creating new data**:
- Next Restaurant ID: 2
- Next User ID: 8

---

## QUICK REFERENCE

| User | Email | Password | Role | Restaurant |
|------|-------|----------|------|------------|
| Super Admin | `superadmin@restrohub.local` | `super123` | superadmin | None |
| Admin | `admin@example.com` | `admin123` | admin | Demo (1) |
| Manager | `manager@example.com` | `manager123` | manager | Demo (1) |
| Staff | `staff@example.com` | `staff123` | staff | Demo (1) |
| SS Manager | `ss` | `ss` | manager | Demo (1) |

---

**Ready to test!** 🚀

---
