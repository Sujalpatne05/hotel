# QR Ordering System - Quick Test Guide

## System Ready ✅

The QR code-based table ordering system is now fully implemented and ready for testing.

## Quick Start

### 1. Start the Backend
```bash
npm run server
```
Backend runs on `http://localhost:5000`

### 2. Start the Frontend
```bash
npm run dev
```
Frontend runs on `http://localhost:8080`

### 3. Login as Admin
- URL: `http://localhost:8080/admin-login`
- Email: `admin@example.com`
- Password: `admin123`

## Testing the QR Ordering Flow

### Step 1: View QR Codes (Admin)
1. After login, go to **Table Management** from sidebar
2. You'll see all tables displayed as cards
3. Each table card has a **QR code icon** button (top right of buttons)
4. Click the QR icon to open the QR code modal

### Step 2: View QR Code Modal
1. Modal displays:
   - Table number (e.g., "Table 1 - QR Code")
   - Large QR code image (200x200px)
   - Instructions: "Scan this QR code to start ordering"
   - "Scan to Order" button for testing

### Step 3: Test Customer Flow (Option A - Direct Link)
1. Click "Scan to Order" button in the QR modal
2. You'll be redirected to the ordering page: `/table-qr/{tableId}`

### Step 3: Test Customer Flow (Option B - Scan QR Code)
1. Open your phone camera
2. Point at the QR code displayed in the modal
3. Tap the notification to open the link
4. You'll be redirected to the ordering page

### Step 4: Customer Menu & Cart
1. Page shows: "Table {number} - Scan & Order"
2. Left side: Menu items with images and prices
3. Right side: Shopping cart (sticky)
4. **Add items**: Click "Add to Cart" button on any item
5. **Adjust quantity**: Use +/- buttons in cart
6. **Remove items**: Click trash icon in cart
7. **View total**: Displayed at bottom of cart

### Step 5: Place Order
1. Add at least one item to cart
2. Click "Place Order" button (green button at bottom of cart)
3. Order is sent to backend with table number
4. You'll be redirected to payment page

### Step 6: Payment Page
1. Page shows: "Payment - Table {number} • Order #{orderId}"
2. Displays total amount in large text
3. Three payment method options:
   - **Credit/Debit Card** (blue)
   - **UPI / QR Code** (green)
   - **Cash** (purple)
4. Select any payment method
5. Click "Confirm Payment" button
6. Payment is processed (2-second simulation)

### Step 7: Order Confirmation
1. Page shows: "Order Confirmed!"
2. Displays:
   - Table number
   - Order ID
   - Estimated time: 15-20 min
3. Message: "Your order is being prepared in the kitchen"
4. Page auto-redirects to home after 5 seconds
5. Or click "Back to Home" button

### Step 8: Verify in Kitchen Display
1. Go to **Kitchen Display System** from sidebar
2. You should see your order with:
   - Table number (e.g., "Table 1")
   - Order items (e.g., "Biryani x2, Naan x1")
   - Order status: "pending"
3. Click status dropdown to change to "preparing" or "ready"

## Complete Test Scenario

### Scenario: Customer Orders from Table 2
1. **Admin Setup**:
   - Login as admin
   - Go to Table Management
   - Click QR icon on Table 2
   - View QR code modal

2. **Customer Orders**:
   - Click "Scan to Order" (or scan QR code)
   - Add: Biryani (2x), Naan (1x), Coke (1x)
   - Total: ~Rs. 450
   - Click "Place Order"

3. **Payment**:
   - Select "UPI / QR Code"
   - Click "Confirm Payment"
   - Wait for confirmation

4. **Kitchen**:
   - Go to Kitchen Display
   - See order for Table 2
   - Update status: pending → preparing → ready

5. **Completion**:
   - Order appears in Kitchen Display
   - Staff prepares food
   - Delivers to Table 2

## Testing Different Scenarios

### Test 1: Multiple Items
- Add 5+ different items
- Verify cart updates correctly
- Verify total calculation is accurate

### Test 2: Quantity Changes
- Add item with quantity 1
- Increase to 5
- Decrease to 2
- Remove item
- Verify cart updates

### Test 3: Different Tables
- Test QR ordering from different tables
- Verify each order has correct table number
- Verify all orders appear in Kitchen Display

### Test 4: Payment Methods
- Test each payment method (Card, UPI, Cash)
- Verify confirmation page appears
- Verify order appears in Kitchen Display

### Test 5: Kitchen Display Integration
- Place multiple orders from different tables
- Verify all orders appear in Kitchen Display
- Update order statuses
- Verify status changes are reflected

## Expected Results

✅ QR code displays correctly for each table
✅ QR code links to correct table ordering page
✅ Menu loads with all items and images
✅ Cart adds/removes items correctly
✅ Total calculation is accurate
✅ Order placement succeeds
✅ Payment page displays correctly
✅ Confirmation page shows order details
✅ Order appears in Kitchen Display with table number
✅ Order status can be updated

## Troubleshooting

### QR Code Not Showing
- Check internet connection (QR Server API needs internet)
- Refresh the page
- Check browser console for errors

### Menu Not Loading
- Verify backend is running on port 5000
- Check `/menu` endpoint: `http://localhost:5000/menu`
- Check browser console for API errors

### Order Not Appearing in Kitchen Display
- Verify backend is running
- Refresh Kitchen Display page
- Check that table number was included in order

### Payment Not Processing
- In demo mode, payment takes 2 seconds
- Check browser console for errors
- Verify backend is running

### Can't Login
- Use credentials: `admin@example.com` / `admin123`
- Check backend is running
- Clear browser cache and try again

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/menu` | GET | Fetch menu items |
| `/orders` | POST | Create new order |
| `/orders` | GET | Fetch all orders |
| `/tables` | GET | Fetch all tables |

## Files to Review

- `src/pages/TableQROrdering.tsx` - Customer ordering page
- `src/pages/TablePayment.tsx` - Payment page
- `src/pages/TableConfirmation.tsx` - Confirmation page
- `src/pages/TableManagement.tsx` - Admin QR display
- `src/lib/qrcode.ts` - QR code utility
- `QR_ORDERING_IMPLEMENTATION.md` - Full documentation

## Next Steps

1. Test the complete flow end-to-end
2. Verify all orders appear in Kitchen Display
3. Test with multiple tables simultaneously
4. Verify order status updates work correctly
5. Test on mobile devices (responsive design)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `QR_ORDERING_IMPLEMENTATION.md` for detailed documentation
3. Check browser console for error messages
4. Verify backend is running and accessible

---

**Status**: ✅ Ready for Testing
**Last Updated**: March 24, 2026
**Version**: 1.0
