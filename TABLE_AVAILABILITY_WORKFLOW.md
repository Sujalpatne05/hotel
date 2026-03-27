# Table Availability Workflow

## Current Implementation Status: ✅ COMPLETE

### Workflow Flow:

1. **Order Placement (Billing Page)**
   - Admin selects a table (e.g., Table 1)
   - Places an order with items
   - Backend: Table status changes to "occupied"
   - Backend: `current_order` is set to the order ID

2. **Order Preparation (Kitchen Display)**
   - Kitchen staff sees the order
   - Marks items as "preparing" → "ready" → "served"

3. **Payment Collection (Bill Settlement Page)**
   - Admin opens Bill Settlement
   - Sees all unpaid dine-in orders
   - Clicks "Collect Payment" for Table 1
   - Backend: Order status changes to "completed"
   - Backend: Order `paymentStatus` changes to "paid"
   - **Backend: Table status automatically changes to "available"**
   - **Backend: `current_order` is cleared (set to null)**

4. **Table Ready for Next Customer**
   - Table 1 now shows as "available" in Billing page
   - Can be selected for a new order

### Code References:

**BillSettlement.tsx (handlePayment function):**
```javascript
// Update order payment status
await apiRequest(`/orders/${orderId}`, {
  method: "PUT",
  body: JSON.stringify({
    paymentStatus: "paid",
    paymentMethod: selectedPaymentMethod,
    status: "completed",
  }),
});

// Update table status to available
const table = tables.find((t) => t.number === tableNumber);
if (table) {
  await apiRequest(`/tables/${table.id}`, {
    method: "PUT",
    body: JSON.stringify({
      status: "available",
      current_order: null,
    }),
  });
}
```

**Billing.tsx (handlePlaceOrder function):**
```javascript
// Update table status to occupied for dine-in orders
if (orderType === "dine-in" && selectedTable) {
  const table = tables.find(t => t.number === selectedTable);
  if (table) {
    await apiRequest(`/tables/${table.id}`, {
      method: "PUT",
      body: JSON.stringify({
        status: "occupied",
        current_order: `ORD-${newOrder.id}`,
      }),
    });
  }
}
```

### Testing Steps:

1. Go to Billing page
2. Select Table 1 (should show as "available")
3. Add items and place order
4. Go to Bill Settlement page
5. Table 1 should appear with unpaid order
6. Click "Collect Payment"
7. Go back to Billing page
8. Table 1 should now show as "available" again

### Status: ✅ WORKING AS EXPECTED

The table automatically becomes available when payment is collected. No changes needed.
