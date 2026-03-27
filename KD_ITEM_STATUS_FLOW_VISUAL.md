# Kitchen Display - Item Status Flow (Visual Guide)

## How It Should Look Now

### Step 1: Initial Order (Butter Chicken + Garlic Naan)
```
┌─────────────────────────────────────┐
│ ORD-1001 - Table 1                  │
│ Status: pending                     │
├─────────────────────────────────────┤
│ 1x Butter Chicken      [Start]      │
│ 2x Garlic Naan         [Start]      │
└─────────────────────────────────────┘
```

### Step 2: Click "Start" on Butter Chicken
```
┌─────────────────────────────────────┐
│ ORD-1001 - Table 1                  │
│ Status: pending                     │
├─────────────────────────────────────┤
│ 1x Butter Chicken      [Ready]      │  ← Changed to Ready button
│ 2x Garlic Naan         [Start]      │
└─────────────────────────────────────┘
```

### Step 3: Click "Ready" on Butter Chicken
```
┌─────────────────────────────────────┐
│ ORD-1001 - Table 1                  │
│ Status: pending                     │
├─────────────────────────────────────┤
│ 1x Butter Chicken      [Served]     │  ← Changed to Served button
│ 2x Garlic Naan         [Start]      │
└─────────────────────────────────────┘
```

### Step 4: Click "Served" on Butter Chicken
```
┌─────────────────────────────────────┐
│ ORD-1001 - Table 1                  │
│ Status: pending                     │
├─────────────────────────────────────┤
│ 1x Butter Chicken      [Served]     │  ← Badge, no button
│ 2x Garlic Naan         [Start]      │
└─────────────────────────────────────┘
```

### Step 5: Add Garlic Naan (Table Orders More)
```
┌─────────────────────────────────────┐
│ ORD-1001 - Table 1                  │
│ Status: pending                     │
├─────────────────────────────────────┤
│ 1x Butter Chicken      [Served]     │  ← Still served
│ 2x Garlic Naan         [Start]      │  ← New item, pending
│ 1x Paneer Tikka        [Start]      │  ← Another new item
└─────────────────────────────────────┘
```

### Step 6: Complete All Items
```
┌─────────────────────────────────────┐
│ ORD-1001 - Table 1                  │
│ Status: pending                     │
├─────────────────────────────────────┤
│ 1x Butter Chicken      [Served]     │
│ 2x Garlic Naan         [Served]     │
│ 1x Paneer Tikka        [Served]     │
└─────────────────────────────────────┘
Order disappears from active orders
```

## Key Behaviors

### Button Progression
- **Pending** → Click "Start" → **Preparing** (shows "Ready" button)
- **Preparing** → Click "Ready" → **Ready** (shows "Served" button)
- **Ready** → Click "Served" → **Served** (shows badge, no button)

### What Changed
1. ✅ Each item has its own status (not order-level)
2. ✅ Buttons change immediately when clicked (optimistic update)
3. ✅ Backend updates in background (won't revert UI)
4. ✅ Refresh pauses for 1 second after update (prevents overwrite)
5. ✅ New items added to order show as "Pending" with "Start" button
6. ✅ Served items show as badge (no button)

### Why It Works Now
- **Before**: Clicking "Start" would revert to "Start" because refresh overwrote the UI
- **After**: 
  1. Click "Start" → UI updates immediately to "Ready"
  2. Backend request sent in background
  3. Refresh paused for 1 second (won't overwrite)
  4. After 1 second, refresh resumes with updated data from backend
  5. UI stays in sync with backend

## Testing Checklist
- [ ] Click "Start" on item → Button changes to "Ready" immediately
- [ ] Click "Ready" on item → Button changes to "Served" immediately
- [ ] Click "Served" on item → Shows badge, no button
- [ ] Add new items to order → New items show "Start" button
- [ ] Served items stay served when new items added
- [ ] Refresh page → All statuses persist correctly
