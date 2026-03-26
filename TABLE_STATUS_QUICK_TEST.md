# Table Status Sync - Quick Test Guide

## ✅ Feature Status: FULLY IMPLEMENTED & WORKING

The table status automatically syncs with the dine-in order lifecycle.

---

## How It Works

### Step 1: Place Order
1. Go to **Billing** page
2. Select **Dine-in** order type
3. Click on a table (e.g., Table 2)
4. Add items to order
5. Click **"Place Order"**

**Result:** Table 2 automatically shows **OCCUPIED** status ✅

### Step 2: Prepare & Serve
1. Go to **Kitchen Display System (KDS)**
2. See the order as PENDING
3. Click "Start Order" → becomes PREPARING
4. Click "Mark Ready" → becomes READY
5. Click "Serve" → becomes SERVED

**Result:** Table 2 still shows **OCCUPIED** (waiting for payment)

### Step 3: Settle Bill
1. Go to **Bill Settlement** page
2. See the unpaid dine-in order
3. Select payment method (Cash/Card/UPI)
4. Click **"Collect Payment"**

**Result:** Table 2 automatically shows **AVAILABLE** status ✅

---

## What You'll See

### Table Management Page

**Before Order:**
```
Table 2
Main Hall
4 seats
Status: AVAILABLE (green)
```

**After Order Placed:**
```
Table 2
Main Hall
4 seats
Status: OCCUPIED (red)
Order: ORD-1001
Open bill: Rs. 400
30 min occupied
```

**After Bill Settled:**
```
Table 2
Main Hall
4 seats
Status: AVAILABLE (green)
```

---

## Testing Scenarios

### Scenario 1: Single Table
1. Place order on Table 1
2. Verify it shows OCCUPIED
3. Settle payment
4. Verify it shows AVAILABLE ✅

### Scenario 2: Multiple Tables
1. Place orders on Table 1, 2, 3
2. All should show OCCUPIED
3. Settle payment for Table 1 only
4. Table 1 shows AVAILABLE
5. Table 2 & 3 still show OCCUPIED ✅

### Scenario 3: Manual Status Change
1. Table shows OCCUPIED
2. Click "Change Status" dropdown
3. Select "Available"
4. Table immediately shows AVAILABLE
5. (Manual override works) ✅

---

## Key Features

✅ **Automatic Status Update**
- No manual intervention needed
- Updates instantly when order is placed/settled

✅ **Order Tracking**
- Shows order number on occupied table
- Shows open bill amount
- Shows occupancy time

✅ **Multi-Table Support**
- Each table updates independently
- No conflicts between tables

✅ **Manual Override**
- Can manually change status if needed
- Dropdown menu available on each table

✅ **Real-time Sync**
- Auto-refreshes every 15 seconds
- Always shows current status

---

## Troubleshooting

### Table Not Updating After Order?
1. Refresh the Table Management page
2. Check if order was actually created (go to Orders page)
3. Verify table was selected before placing order

### Table Not Becoming Available After Payment?
1. Refresh the Table Management page
2. Check if payment was actually processed (go to Bill Settlement)
3. Verify the correct table number was used

### Manual Status Change Not Working?
1. Check if you have permission to modify tables
2. Try refreshing the page
3. Check browser console for errors

---

## Pages Involved

| Page | Action | Result |
|------|--------|--------|
| **Billing** | Place dine-in order | Table → OCCUPIED |
| **KDS** | Prepare & serve order | Table stays OCCUPIED |
| **Bill Settlement** | Collect payment | Table → AVAILABLE |
| **Table Management** | View all tables | Shows current status |

---

## Backend Endpoints Used

```
POST /orders
  → Creates order
  → Triggers table update

PUT /tables/{id}
  → Updates table status
  → Called from Billing & BillSettlement

PUT /orders/{id}
  → Updates order status to "completed"
  → Called from BillSettlement
```

---

## Summary

The table status sync is **fully implemented and working**. Tables automatically:
- Become **OCCUPIED** when a dine-in order is placed
- Become **AVAILABLE** when the bill is settled

No additional work needed! ✅
