# TODO #2 - userId Fix Testing Guide

## Test Scenario: Verify Orders Are Created with Correct user_id

### Prerequisites
- Backend running on port 5000 ✅
- Frontend running on port 8080
- Browser DevTools open (F12)

### Test Steps

#### Step 1: Login as Admin User
1. Go to http://localhost:8080
2. Login with:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Open DevTools → Application → LocalStorage
4. Verify `userId` is stored (should be `2` for admin)

#### Step 2: Create an Order as Admin
1. Navigate to POS Billing page
2. Select a table (e.g., Table 1)
3. Add items to order (e.g., Butter Chicken, Garlic Naan)
4. Click "Place Order"
5. Check Network tab → POST /orders request
6. Verify payload includes `userId: 2`

#### Step 3: Verify Order in Backend
1. Open DevTools → Network tab
2. Look for the POST /orders response
3. Verify the created order has `user_id: 2`

#### Step 4: Logout and Login as Manager
1. Logout (clear session)
2. Login with:
   - Email: `manager@example.com`
   - Password: `manager123`
3. Verify `userId` in LocalStorage is now `3`

#### Step 5: Create Order as Manager
1. Navigate to POS Billing
2. Select a table
3. Add items
4. Click "Place Order"
5. Verify Network tab shows `userId: 3` in request
6. Verify response shows `user_id: 3`

#### Step 6: Logout and Login as Staff
1. Logout
2. Login with:
   - Email: `staff@example.com`
   - Password: `staff123`
3. Verify `userId` in LocalStorage is `4`

#### Step 7: Create Order as Staff
1. Navigate to POS Billing
2. Select a table
3. Add items
4. Click "Place Order"
5. Verify Network tab shows `userId: 4`
6. Verify response shows `user_id: 4`

#### Step 8: Verify All Orders in Orders Page
1. Go to Orders page
2. Check Recent Orders section
3. Verify you see orders from different users:
   - Order from Admin (user_id: 2)
   - Order from Manager (user_id: 3)
   - Order from Staff (user_id: 4)

### Expected Results

✅ **PASS**: Each order has the correct user_id matching who created it
❌ **FAIL**: All orders still show user_id: 1

### Debug Checklist

If test fails:
1. Check browser console for errors
2. Verify session.ts has `getStoredUserId()` function
3. Verify LoginFixed.tsx passes userId to saveAuthSession()
4. Verify Billing.tsx imports and uses `getStoredUserId()`
5. Check Network tab to see actual request/response payloads
6. Hard refresh browser (Ctrl+Shift+R) to clear cache

### Test Results

| User | Expected user_id | Actual user_id | Status |
|------|------------------|-----------------|--------|
| Admin | 2 | ? | ? |
| Manager | 3 | ? | ? |
| Staff | 4 | ? | ? |

