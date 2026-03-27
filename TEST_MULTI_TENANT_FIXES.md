# Test Multi-Tenant Fixes - Quick Guide

**Status**: Ready to Test
**Date**: March 27, 2026

---

## Quick Test Steps

### Step 1: Start the Backend
```bash
npm run dev
```
Backend should start on `http://localhost:5000`

---

### Step 2: Test ABC Hotel Admin Login

1. Open browser and go to `http://localhost:3000`
2. Click "Admin Login"
3. Enter credentials:
   - Email: `abc@example.com`
   - Password: `abc123`
4. Click "Sign In"

**Expected Results**:
- ✅ Login succeeds
- ✅ Redirected to Dashboard
- ✅ Dashboard shows "ABC Hotel" as restaurant name
- ✅ Token in localStorage includes restaurant_id: 3

**How to verify token**:
1. Open Browser DevTools (F12)
2. Go to Application → Local Storage
3. Look for `restaurantId` - should be `3`

---

### Step 3: Test Data Isolation - Menu

1. While logged in as ABC Hotel admin
2. Go to Menu page
3. Check the menu items displayed

**Expected Results**:
- ✅ Only ABC Hotel menu items shown
- ✅ No Demo Restaurant items visible
- ✅ No Mitu Cafe items visible

**Backend Check**:
1. Open DevTools → Network tab
2. Go to Menu page
3. Look for GET `/menu` request
4. Response should only contain items with `restaurant_id: 3`

---

### Step 4: Test Data Isolation - Orders

1. While logged in as ABC Hotel admin
2. Go to Orders page
3. Check the orders displayed

**Expected Results**:
- ✅ Only ABC Hotel orders shown
- ✅ No Demo Restaurant orders visible
- ✅ No Mitu Cafe orders visible

**Backend Check**:
1. Open DevTools → Network tab
2. Go to Orders page
3. Look for GET `/orders` request
4. Response should only contain orders with `restaurant_id: 3`

---

### Step 5: Test Data Isolation - Deliveries

1. While logged in as ABC Hotel admin
2. Go to Deliveries page (if available)
3. Check the deliveries displayed

**Expected Results**:
- ✅ Only ABC Hotel deliveries shown
- ✅ No Demo Restaurant deliveries visible
- ✅ No Mitu Cafe deliveries visible

**Backend Check**:
1. Open DevTools → Network tab
2. Go to Deliveries page
3. Look for GET `/deliveries` request
4. Response should only contain deliveries with `restaurant_id: 3`

---

### Step 6: Test Data Isolation - Reports

1. While logged in as ABC Hotel admin
2. Go to Reports page
3. Check the revenue and order counts

**Expected Results**:
- ✅ Revenue shows only ABC Hotel orders
- ✅ Order count shows only ABC Hotel orders
- ✅ Customer count shows only ABC Hotel customers

**Backend Check**:
1. Open DevTools → Network tab
2. Go to Reports page
3. Look for GET `/reports/overview` request
4. Response should show only ABC Hotel data

---

### Step 7: Test Mitu Cafe Admin Login

1. Logout from ABC Hotel admin
2. Go to login page
3. Enter credentials:
   - Email: `mitu@example.com`
   - Password: `mitu123`
4. Click "Sign In"

**Expected Results**:
- ✅ Login succeeds
- ✅ Redirected to Dashboard
- ✅ Dashboard shows "Mitu Cafe" as restaurant name
- ✅ Token in localStorage includes restaurant_id: 2

---

### Step 8: Test Data Isolation - Mitu Cafe

1. While logged in as Mitu Cafe admin
2. Go to Menu page
3. Check the menu items displayed

**Expected Results**:
- ✅ Only Mitu Cafe menu items shown
- ✅ No ABC Hotel items visible
- ✅ No Demo Restaurant items visible

---

### Step 9: Test Permission Checks - Staff User

1. Logout from Mitu Cafe admin
2. Go to login page
3. Enter credentials:
   - Email: `staff@example.com`
   - Password: `staff123`
4. Click "Sign In"

**Expected Results**:
- ✅ Login succeeds
- ✅ Redirected to Orders page (staff can only see orders)
- ✅ Cannot access Reports page (staff doesn't have permission)

**How to test**:
1. Try to navigate to Reports page manually
2. Should see error or be redirected

---

### Step 10: Test Super Admin Access

1. Logout from staff user
2. Go to login page
3. Enter credentials:
   - Email: `superadmin@restrohub.local`
   - Password: `super123`
4. Click "Sign In"

**Expected Results**:
- ✅ Login succeeds
- ✅ Redirected to Super Admin Dashboard
- ✅ Can see all restaurants
- ✅ Can create new users

---

## Troubleshooting

### Issue: Login fails with 401 Unauthorized
**Solution**:
1. Check backend is running: `npm run dev`
2. Check credentials are correct
3. Check browser console for error messages
4. Verify token format in backend logs

### Issue: Data from other restaurants visible
**Solution**:
1. Check token includes restaurant_id
2. Check backend is filtering by restaurant_id
3. Check Network tab to see API response
4. Verify restaurant_id in response matches user's restaurant

### Issue: Permission denied errors
**Solution**:
1. Check user role has permission for that resource
2. Check permission middleware is working
3. Check browser console for error messages
4. Verify user role in localStorage

---

## Expected Test Results Summary

| Test | Expected | Status |
|------|----------|--------|
| ABC Hotel login | Success | ✅ |
| ABC Hotel sees only ABC data | Yes | ✅ |
| Mitu Cafe login | Success | ✅ |
| Mitu Cafe sees only Mitu data | Yes | ✅ |
| Staff can see orders | Yes | ✅ |
| Staff cannot see reports | No | ✅ |
| Super Admin can see all | Yes | ✅ |
| Cross-restaurant data visible | No | ✅ |
| Permission checks work | Yes | ✅ |
| Audit logs created | Yes | ✅ |

---

## Test Users Available

| Email | Password | Role | Restaurant | ID |
|-------|----------|------|------------|-----|
| superadmin@restrohub.local | super123 | Super Admin | None | 1 |
| admin@example.com | admin123 | Admin | Demo Restaurant | 2 |
| manager@example.com | manager123 | Manager | Demo Restaurant | 3 |
| staff@example.com | staff123 | Staff | Demo Restaurant | 4 |
| mitu@example.com | mitu123 | Admin | Mitu Cafe | 5 |
| abc@example.com | abc123 | Admin | ABC Hotel | 6 |

---

## Backend Logs to Check

When testing, check backend console for:

1. **Login logs**:
   ```
   [LOGIN] ✅ Login successful for user: abc@example.com
   ```

2. **Token generation**:
   ```
   Token format: token_admin_3_1711507200000
   ```

3. **Permission checks**:
   ```
   [PERMISSION] ✅ Allowed: admin can GET menu
   ```

4. **Data filtering**:
   ```
   [PERMISSION] ✅ Allowed: admin can GET deliveries
   Filtered 2 deliveries for restaurant 3
   ```

5. **Audit logs**:
   ```
   [AUDIT] User admin@example.com READ menu (2 items)
   ```

---

## Success Criteria

All tests pass when:
- ✅ Users can login with correct credentials
- ✅ Token includes restaurant_id
- ✅ Users see only their restaurant's data
- ✅ Users cannot see other restaurants' data
- ✅ Permission checks prevent unauthorized access
- ✅ Audit logs track all actions
- ✅ No cross-restaurant data leakage

---

## Next Steps After Testing

1. If all tests pass: System is ready for production
2. If any test fails: Check backend logs and fix the issue
3. Run full test suite to verify no regressions
4. Deploy to production

---
