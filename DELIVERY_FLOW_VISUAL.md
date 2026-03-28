# Delivery Integration - Visual Flow Guide

## Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    BILLING PAGE (Delivery)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Select "Delivery" Tab                                       │
│     ┌──────────────────────────────────────────────────────┐   │
│     │ [Dine-in] [Take-away] [Delivery] ← Click here       │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  2. Add Items to Cart                                           │
│     ┌──────────────────────────────────────────────────────┐   │
│     │ Menu Items                                           │   │
│     │ [Butter Chicken] [Biryani] [Paneer Tikka]          │   │
│     │ Click "Add" to add items                            │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  3. Fill Customer Details                                       │
│     ┌──────────────────────────────────────────────────────┐   │
│     │ Customer Details                                     │   │
│     │ Name:    [Rajesh Kumar        ]                     │   │
│     │ Phone:   [9876543210          ]                     │   │
│     │ Address: [123 Main St, Noida  ]                     │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  4. Select Payment Method                                       │
│     ┌──────────────────────────────────────────────────────┐   │
│     │ [UPI] [Card] [Cash] ← Select one                    │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  5. Review Order Summary                                        │
│     ┌──────────────────────────────────────────────────────┐   │
│     │ Order Summary                                        │   │
│     │ Butter Chicken x1 ............ ₹350                │   │
│     │ Biryani x1 ................... ₹200                │   │
│     │ ─────────────────────────────────────────           │   │
│     │ Subtotal ..................... ₹550                │   │
│     │ Tax (5%) ..................... ₹27.50              │   │
│     │ Total ........................ ₹577.50              │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
│  6. Place Order                                                 │
│     ┌──────────────────────────────────────────────────────┐   │
│     │ [Place Order] ← Click to submit                     │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ✨ AUTOMATIC PROCESS ✨
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND PROCESSING                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Step 1: Create Order                                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ POST /orders                                            │   │
│  │ {                                                       │   │
│  │   userId: 1,                                            │   │
│  │   items: ["Butter Chicken x1", "Biryani x1"],          │   │
│  │   total: 577.50,                                        │   │
│  │   orderType: "delivery",                                │   │
│  │   paymentMethod: "cash"                                 │   │
│  │ }                                                       │   │
│  │ Response: { id: 1003, ... }                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓                                  │
│  Step 2: Create Delivery (AUTOMATIC)                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ POST /deliveries                                        │   │
│  │ {                                                       │   │
│  │   order_number: "ORD-1003",                             │   │
│  │   customer_name: "Rajesh Kumar",                        │   │
│  │   phone: "9876543210",                                  │   │
│  │   address: "123 Main St, Noida",                        │   │
│  │   partner: "in-house",                                  │   │
│  │   amount: 577.50,                                       │   │
│  │   driver: "Unassigned",                                 │   │
│  │   status: "pending"                                     │   │
│  │ }                                                       │   │
│  │ Response: { id: 3003, ... }                             │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ✅ SUCCESS MESSAGE ✅
                    "Order placed successfully!"
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              DELIVERY MANAGEMENT PAGE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Deliveries Table                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Order # │ Customer      │ Phone      │ Partner │ Amount │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ ORD-301 │ Ria Verma     │ 9123456780 │ In-House│ ₹840  │  │
│  │ ORD-302 │ Kunal Jain    │ 9012345678 │ Swiggy  │ ₹460  │  │
│  │ ORD-1003│ Rajesh Kumar  │ 9876543210 │ In-House│ ₹577.50│ ← NEW!
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Actions Available:                                             │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ [Edit] [Delete]  ← Click to manage delivery             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Edit Delivery Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              DELIVERY MANAGEMENT PAGE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Click [Edit] on delivery row                                   │
│                              ↓                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              EDIT DELIVERY MODAL                        │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                         │   │
│  │ Order Number: [ORD-1003        ]                       │   │
│  │ Customer Name: [Rajesh Kumar    ]                      │   │
│  │ Phone: [9876543210              ]                      │   │
│  │ Address: [123 Main St, Noida    ]                      │   │
│  │ Partner: [In-House ▼]                                  │   │
│  │ Amount: [577.50                 ]                      │   │
│  │ Driver: [Aman                   ] ← Update driver      │   │
│  │ Status: [Dispatched ▼]          ← Update status       │   │
│  │                                                         │   │
│  │ [Cancel] [Save]                                        │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓                                  │
│  Click [Save]                                                   │
│                              ↓                                  │
│  PUT /deliveries/3003                                           │
│  {                                                              │
│    driver: "Aman",                                              │
│    status: "dispatched"                                         │
│  }                                                              │
│                              ↓                                  │
│  ✅ "Delivery updated successfully!"                            │
│                              ↓                                  │
│  Table updates with new values                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ORD-1003│ Rajesh Kumar  │ 9876543210 │ In-House│ ₹577.50│   │
│  │ Driver: Aman | Status: Dispatched                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Delete Delivery Flow

```
┌─────────────────────────────────────────────────────────────────┐
│              DELIVERY MANAGEMENT PAGE                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Click [Delete] on delivery row                                 │
│                              ↓                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │         CONFIRMATION DIALOG                            │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │                                                         │   │
│  │ Are you sure you want to delete this delivery?         │   │
│  │                                                         │   │
│  │ [Cancel] [OK]                                          │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↓                                  │
│  Click [OK]                                                     │
│                              ↓                                  │
│  DELETE /deliveries/3003                                        │
│                              ↓                                  │
│  ✅ "Delivery deleted successfully!"                            │
│                              ↓                                  │
│  Delivery removed from table                                    │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Order # │ Customer      │ Phone      │ Partner │ Amount │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ ORD-301 │ Ria Verma     │ 9123456780 │ In-House│ ₹840  │   │
│  │ ORD-302 │ Kunal Jain    │ 9012345678 │ Swiggy  │ ₹460  │   │
│  │ (ORD-1003 removed)                                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Mapping

```
BILLING PAGE INPUT          →    DELIVERY RECORD
─────────────────────────────────────────────────────
Customer Name              →    customer_name
Phone                      →    phone
Address                    →    address
Order Total                →    amount
Order ID (ORD-{id})        →    order_number
(Auto)                     →    partner: "in-house"
(Auto)                     →    driver: "Unassigned"
(Auto)                     →    status: "pending"
```

## Status Transitions

```
Delivery Lifecycle:

pending
   ↓
dispatched (when driver is assigned and delivery starts)
   ↓
delivered (when delivery is completed)

Can be edited at any stage
Can be deleted at any stage
```

## Summary

✨ **Key Points:**
1. User places delivery order in Billing
2. System automatically creates delivery record
3. Delivery appears in Delivery Management
4. User can edit driver, partner, status
5. User can delete delivery if needed
6. All data is synchronized

🎯 **Benefits:**
- No manual data entry
- Single source of truth
- Reduced errors
- Better user experience
- Efficient workflow
