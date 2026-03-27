# Kitchen Display - Item-Level Status Tracking Fix

## Problem
When a table orders additional items after their first order has been served:
- The existing bill opens in billing
- But the new items don't display in Kitchen Display (KD)
- Butter Chicken (served) and Garlic Naan (new) were both showing as "pending"

## Solution
Implemented **item-level status tracking** instead of order-level status tracking.

### Changes Made

#### 1. Backend (server/mock-backend.mjs)
- **Order Creation**: Added `itemStatuses` array to track each item's status separately
  ```javascript
  itemStatuses: body.items.map(() => "pending")
  ```

- **Order Update**: When items are added to existing order:
  - Preserves existing item statuses (e.g., Butter Chicken stays "served")
  - Marks new items as "pending" (e.g., Garlic Naan shows "pending")
  - Allows updating individual item statuses via `itemStatuses` field

#### 2. Frontend - Billing (src/pages/Billing.tsx)
- Removed the `status: "pending"` reset when updating orders
- Now sends items with their individual statuses preserved
- Backend handles status management automatically

#### 3. Frontend - Kitchen Display (src/pages/Orders.tsx)
- Updated Order type to include `itemStatuses: string[]`
- Each item now displays with its own status badge
- Added "Mark Served" button for each item
- Kitchen staff can mark individual items as served without affecting other items

### Workflow

**Scenario: Table 1 orders Butter Chicken, then Garlic Naan**

1. **Initial Order** (Butter Chicken)
   - Order created with status "pending"
   - Item status: ["pending"]
   - KD shows: Butter Chicken - Pending

2. **Kitchen Prepares & Serves**
   - Staff marks Butter Chicken as "served"
   - Item status: ["served"]
   - KD shows: Butter Chicken - Served

3. **Table Orders More** (Garlic Naan)
   - Billing updates order with new items
   - Item statuses: ["served", "pending"]
   - KD shows:
     - Butter Chicken - Served ✓
     - Garlic Naan - Pending (needs preparation)

4. **Kitchen Prepares New Item**
   - Staff marks Garlic Naan as "served"
   - Item statuses: ["served", "served"]
   - KD shows both items as served

### Key Features
✅ Individual item status tracking
✅ Preserves served items when adding new ones
✅ Kitchen staff can mark items as served one by one
✅ No order status reset needed
✅ Backward compatible with existing orders

### Additional Fixes
- **KD Filtering**: Updated "Pending" tab to show orders with ANY pending items (not just orders with pending status)
- **Stats Counter**: "Pending" count now includes orders with pending items
- **Refresh Rate**: Reduced from 10 seconds to 3 seconds for faster updates

### Testing
1. Create order with Butter Chicken
2. Mark as served in KD
3. Add Garlic Naan to same table
4. Verify: Order appears in "Pending" tab with:
   - Butter Chicken - Served ✓
   - Garlic Naan - Pending (with "Mark Served" button)
5. Mark Garlic Naan as served
6. Both items now show "Served"
7. Order disappears from "Pending" tab (no more pending items)
