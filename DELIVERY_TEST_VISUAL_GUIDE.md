# Delivery Management - Visual Testing Guide

## Test Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    START TESTING                                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  TEST 1: Create Delivery Order                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Go to Billing page                                          │
│  2. Click "Delivery" tab                                        │
│  3. Add items to cart                                           │
│  4. Fill customer details:                                      │
│     - Name: "Test Customer"                                     │
│     - Phone: "9876543210"                                       │
│     - Address: "Test Address"                                   │
│  5. Select payment method                                       │
│  6. Click "Place Order"                                         │
│  7. ✅ See: "Order placed successfully!"                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  TEST 2: Verify Delivery Appears                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Go to Delivery Management page                              │
│  2. Look at deliveries table                                    │
│  3. ✅ New delivery should appear with:                         │
│     - Order #: ORD-{id}                                         │
│     - Customer: "Test Customer"                                 │
│     - Phone: "9876543210"                                       │
│     - Partner: "In-House"                                       │
│     - Amount: ₹{total}                                          │
│     - Driver: "Unassigned"                                      │
│     - Status: "Pending"                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  TEST 3: Edit Delivery                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Click [Edit] button on delivery row                         │
│  2. Modal opens with delivery details                           │
│  3. Change Driver: "Aman"                                       │
│  4. Change Status: "Dispatched"                                 │
│  5. Click [Save]                                                │
│  6. ✅ See: "Delivery updated successfully!"                    │
│  7. ✅ Table updates with new values                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  TEST 4: Delete Delivery                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Click [Delete] button on delivery row                       │
│  2. Confirmation dialog appears                                 │
│  3. Click [OK] to confirm                                       │
│  4. ✅ See: "Delivery deleted successfully!"                    │
│  5. ✅ Delivery removed from table                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  TEST 5: Search/Filter                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Type customer name in search box                            │
│  2. ✅ Results filter correctly                                 │
│  3. Type order number in search box                             │
│  4. ✅ Results filter correctly                                 │
│  5. Clear search box                                            │
│  6. ✅ All deliveries appear again                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  TEST 6: API Keys Management                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Go to Delivery Management page                              │
│  2. Scroll to "API Keys" section                                │
│  3. Enter Swiggy API key: "test-key-1"                          │
│  4. Enter Zomato API key: "test-key-2"                          │
│  5. Click [Update Keys]                                         │
│  6. ✅ See: "API keys updated successfully"                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  TEST 7: Error Handling                                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Try to place order without customer name                    │
│  2. ✅ See error: "Please fill in all customer details"         │
│  3. Try to place order without phone                            │
│  4. ✅ See error: "Please fill in all customer details"         │
│  5. Try to place order without address                          │
│  6. ✅ See error: "Please fill in all customer details"         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    ALL TESTS PASSED ✅                          │
│                                                                 │
│  System is working correctly and ready for production!          │
└─────────────────────────────────────────────────────────────────┘
```

## Billing Page - Delivery Tab

```
┌─────────────────────────────────────────────────────────────────┐
│  POS Billing                                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Tabs: [Dine-in] [Take-away] [Delivery] ← Click here           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Menu Items                                              │   │
│  │ [Butter Chicken] [Biryani] [Paneer Tikka]             │   │
│  │ Click "Add" to add items                               │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Order Summary                                           │   │
│  │ Butter Chicken x1 ............ ₹350                    │   │
│  │ Biryani x1 ................... ₹200                    │   │
│  │ ─────────────────────────────────────────              │   │
│  │ Subtotal ..................... ₹550                    │   │
│  │ Tax (5%) ..................... ₹27.50                  │   │
│  │ Total ........................ ₹577.50                  │   │
│  │                                                         │   │
│  │ Customer Details                                        │   │
│  │ Name: [Test Customer      ]                            │   │
│  │ Phone: [9876543210        ]                            │   │
│  │ Address: [Test Address    ]                            │   │
│  │                                                         │   │
│  │ Payment Method                                          │   │
│  │ [UPI] [Card] [Cash] ← Select one                       │   │
│  │                                                         │   │
│  │ [Place Order] ← Click to submit                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Delivery Management Page

```
┌─────────────────────────────────────────────────────────────────┐
│  Delivery Management                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Summary Cards:                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Total: 5 │ │Delivered:│ │ Pending: │ │ Revenue: │          │
│  │          │ │    2     │ │    3     │ │ ₹5000    │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                 │
│  API Keys:                                                      │
│  Swiggy: [test-key-1        ] [Update Keys]                    │
│  Zomato: [test-key-2        ]                                  │
│                                                                 │
│  Deliveries:                                                    │
│  Search: [Search by customer or order...]                      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Order # │ Customer │ Phone │ Partner │ Amount │ Actions │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ ORD-301 │ Ria      │ 91234 │ In-House│ ₹840  │ [E][D] │  │
│  │ ORD-302 │ Kunal    │ 90123 │ Swiggy  │ ₹460  │ [E][D] │  │
│  │ ORD-1003│ Test Cust│ 98765 │ In-House│ ₹577.50│ [E][D] │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [E] = Edit  [D] = Delete                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Edit Delivery Modal

```
┌─────────────────────────────────────────────────────────────────┐
│              EDIT DELIVERY MODAL                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Order Number: [ORD-1003        ]                               │
│ Customer Name: [Test Customer   ]                              │
│ Phone: [9876543210              ]                              │
│ Address: [Test Address          ]                              │
│ Partner: [In-House ▼]                                          │
│ Amount: [577.50                 ]                              │
│ Driver: [Aman                   ] ← Change this                │
│ Status: [Dispatched ▼]          ← Change this                 │
│                                                                 │
│ [Cancel] [Save]                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Success Messages

```
✅ Order placed successfully!
   └─ Delivery record created automatically

✅ Delivery updated successfully!
   └─ Changes saved to database

✅ Delivery deleted successfully!
   └─ Delivery removed from list

✅ API keys updated successfully
   └─ Keys saved for Swiggy/Zomato
```

## Error Messages

```
❌ Please fill in all customer details for delivery orders.
   └─ Missing: Name, Phone, or Address

❌ Failed to place order
   └─ Backend error or network issue

❌ Failed to update delivery
   └─ Backend error or network issue

❌ Failed to delete delivery
   └─ Backend error or network issue
```

## Data Verification Checklist

```
Order Number:
  ✅ Format: ORD-{id}
  ✅ Matches between Billing and Delivery Management
  ✅ Unique for each order

Customer Details:
  ✅ Name matches exactly
  ✅ Phone matches exactly
  ✅ Address matches exactly

Amount:
  ✅ Matches order total
  ✅ Includes tax (5%)
  ✅ Correct calculation

Status:
  ✅ Initial: "Pending"
  ✅ Can change to "Dispatched"
  ✅ Can change to "Delivered"

Partner:
  ✅ Default: "In-House"
  ✅ Can change to "Swiggy"
  ✅ Can change to "Zomato"

Driver:
  ✅ Initial: "Unassigned"
  ✅ Can be updated
  ✅ Persists after save
```

## Browser Console Checks

```
✅ No red error messages
✅ No warnings about missing data
✅ API calls show 200/201 status
✅ No CORS errors
✅ No authentication errors
✅ Network tab shows successful requests
```

## Performance Benchmarks

```
Page Load:        < 2 seconds
Add Item:         < 500ms
Place Order:      < 1 second
Delivery Appears: < 500ms
Edit Delivery:    < 500ms
Delete Delivery:  < 500ms
Search:           < 300ms
```

## Summary

If all visual elements match and all tests pass, the system is working correctly!

**Status: ✅ READY FOR TESTING**
