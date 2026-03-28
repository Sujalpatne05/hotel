# Manual Testing Guide - userId Fix

## Quick Test (5 minutes)

### Step 1: Open Browser DevTools
1. Go to http://localhost:8080
2. Press `F12` to open DevTools
3. Go to **Application** tab → **LocalStorage**

### Step 2: Login as Admin
1. Email: `admin@example.com`
2. Password: `admin123`
3. Click Sign In
4. In DevTools LocalStorage, look for `userId` key
5. **Expected**: `userId = "2"`

### Step 3: Create an Order
1. Click on **POS Billing** in sidebar
2. Select **Table 1** from dropdown
3. Click **Add** on "Butter Chicken"
4. Click **Add** on "Garlic Naan"
5. Click **Place Order**
6. Check DevTools **Network** tab
7. Look for **POST /orders** request
8. Click on it → **Request** tab
9. **Expected in body**: `"userId":2`

### Step 4: Verify Order Created
1. In Network tab, look at **Response** for the POST request
2. **Expected**: `"user_id":2` in response

### Step 5: Logout and Test Manager
1. Click **Logout** (or refresh and login again)
2. Email: `manager@example.com`
3. Password: `manager123`
4. Check LocalStorage → `userId` should be `"3"`
5. Go to POS Billing
6. Select **Table 2**
7. Add items and place order
8. Check Network tab → POST /orders
9. **Expected**: `"userId":3` in request, `"user_id":3` in response

### Step 6: Test Staff
1. Logout and login as staff
2. Email: `staff@example.com`
3. Password: `staff123`
4. Check LocalStorage → `userId` should be `"4"`
5. Create an order
6. **Expected**: `"userId":4` in request, `"user_id":4` in response

---

## What to Look For

### ✅ PASS Indicators
- LocalStorage shows correct userId for each user
- Network requests show correct userId in body
- Order responses show correct user_id
- Different users have different user_ids

### ❌ FAIL Indicators
- All users show userId: 1
- Network requests show userId: 1
- Order responses show user_id: 1
- userId not in LocalStorage

---

## Browser DevTools Navigation

### To Check LocalStorage
1. Press F12
2. Click **Application** tab
3. Left sidebar → **LocalStorage**
4. Click **http://localhost:8080**
5. Look for `userId` key

### To Check Network Requests
1. Press F12
2. Click **Network** tab
3. Create an order
4. Look for **POST /orders** request
5. Click on it
6. Click **Request** tab to see body
7. Click **Response** tab to see response

---

## Expected Values

| User | Email | Password | Expected userId |
|------|-------|----------|-----------------|
| Admin | admin@example.com | admin123 | 2 |
| Manager | manager@example.com | manager123 | 3 |
| Staff | staff@example.com | staff123 | 4 |

---

## Troubleshooting

### userId not showing in LocalStorage
- Hard refresh: `Ctrl+Shift+R`
- Clear cache: `Ctrl+Shift+Delete`
- Check browser console for errors

### Network tab not showing requests
- Make sure Network tab is open BEFORE creating order
- Refresh page if needed
- Check for any error messages

### Orders still showing user_id: 1
- Check if code changes were applied
- Verify imports in Billing.tsx
- Check session.ts has getStoredUserId function
- Restart dev server

---

## Success Criteria

✅ **Test Passes If:**
1. Each user has different userId in LocalStorage
2. Each order request has correct userId
3. Each order response has correct user_id
4. Different users create orders with different user_ids

---

## Time Estimate
- Full manual test: 5-10 minutes
- Quick verification: 2-3 minutes

