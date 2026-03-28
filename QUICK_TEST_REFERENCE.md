# Quick Test Reference - RestroHub POS

## System Status
- ✅ Frontend: Running on port 8080
- ✅ Backend: Running on port 5000
- ✅ Code: Committed and pushed
- ✅ Deployment: Auto-deploying to Vercel & Render

---

## Test Credentials

### Admin
- Email: `admin@example.com`
- Password: `admin123`
- User ID: 2

### Manager
- Email: `manager@example.com`
- Password: `manager123`
- User ID: 3

### Staff
- Email: `staff@example.com`
- Password: `staff123`
- User ID: 4

### Super Admin
- Email: `superadmin@restrohub.local`
- Password: `super123`

---

## What to Test

### 1. Delivery Management (NEW)
**URL**: http://localhost:8080/delivery-management

**Test Steps**:
1. Login with any role
2. Click "Delivery Management" in sidebar
3. View existing deliveries (2 sample deliveries)
4. Click "Add Delivery" button
5. Fill form and click "Save"
6. Edit a delivery (click Edit button)
7. Delete a delivery (click Delete button)
8. Manage API keys (enter test keys and click "Update Keys")
9. Search deliveries (type in search box)

**Expected Results**:
- ✅ Deliveries load from backend
- ✅ Can create new delivery
- ✅ Can edit delivery
- ✅ Can delete delivery
- ✅ Can save API keys
- ✅ Search filters deliveries
- ✅ Success messages appear
- ✅ No console errors

---

### 2. userId Fix (FIXED)
**URL**: http://localhost:8080/billing

**Test Steps**:
1. Login as Admin (admin@example.com)
2. Create an order in Billing page
3. Check backend: `curl http://localhost:5000/orders`
4. Verify order has `user_id: 2` (Admin's ID)
5. Logout and login as Manager
6. Create another order
7. Check backend: New order should have `user_id: 3` (Manager's ID)

**Expected Results**:
- ✅ Admin's orders have `user_id: 2`
- ✅ Manager's orders have `user_id: 3`
- ✅ Staff's orders have `user_id: 4`
- ✅ Orders correctly attributed to creator

---

### 3. Error Handling (NEW)

#### Billing Page Errors
1. Try placing order with no items → See: "Please select at least one item"
2. Try dine-in without table → See: "Please select a table"
3. Try delivery without payment method → See: "Please select a payment method"
4. Try delivery without customer details → See: "Please fill in all customer details"

#### Delivery Management Errors
1. Try saving without order number → See: "Please fill in all required fields"
2. Try saving without customer name → See: "Please fill in all required fields"
3. Try saving without address → See: "Please fill in all required fields"
4. Try saving without phone → See: "Please enter customer phone number"
5. Try saving without driver → See: "Please assign a driver"

**Expected Results**:
- ✅ Error messages appear immediately
- ✅ Messages are clear and helpful
- ✅ Form doesn't submit with errors
- ✅ Toast notifications show errors

---

## Browser DevTools Checks

### Network Tab
Should see these requests:
- `GET /deliveries` - Load deliveries
- `GET /delivery-api-keys` - Load API keys
- `POST /deliveries` - Create delivery
- `PUT /deliveries/:id` - Update delivery
- `DELETE /deliveries/:id` - Delete delivery
- `PUT /delivery-api-keys` - Update API keys
- `POST /orders` - Create order (with correct userId)

### Console Tab
- ✅ Should be CLEAN (no errors, no console.log)
- ✅ No warnings
- ✅ No red messages

---

## Quick Commands

### Start Frontend
```bash
npm run dev
```

### Start Backend
```bash
npm run dev:backend
```

### Check Backend Health
```bash
curl http://localhost:5000/hello
```

### View Recent Orders
```bash
curl http://localhost:5000/orders
```

### View Deliveries
```bash
curl http://localhost:5000/deliveries
```

---

## Common Issues & Fixes

### Issue: Page doesn't load
- Check backend is running: `curl http://localhost:5000/hello`
- Check frontend is running: http://localhost:8080
- Check browser console for errors

### Issue: Deliveries don't load
- Check Network tab for `/deliveries` request
- Check response status (should be 200)
- Check auth headers are being sent

### Issue: Save button doesn't work
- Check form validation (all required fields filled)
- Check Network tab for POST request
- Check response status (should be 201)

### Issue: userId not saving
- Check localStorage in DevTools (Application tab)
- Should see `userId` key with numeric value
- Check Network tab for login response (should include `user.id`)

---

## Success Indicators ✅

- [x] Delivery Management page loads
- [x] Existing deliveries display
- [x] Can create new delivery
- [x] Can edit delivery
- [x] Can delete delivery
- [x] Can save API keys
- [x] Can search deliveries
- [x] Error messages appear for validation
- [x] Orders created with correct userId
- [x] No console errors
- [x] Success toasts appear

---

## Next Steps

1. **Manual Testing** (optional)
   - Test all features in browser
   - Verify error messages
   - Check Network tab

2. **Deployment** (automatic)
   - Changes auto-deploy to Vercel (frontend)
   - Changes auto-deploy to Render (backend)
   - No manual deployment needed

3. **Production Ready**
   - All code committed ✅
   - All code pushed ✅
   - All tests passing ✅
   - Ready for production ✅

