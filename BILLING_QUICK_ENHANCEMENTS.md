# Billing System - Quick Enhancement Guide

## Top 5 Features to Add (Highest Impact)

### 1. **Discount & Coupon System** 💰
**Impact**: Increases sales by 15-25%
**Effort**: 2-3 days
**Complexity**: Low

#### What to Add:
```
┌─────────────────────────────────────┐
│ Order Summary                       │
├─────────────────────────────────────┤
│ Subtotal:        ₹500              │
│ Tax (5%):        ₹25               │
├─────────────────────────────────────┤
│ Discount Type:   [Percentage ▼]    │
│ Discount Value:  [10 %]            │
│ Discount Amount: -₹50              │
├─────────────────────────────────────┤
│ OR                                  │
│ Coupon Code:     [SAVE20 ✓]        │
│ Coupon Discount: -₹100             │
├─────────────────────────────────────┤
│ TOTAL:           ₹475              │
└─────────────────────────────────────┘
```

#### Implementation:
```typescript
// Add to Billing.tsx state
const [discount, setDiscount] = useState({
  type: 'none', // 'percentage' | 'fixed' | 'coupon'
  value: 0,
  couponCode: '',
});

// Calculate discounted total
const discountAmount = discount.type === 'percentage' 
  ? Math.round(subtotal * (discount.value / 100))
  : discount.type === 'fixed' 
  ? discount.value 
  : 0;

const finalTotal = subtotal + tax - discountAmount;
```

#### UI Components to Add:
- Discount type selector (Percentage/Fixed/Coupon)
- Discount value input
- Coupon code input with validation
- Discount preview
- Applied discount display

---

### 2. **Invoice/Receipt Generation** 📄
**Impact**: Professional billing, customer satisfaction
**Effort**: 2-3 days
**Complexity**: Low

#### What to Add:
```
┌─────────────────────────────────────┐
│         RESTAURANT NAME             │
│         Invoice Receipt             │
├─────────────────────────────────────┤
│ Invoice #: INV-20260324-001         │
│ Date: 24-Mar-2026 02:30 PM         │
│ Table: 5                            │
├─────────────────────────────────────┤
│ Item              Qty    Rate  Amt  │
│ Biryani            2    250   500   │
│ Naan               1    100   100   │
│ Coke               2     50   100   │
├─────────────────────────────────────┤
│ Subtotal:                    700    │
│ Tax (5%):                     35    │
│ Discount:                    -70    │
│ TOTAL:                       665    │
├─────────────────────────────────────┤
│ Payment: Cash                       │
│ Thank you for your order!           │
│ Visit us again!                     │
└─────────────────────────────────────┘
```

#### Implementation:
```typescript
// Create invoice component
const generateInvoice = (order: Order) => {
  return {
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toLocaleString(),
    items: order.items,
    subtotal: order.subtotal,
    tax: order.tax,
    discount: order.discount,
    total: order.total,
    paymentMethod: order.paymentMethod,
  };
};

// Print function
const printInvoice = (invoice: Invoice) => {
  const printWindow = window.open('', '', 'height=600,width=800');
  printWindow?.document.write(generateInvoiceHTML(invoice));
  printWindow?.print();
};
```

#### Features:
- Print receipt
- Download as PDF
- Email receipt
- SMS receipt
- Display on screen

---

### 3. **Customer Profiles & History** 👥
**Impact**: Repeat customers, personalization
**Effort**: 3-4 days
**Complexity**: Medium

#### What to Add:
```
┌─────────────────────────────────────┐
│ Customer Details                    │
├─────────────────────────────────────┤
│ Name:     [John Doe        ▼]      │
│ Phone:    [+91-9876543210]         │
│ Email:    [john@email.com]         │
│ Address:  [123 Main St...]         │
├─────────────────────────────────────┤
│ Recent Orders:                      │
│ • 23-Mar: Biryani x2, Naan x1      │
│ • 20-Mar: Butter Chicken, Rice     │
│ • 18-Mar: Paneer Tikka, Naan       │
├─────────────────────────────────────┤
│ [Reorder Last Order]               │
│ [View Full History]                │
└─────────────────────────────────────┘
```

#### Implementation:
```typescript
interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  orderHistory: Order[];
  totalSpent: number;
  loyaltyPoints: number;
}

// Save customer
const saveCustomer = async (customer: Customer) => {
  await apiRequest('/customers', {
    method: 'POST',
    body: JSON.stringify(customer),
  });
};

// Get customer history
const getCustomerHistory = async (phone: string) => {
  return await apiRequest(`/customers/phone/${phone}`);
};
```

#### Features:
- Save customer info
- View order history
- Quick reorder
- Loyalty points tracking
- Customer preferences

---

### 4. **Split Bill Feature** 💳
**Impact**: Group dining, increased satisfaction
**Effort**: 3-4 days
**Complexity**: Medium

#### What to Add:
```
┌─────────────────────────────────────┐
│ Split Bill                          │
├─────────────────────────────────────┤
│ Number of People: [3]               │
│ Split Type: [Equal ▼]              │
├─────────────────────────────────────┤
│ Person 1: ₹222                      │
│ Person 2: ₹222                      │
│ Person 3: ₹221                      │
├─────────────────────────────────────┤
│ Payment Methods:                    │
│ Person 1: [Cash]                    │
│ Person 2: [Card]                    │
│ Person 3: [UPI]                     │
├─────────────────────────────────────┤
│ [Process Split Payment]             │
└─────────────────────────────────────┘
```

