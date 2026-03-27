# Multiple Orders Per Table - Fixed

## Problem
When a table ordered additional items after their first order was served:
- Table 8 orders Butter Chicken → sent to KD → marked as "served"
- Table 8 orders Garlic Naan → NOT sent to KD (new order not created)
- At billing time → only showed one order, not all items

## Root Cause
1. Backend query returned "served" orders as "existing orders"
2. Billing page tried to UPDATE served order instead of creating NEW order
3. BillSettlement only showed one order per table, not all unpaid orders

## Solution Implemented

### 1. Backend Fix (server/mock-backend.mjs)
Changed the `/orders/table/:id` query to exclude "served" orders:
```javascript
// Before: o.status !== "completed"
// After: o.status !== "completed" && o.status !== "served"
```

**Result**: Served orders are no longer returned as "existing", so new orders create separate records.

### 2. BillSettlement UI Update (src/pages/BillSettlement.tsx)
- Group all unpaid orders by table number
- Show all orders for a table in one card
- Display total amount for all orders combined
- Collect payment for ALL orders of that table at once

**Before**:
```
Table 8 - Order #1001 - ₹350
Table 8 - Order #1002 - ₹60
(Two separate cards)
```

**After**:
```
Table 8 (2 orders) - Total ₹410
├─ Order #1001: Butter Chicken - ₹350
└─ Order #1002: Garlic Naan - ₹60
(One card with all items)
```

### 3. Payment Handler Update
When "Collect Payment" is clicked:
- Finds ALL unpaid orders for that table
- Updates ALL orders to `paymentStatus: "paid"` and `status: "completed"`
- Marks table as "available"
- Shows success message with order count

## Workflow Now

### Scenario: Table 8 Orders Multiple Times

**Step 1: First Order**
```
Billing: Select Table 8 → Add Butter Chicken → Place Order
Backend: Creates Order #1001 (status: pending)
KD: Shows Order #1001
```

**Step 2: Mark as Served**
```
KD: Click "Serve Order" on Order #1001
Backend: Order #1001 status → "served"
KD: Order #1001 disappears (filtered out)
```

**Step 3: Additional Order**
```
Billing: Select Table 8 → Add Garlic Naan → Place Order
Backend: Creates Order #1002 (status: pending) - NEW order, not update
KD: Shows Order #1002
```

**Step 4: Billing**
```
BillSettlement: Shows Table 8 with 2 orders
├─ Order #1001: Butter Chicken - ₹350 (served)
└─ Order #1002: Garlic Naan - ₹60 (pending)
Total: ₹410

Click "Collect Payment" → Both orders marked as paid
Table 8 → Available
```

## Files Modified
- `server/mock-backend.mjs` - Fixed query to exclude served orders
- `src/pages/BillSettlement.tsx` - Group orders by table, show all unpaid orders

## Testing

**Test Case 1: Add items before serving**
1. Table 5 orders Butter Chicken
2. Add Garlic Naan to same order (UPDATE existing)
3. Both items in same order in KD ✅

**Test Case 2: Order after serving**
1. Table 8 orders Butter Chicken → served
2. Table 8 orders Garlic Naan → NEW order in KD ✅
3. BillSettlement shows both orders ✅
4. Collect payment for both ✅

**Test Case 3: Multiple tables**
1. Table 5: 1 order
2. Table 8: 2 orders
3. BillSettlement shows 2 cards (one per table) ✅
4. Each card shows all orders for that table ✅

## Status: ✅ COMPLETE

All orders now properly tracked and displayed at billing time.
