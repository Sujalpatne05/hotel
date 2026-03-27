# 🚀 TESTING GUIDE - Multi-Tenant System

**Status**: ✅ Both servers running
- Frontend: http://localhost:8080
- Backend: http://localhost:5000

---

## QUICK SUMMARY

You have a **multi-tenant SaaS platform** where:
- **Super Admin** creates restaurants and manages users
- When a restaurant is created, an **admin user is automatically created** for it
- **Super Admin can create additional users** (Manager/Staff) for any restaurant
- Each user sees **ONLY their restaurant's data** (data isolation)
- All data **saves to JSON files** and persists across server restarts

---

## CURRENT STATE

### Existing Restaurants (3)
1. **Demo Restaurant** (ID: 1)
   - Admin: `admin@example.com` / `admin123`
   - Manager: `manager@example.com` / `manager123`
   - Staff: `staff@example.com` / `staff123`
   - Test User: `ss` / `ss` (Manager role)

2. **Mitu Cafe** (ID: 2)
   - Admin: `mitu@example.com` / `mitu123`

3. **ABC Hotel** (ID: 3)
   - Admin: `abc@example.com` / `abc123`

### Super Admin
- Email: `superadmin@restrohub.local`
- Password: `super123`

---

## TEST FLOW (10 minutes)

### STEP 1: Login as Super Admin
```
1. Open: http://localhost:8080
2. Click "Admin Login"
3. Enter:
   - Email: superadmin@restrohub.local
   - Password: super123
4. Click "Sign In"
```
**Expected**: ✅ Redirected to Super Admin Dashboard

---

### STEP 2: Create New Restaurant
```
1. Go to "Restaurants" section
2. Click "Add Restaurant" button
3. Fill form:
   - Name: "Test Pizza House"
   - Owner: "Your Name"
   - City: "Your City"
4. Click "Create"
```
**Expected**:
- ✅ Restaurant created
- ✅ Success message shown
- ✅ Restaurant appears in list
- ✅ Auto-created admin: `admin4@restrohub.local` / `admin4123`

**Backend logs**:
```
[RESTAURANT] ✅ Created restaurant: Test Pizza House (ID: 4)
[RESTAURANT] ✅ Created admin account: admin4@restrohub.local / admin4123
[RESTAURANT] ✅ Saved restaurants to file
[USERS] ✅ Users saved to file
```

---

### STEP 3: Add New User for This Restaurant
```
1. Go to "User Access Control" section
2. Click "Add User" button
3. Fill form:
   - Name: "Pizza Manager"
   - Email: pizzamgr@example.com
   - Password: pizza123
   - Role: Manager
   - Restaurant: Test Pizza House
4. Click "Create"
```
**Expected**:
- ✅ User created
- ✅ Success message shown
- ✅ User appears in list

**Backend logs**:
```
[USER] ✅ Created user: pizzamgr@example.com (manager) for restaurant 4
[USERS] ✅ Users saved to file
```

---

### STEP 4: Logout
```
1. Click profile icon (top right)
2. Click "Logout"
```
**Expected**: ✅ Redirected to login page

---

### STEP 5: Test Login with New User
```
1. Click "Admin Login"
2. Enter:
   - Email: pizzamgr@example.com
   - Password: pizza123
3. Click "Sign In"
```
**Expected**:
- ✅ Login succeeds
- ✅ Redirected to Dashboard
- ✅ Dashboard shows "Test Pizza House"
- ✅ User sees only Test Pizza House data

---

### STEP 6: Verify Data Isolation
```
1. Go to Menu page
2. Open DevTools (F12) → Network tab
3. Look for GET /menu request
4. Check Response tab
```
**Expected Response**:
```json
[
  { id: 1, restaurant_id: 4, name: "...", ... },
  { id: 2, restaurant_id: 4, name: "...", ... }
]
```
**Key**: All items have `restaurant_id: 4` (Test Pizza House)

---

### STEP 7: Test Auto-Created Admin User
```
1. Logout
2. Click "Admin Login"
3. Enter:
   - Email: admin4@restrohub.local
   - Password: admin4123
4. Click "Sign In"
```
**Expected**:
- ✅ Login succeeds
- ✅ Redirected to Dashboard
- ✅ Dashboard shows "Test Pizza House"
- ✅ Admin user can see all restaurant data

---

### STEP 8: Restart Server & Test Persistence
```
1. Stop backend: Ctrl+C in terminal
2. Start backend: npm run dev
3. Wait for server to start
4. Try login with new user:
   - Email: pizzamgr@example.com
   - Password: pizza123
```
**Expected**:
- ✅ Login still works
- ✅ User data persisted
- ✅ Restaurant data persisted

---

## EMAIL SPECIFICATIONS

✅ **No validation** - any email format accepted
✅ Can use simple emails: `ss`, `test`, `user`
✅ Can use full emails: `pizzamgr@example.com`, `manager@restaurant.com`
✅ System accepts whatever you enter

---

## VERIFICATION CHECKLIST

- [ ] Restaurant created and saved
- [ ] Auto-created admin user works
- [ ] New user created and saved
- [ ] New user can login
- [ ] New user sees only their restaurant's data
- [ ] Data persists after server restart
- [ ] Both users can login after restart

---

## WHAT GETS SAVED

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

## TROUBLESHOOTING

### Issue: Login fails
- Check email and password are correct
- Verify user was created in Super Admin panel
- Check backend logs for errors

### Issue: User sees wrong restaurant data
- Verify `restaurant_id` in token (DevTools → Application → Cookies)
- Check backend logs for permission errors
- Verify user's `restaurant_id` in `server/data/users.json`

### Issue: Data not persisting after restart
- Check `server/data/restaurants.json` exists
- Check `server/data/users.json` exists
- Verify backend logs show "Loaded restaurants from file"
- Verify backend logs show "Loaded users from file"

---

## SUMMARY

This test verifies:
1. ✅ Restaurant creation works
2. ✅ Auto-created admin user works
3. ✅ Manual user creation works
4. ✅ Data isolation works (users see only their restaurant)
5. ✅ Data persistence works (survives server restart)
6. ✅ Multi-tenant system works correctly

**Everything is ready to test!** 🎉

---
