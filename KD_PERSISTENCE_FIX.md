# Kitchen Display - Order Persistence Fix

## Problem
When clicking "Start" on an item in Kitchen Display, the button would revert back to "Start" because:
- The item status was updated in memory only
- The changes were NOT saved to the backend JSON file
- When the page refreshed (every 3 seconds), it reloaded from the file with old data
- Result: UI reverted to the previous state

## Root Cause
The backend was missing `saveOrders()` calls after updating orders. Orders were stored in memory but never persisted to `server/data/orders.json`.

## Solution
Added order persistence to the backend:

### 1. Created saveOrders() Function
```javascript
const ordersFilePath = join(__dirname, 'data', 'orders.json');

function saveOrders(ordersArray) {
  try {
    writeFileSync(ordersFilePath, JSON.stringify(ordersArray, null, 2), 'utf-8');
    console.log('[ORDERS] ✅ Orders saved to file');
  } catch (err) {
    console.error('[ORDERS] ❌ Error saving orders to file:', err.message);
  }
}
```

### 2. Added saveOrders() Calls
- **POST /orders** - After creating new order
- **PUT /orders/{id}** - After updating order items/status
- **PATCH /orders/{id}/status** - After updating order status

## How It Works Now

### Before (Broken)
```
1. Click "Start" → UI updates to "Ready"
2. Backend request sent (itemStatus updated in memory)
3. Page refreshes every 3 seconds
4. Loads from JSON file (old data, no save happened)
5. UI reverts to "Start" ❌
```

### After (Fixed)
```
1. Click "Start" → UI updates to "Ready"
2. Backend request sent (itemStatus updated in memory)
3. saveOrders() called → Data written to JSON file ✅
4. Page refreshes every 3 seconds
5. Loads from JSON file (new data persisted)
6. UI stays as "Ready" ✅
```

## Testing
1. Go to Kitchen Display
2. Click "Start" on any item
3. Button should change to "Ready" and STAY as "Ready"
4. Refresh the page (Ctrl+R)
5. Item should still show "Ready" button
6. Click "Ready" → Button changes to "Served" and stays
7. Refresh page → Item still shows "Served"

## Files Modified
- `server/mock-backend.mjs`
  - Added `saveOrders()` function
  - Added `saveOrders(orders)` calls in 3 endpoints:
    - POST /orders (line ~610)
    - PUT /orders/{id} (line ~670)
    - PATCH /orders/{id}/status (line ~2180)

## Data Persistence
- Orders now persist to: `server/data/orders.json`
- Same pattern as users which persist to: `server/data/users.json`
- Data survives server restarts
- All item statuses are preserved