#### Implementation:
```typescript
interface SplitBill {
  totalAmount: number;
  numberOfPeople: number;
  splitType: 'equal' | 'custom' | 'byItems';
  splits: Array<{
    personId: string;
    amount: number;
    paymentMethod: string;
    paid: boolean;
  }>;
}

const calculateEqualSplit = (total: number, people: number) => {
  const perPerson = Math.floor(total / people);
  const remainder = total % people;
  return Array(people).fill(perPerson).map((amt, i) => 
    i < remainder ? amt + 1 : amt
  );
};
```

#### Features:
- Equal split
- Custom split
- Split by items
- Individual payment tracking
- Payment confirmation

---

### 5. **Payment Gateway Integration** 💳
**Impact**: Multiple payment options, security
**Effort**: 5-7 days
**Complexity**: High

#### What to Add:
```
┌─────────────────────────────────────┐
│ Payment Method                      │
├─────────────────────────────────────┤
│ ☑ Cash                              │
│ ☐ Card (Stripe)                    │
│ ☐ UPI (Razorpay)                   │
│ ☐ Wallet                            │
│ ☐ Gift Card                         │
├─────────────────────────────────────┤
│ Amount: ₹665                        │
│ [Process Payment]                   │
└─────────────────────────────────────┘
```

#### Implementation:
```typescript
// Razorpay integration
const initiateRazorpayPayment = async (amount: number) => {
  const response = await apiRequest('/payments/razorpay/order', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });

  const options = {
    key: 'YOUR_RAZORPAY_KEY',
    amount: amount * 100,
    currency: 'INR',
    order_id: response.orderId,
    handler: (response: any) => {
      verifyPayment(response);
    },
  };

  const razorpay = new (window as any).Razorpay(options);
  razorpay.open();
};
```

#### Features:
- Razorpay integration
- Stripe integration
- UPI payments
- Wallet support
- Payment confirmation

---

## Implementation Priority

### Week 1: Discount System
- Add discount UI
- Implement discount calculation
- Add coupon validation
- Test with various scenarios

### Week 2: Invoice Generation
- Create invoice template
- Add print functionality
- Add PDF download
- Add email/SMS options

### Week 3: Customer Profiles
- Create customer database
- Add customer search
- Implement order history
- Add quick reorder

### Week 4: Split Bill
- Add split UI
- Implement split calculation
- Add payment tracking
- Test with multiple payments

### Week 5-6: Payment Gateway
- Integrate Razorpay
- Add payment verification
- Implement error handling
- Add payment confirmation

---

## Code Structure

### New Files to Create
```
src/components/
  ├── DiscountPanel.tsx
  ├── InvoicePreview.tsx
  ├── CustomerSearch.tsx
  ├── SplitBillModal.tsx
  └── PaymentGateway.tsx

src/lib/
  ├── discount.ts
  ├── invoice.ts
  ├── payment.ts
  └── customer.ts

src/hooks/
  ├── useDiscount.ts
  ├── useInvoice.ts
  ├── useCustomer.ts
  └── useSplitBill.ts
```

### Backend Endpoints to Add
```
POST   /discounts/validate      - Validate coupon
GET    /customers/phone/:phone  - Get customer by phone
POST   /customers               - Save customer
GET    /customers/:id/history   - Get order history
POST   /payments/razorpay/order - Create Razorpay order
POST   /payments/verify         - Verify payment
POST   /invoices                - Generate invoice
```

---

## Testing Checklist

### Discount System
- [ ] Percentage discount calculation
- [ ] Fixed discount calculation
- [ ] Coupon validation
- [ ] Discount display in cart
- [ ] Total recalculation

### Invoice Generation
- [ ] Invoice format
- [ ] Print functionality
- [ ] PDF download
- [ ] Email sending
- [ ] SMS sending

### Customer Profiles
- [ ] Customer search
- [ ] Save customer
- [ ] View history
- [ ] Quick reorder
- [ ] Loyalty points

### Split Bill
- [ ] Equal split calculation
- [ ] Custom split
- [ ] Payment tracking
- [ ] Multiple payment methods
- [ ] Confirmation

### Payment Gateway
- [ ] Razorpay integration
- [ ] Payment verification
- [ ] Error handling
- [ ] Confirmation page
- [ ] Refund handling

---

## Expected Outcomes

### Revenue Impact
- Discounts: +15-25% sales
- Loyalty: +20-30% repeat customers
- Payment options: +10-15% conversion

### Customer Satisfaction
- Professional invoices: +20% satisfaction
- Customer profiles: +25% convenience
- Split bill: +30% group orders

### Operational Efficiency
- Automated invoicing: -50% manual work
- Payment automation: -40% cash handling
- Analytics: Better decision making

---

## Next Steps

1. **Review** this document with team
2. **Prioritize** features based on business needs
3. **Allocate** resources for implementation
4. **Create** detailed specifications
5. **Start** development with Phase 1
6. **Test** thoroughly before deployment
7. **Gather** customer feedback
8. **Iterate** based on feedback

---

**Document Version**: 1.0
**Last Updated**: March 24, 2026
**Status**: Ready for Implementation
**Estimated Timeline**: 4-6 weeks for all features
