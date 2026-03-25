# Dine-in Order & Payment Workflow Guide

## How It Works Now

### Step 1: Place Order (Billing Page)
1. Go to **Billing** page
2. Select **Dine-in** order type
3. Select a table (e.g., Table 1)
4. Add menu items
5. Click **"Place Order"** (NO payment methods shown for dine-in)
6. Order is sent to Kitchen Display immediately
7. Table status automatically changes to "occupied"

### Step 2: Kitchen Prepares Order (KD)
- Kitchen staff sees the order in Kitchen Display
- Prepares the food
- Marks order as ready

### Step 3: Collect Payment (Bill Settlement Page)
1. Go to **Bill Settlement** page (new menu item in sidebar)
2. You'll see all dine-in orders waiting for payment
3. Select payment method (UPI, Card, or Cash)
4. Click **"Collect Payment"** for each table
5. Order is marked as completed
6. Table status automatically changes to "available"

## Key Features

✅ **Multiple Tables Support**
- Table 1 can be waiting for payment while Table 2 is being served
- No conflicts between tables

✅ **Order Status Flow**
- Dine-in: pending → preparing → ready → (payment) → completed
- Delivery: pending → (payment required) → preparing → ready → completed

✅ **Payment Tracking**
- Dine-in orders: `paymentStatus: "unpaid"` until payment collected
- Delivery orders: `paymentStatus: "paid"` (payment upfront)

✅ **Table Management**
- Table automatically marked "occupied" when order placed
- Table automatically marked "available" when payment collected

## Testing the Workflow

### Test Case 1: Single Table Order
1. Billing → Select Table 1 → Add items → Place Order
2. Check Table Management: Table 1 should be "occupied"
3. Bill Settlement → Should see Table 1 order
4. Select payment method → Collect Payment
5. Check Table Management: Table 1 should be "available"

### Test Case 2: Multiple Tables Concurrent
1. Billing → Table 1 → Add items → Place Order
2. Billing → Table 2 → Add items → Place Order
3. Bill Settlement → Should see both Table 1 and Table 2
4. Collect payment for Table 1 first
5. Table 1 becomes available, Table 2 still occupied
6. Collect payment for Table 2
7. Both tables now available

### Test Case 3: Add Items to Existing Order
1. Billing → Table 1 → Add items → Place Order
2. Billing → Table 1 (select again) → Should show existing order items
3. Add more items → Click "Update Order"
4. Bill Settlement → Should show updated total

## Troubleshooting

**Orders not showing in Bill Settlement?**
- Click "Refresh Orders" button
- Make sure orders are dine-in type
- Check that `paymentStatus` is "unpaid"

**Table not updating to occupied?**
- Verify order was created successfully
- Check Table Management page
- Refresh the page

**Payment not processing?**
- Ensure payment method is selected
- Check browser console for errors
- Verify backend is running
