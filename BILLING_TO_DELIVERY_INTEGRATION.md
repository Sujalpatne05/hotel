# Billing to Delivery Management Integration

## Overview
When a user selects "Delivery" as the order type in the Billing page and places an order, the system now automatically creates a corresponding delivery record in the Delivery Management page.

## How It Works

### 1. Billing Page Flow
- User selects "Delivery" order type
- User fills in customer details (Name, Phone, Address)
- User selects payment method
- User places the order

### 2. Automatic Delivery Creation
When a delivery order is placed, the system:
1. Creates the order in the Orders system
2. **Automatically creates a delivery record** with the following details:
   - Order Number: `ORD-{orderId}` (linked to the order)
   - Customer Name: From customer details
   - Phone: From customer details
   - Address: From customer details
   - Partner: "in-house" (default)
   - Amount: Order total
   - Driver: "Unassigned" (default)
   - Status: "pending" (default)

### 3. Delivery Management Page
The delivery record immediately appears in the Delivery Management page where it can be:
- Viewed in the delivery list
- Edited (update driver, partner, status, etc.)
- Deleted if needed
- Searched/filtered

## Code Changes

### File: `src/pages/Billing.tsx`

#### Added Validation
```typescript
// For delivery, require customer details
if (orderType === "delivery" && (!customer.name || !customer.phone || !customer.address)) {
  toast.error("Please fill in all customer details for delivery orders.");
  return;
}
```

#### Added Delivery Record Creation
```typescript
// Create delivery record if order type is delivery
if (orderType === "delivery") {
  const deliveryPayload = {
    order_number: `ORD-${newOrder.id}`,
    customer_name: customer.name,
    phone: customer.phone,
    address: customer.address,
    partner: "in-house",
    amount: total,
    driver: "Unassigned",
    status: "pending",
  };
  await apiRequest("/deliveries", {
    method: "POST",
    body: JSON.stringify(deliveryPayload),
  });
}
```

## User Experience

### Before
1. User places delivery order in Billing
2. User manually goes to Delivery Management
3. User manually creates a delivery record
4. Data duplication and manual work

### After
1. User places delivery order in Billing
2. Delivery record is **automatically created**
3. User can immediately see it in Delivery Management
4. No manual work needed
5. Single source of truth

## Data Flow Diagram

```
Billing Page (Delivery Order)
    ↓
    ├─→ Create Order (Orders API)
    │   └─→ Returns: ORD-{id}
    │
    └─→ Create Delivery (Deliveries API)
        ├─ order_number: ORD-{id}
        ├─ customer_name: {from form}
        ├─ phone: {from form}
        ├─ address: {from form}
        ├─ partner: "in-house"
        ├─ amount: {order total}
        ├─ driver: "Unassigned"
        └─ status: "pending"
            ↓
        Delivery Management Page
        (Delivery appears in list)
```

## Testing Steps

1. **Create Delivery Order**
   - Go to Billing page
   - Select "Delivery" order type
   - Add items to cart
   - Fill in customer details (Name, Phone, Address)
   - Select payment method
   - Click "Place Order"

2. **Verify Delivery Record**
   - Go to Delivery Management page
   - Look for the new delivery in the list
   - Verify order number matches (ORD-{id})
   - Verify customer details are correct
   - Verify amount matches order total

3. **Edit Delivery**
   - Click "Edit" on the delivery record
   - Update driver, partner, or status
   - Click "Save"
   - Verify changes are saved

4. **Delete Delivery**
   - Click "Delete" on the delivery record
   - Confirm deletion
   - Verify it's removed from the list

## Error Handling

- If customer details are missing, user gets error: "Please fill in all customer details for delivery orders."
- If delivery creation fails, user gets error: "Failed to place order"
- If order creation succeeds but delivery creation fails, order is still created (delivery can be added manually later)

## Future Enhancements

- [ ] Link delivery status to order status
- [ ] Auto-update order status when delivery is marked as delivered
- [ ] Send SMS/email notifications to customer when delivery is dispatched
- [ ] Integrate with Swiggy/Zomato APIs for real delivery partners
- [ ] Track delivery location in real-time
- [ ] Calculate delivery charges based on distance
