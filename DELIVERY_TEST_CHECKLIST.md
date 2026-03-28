# Delivery Management - Test Checklist

## Pre-Test Setup
- [ ] Backend running on port 5000
- [ ] Frontend running on port 8080
- [ ] Logged in as admin@example.com / admin123
- [ ] Browser console open (F12)

## Test 1: Create Delivery Order
- [ ] Go to Billing page
- [ ] Click "Delivery" tab
- [ ] Add at least 2 items to cart
- [ ] Fill customer name: "Test Customer"
- [ ] Fill phone: "9876543210"
- [ ] Fill address: "Test Address"
- [ ] Select payment method
- [ ] Click "Place Order"
- [ ] See success message: "Order placed successfully!"
- [ ] No errors in console

## Test 2: Verify Delivery Appears
- [ ] Go to Delivery Management page
- [ ] Look for new delivery in table
- [ ] Verify order number (ORD-{id})
- [ ] Verify customer name: "Test Customer"
- [ ] Verify phone: "9876543210"
- [ ] Verify address: "Test Address"
- [ ] Verify partner: "In-House"
- [ ] Verify driver: "Unassigned"
- [ ] Verify status: "Pending"
- [ ] Verify amount matches order total

## Test 3: Edit Delivery
- [ ] Click "Edit" on the delivery
- [ ] Modal opens with delivery details
- [ ] Change driver to "Aman"
- [ ] Change status to "Dispatched"
- [ ] Click "Save"
- [ ] See success message
- [ ] Verify changes in table
- [ ] Driver now shows "Aman"
- [ ] Status now shows "Dispatched"

## Test 4: Delete Delivery
- [ ] Click "Delete" on a delivery
- [ ] Confirmation dialog appears
- [ ] Click "OK" to confirm
- [ ] See success message
- [ ] Delivery removed from table
- [ ] No errors in console

## Test 5: Search/Filter
- [ ] Type customer name in search box
- [ ] Results filter correctly
- [ ] Type order number in search box
- [ ] Results filter correctly
- [ ] Clear search box
- [ ] All deliveries appear again

## Test 6: Multiple Deliveries
- [ ] Create 3 more delivery orders
- [ ] All appear in Delivery Management
- [ ] Can edit each one
- [ ] Can delete each one
- [ ] Search works for all

## Test 7: Error Handling
- [ ] Try to place order without customer name
- [ ] See error: "Please fill in all customer details"
- [ ] Try to place order without phone
- [ ] See error: "Please fill in all customer details"
- [ ] Try to place order without address
- [ ] See error: "Please fill in all customer details"

## Test 8: API Keys Management
- [ ] Go to Delivery Management
- [ ] Scroll to "API Keys" section
- [ ] Enter Swiggy API key: "test-swiggy-key"
- [ ] Enter Zomato API key: "test-zomato-key"
- [ ] Click "Update Keys"
- [ ] See success message
- [ ] Keys are saved

## Test 9: Summary Statistics
- [ ] Check "Total Deliveries" count
- [ ] Check "Delivered" count
- [ ] Check "Pending" count
- [ ] Check "Dispatched" count
- [ ] Check "Total Revenue" amount
- [ ] All numbers are correct

## Test 10: Mobile Responsiveness
- [ ] Open on mobile device or use DevTools
- [ ] Billing page responsive
- [ ] Delivery Management page responsive
- [ ] Forms work on mobile
- [ ] Table scrolls properly
- [ ] Buttons are clickable

## Browser Console Checks
- [ ] No red error messages
- [ ] No warnings about missing data
- [ ] API calls show 200/201 status
- [ ] No CORS errors
- [ ] No authentication errors

## Performance Checks
- [ ] Page loads in < 2 seconds
- [ ] No lag when adding items
- [ ] No lag when placing order
- [ ] Delivery appears immediately
- [ ] Edit/delete works smoothly
- [ ] Search is responsive

## Data Integrity Checks
- [ ] Order number format: ORD-{id}
- [ ] Customer name matches exactly
- [ ] Phone number matches exactly
- [ ] Address matches exactly
- [ ] Amount matches order total (including tax)
- [ ] Partner is "in-house"
- [ ] Status options: pending, dispatched, delivered

## Final Verification
- [ ] All tests passed
- [ ] No errors in console
- [ ] No data loss
- [ ] System is stable
- [ ] Ready for production

## Issues Found
(List any issues encountered)
- Issue 1: _______________
- Issue 2: _______________
- Issue 3: _______________

## Notes
(Add any additional notes or observations)
- Note 1: _______________
- Note 2: _______________

## Sign Off
- Tested by: _______________
- Date: _______________
- Status: ✅ PASS / ❌ FAIL

---

**Total Tests:** 10
**Sub-tests:** 50+
**Expected Result:** All Pass ✅
