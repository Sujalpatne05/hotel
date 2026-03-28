# Delivery Integration - Quick Test Guide

## Setup
- Frontend running on port 8080
- Backend running on port 5000
- Logged in as admin or manager

## Test Scenario: Create Delivery Order from Billing

### Step 1: Go to Billing Page
1. Click on "Billing" in the sidebar
2. You should see the POS Billing interface

### Step 2: Select Delivery Order Type
1. Look at the tabs: "Dine-in", "Take-away", "Delivery"
2. Click on "Delivery" tab
3. Notice the form changes to show customer details fields

### Step 3: Add Items to Cart
1. Search for or select menu items
2. Click "Add" to add items to the order
3. You should see items in the "Order Summary" section on the right

### Step 4: Fill Customer Details
In the "Order Summary" section, fill in:
- **Name**: e.g., "Rajesh Kumar"
- **Phone**: e.g., "9876543210"
- **Address**: e.g., "123 Main Street, Sector 45, Noida"

### Step 5: Select Payment Method
1. Choose one of: UPI, Card, or Cash
2. Verify the total amount is correct

### Step 6: Place Order
1. Click "Place Order" button
2. You should see success message: "Order placed successfully!"
3. The form should reset

### Step 7: Verify Delivery Record Created
1. Go to "Delivery Management" page (from sidebar)
2. Look at the delivery list table
3. You should see a new delivery with:
   - **Order #**: ORD-{id} (matching the order you just created)
   - **Customer**: "Rajesh Kumar" (the name you entered)
   - **Phone**: "9876543210"
   - **Partner**: "In-House"
   - **Amount**: ₹{total} (matching order total)
   - **Driver**: "Unassigned"
   - **Status**: "Pending"

### Step 8: Edit Delivery (Optional)
1. Click "Edit" button on the delivery row
2. A modal should open with the delivery details
3. Try changing:
   - Driver name to "Aman"
   - Status to "Dispatched"
4. Click "Save"
5. Verify changes appear in the table

### Step 9: Delete Delivery (Optional)
1. Click "Delete" button on the delivery row
2. Confirm the deletion
3. Verify the delivery is removed from the list

## Expected Results

✅ **Success Criteria:**
- Delivery order placed in Billing without errors
- Delivery record automatically appears in Delivery Management
- Order number matches between Billing and Delivery Management
- Customer details are correctly transferred
- Amount matches order total
- Can edit and delete delivery records
- No console errors

## Troubleshooting

### Issue: "Please fill in all customer details for delivery orders"
**Solution**: Make sure you filled in Name, Phone, and Address fields

### Issue: Delivery doesn't appear in Delivery Management
**Solution**: 
1. Refresh the Delivery Management page
2. Check browser console for errors
3. Verify backend is running on port 5000

### Issue: Amount doesn't match
**Solution**: Verify the order total calculation includes tax (5%)

### Issue: Can't edit/delete delivery
**Solution**: 
1. Check if you're logged in
2. Verify backend is running
3. Check browser console for errors

## Data Verification

After creating a delivery order, you can verify the data:

### In Billing Page
- Order appears in "Recent Orders" section
- Order type shows as "Delivery"
- Amount is correct

### In Delivery Management Page
- Delivery appears in the list
- All customer details are correct
- Status is "Pending"
- Driver is "Unassigned"

### In Backend (Optional)
Check the deliveries data:
```bash
curl -H "Authorization: Bearer {token}" http://localhost:5000/deliveries
```

Should return the delivery record with snake_case fields:
```json
{
  "id": 3003,
  "order_number": "ORD-1003",
  "customer_name": "Rajesh Kumar",
  "phone": "9876543210",
  "address": "123 Main Street, Sector 45, Noida",
  "partner": "in-house",
  "amount": 525,
  "driver": "Unassigned",
  "status": "pending"
}
```

## Next Steps

After successful testing:
1. Test with multiple delivery orders
2. Test editing delivery details
3. Test deleting deliveries
4. Test searching/filtering deliveries
5. Test API key management
6. Commit and push changes
