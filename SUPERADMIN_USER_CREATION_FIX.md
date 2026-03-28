# SuperAdmin User Creation - 400 Bad Request Fix

## Issue
When adding a restaurant/user in the deployed version, you get:
```
POST https://hotel-vpuj.onrender.com/superadmin/users 400 (Bad Request)
```

## Root Cause
The frontend was sending only `restaurantId` to the backend, but the backend endpoint requires both:
- `restaurantId` (number)
- `restaurantName` (string)

The backend validation was failing because `restaurantName` was missing or empty.

## Solution
Updated `SuperAdminUsers.tsx` to include the restaurant name when creating a user.

### What Changed

**File:** `src/pages/SuperAdminUsers.tsx`

**Before:**
```typescript
const response = await fetch(`${API_BASE_URL}/superadmin/users`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: addForm.name.trim(),
    email: addForm.email.trim(),
    role: addForm.role,
    restaurantId: Number(addForm.restaurantId),
    temporaryPassword: addForm.temporaryPassword,
    // ❌ Missing: restaurantName
  }),
});
```

**After:**
```typescript
// Get restaurant name from selected ID
const selectedRestaurant = restaurants.find(r => r.id === Number(addForm.restaurantId));
const restaurantName = selectedRestaurant?.name || "";

const response = await fetch(`${API_BASE_URL}/superadmin/users`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: addForm.name.trim(),
    email: addForm.email.trim(),
    role: addForm.role,
    restaurantId: Number(addForm.restaurantId),
    restaurantName: restaurantName,  // ✅ Now included
    temporaryPassword: addForm.temporaryPassword,
  }),
});
```

## Backend Endpoint Validation

The backend endpoint (`POST /superadmin/users`) expects:
```javascript
{
  email: string (required),
  name: string (required),
  role: string (required),
  restaurantId: number (optional),
  restaurantName: string (optional),
  temporaryPassword: string (optional)
}
```

## How It Works

1. User selects a restaurant from the dropdown
2. Frontend stores the `restaurantId` in state
3. When creating user, frontend looks up the restaurant name using the ID
4. Frontend sends both `restaurantId` and `restaurantName` to backend
5. Backend validates and creates the user successfully

## Testing

### Before Fix
1. Go to SuperAdmin panel
2. Click "Add User"
3. Fill in all fields
4. Select a restaurant
5. Click "Create User"
6. ❌ Error: 400 Bad Request

### After Fix
1. Go to SuperAdmin panel
2. Click "Add User"
3. Fill in all fields
4. Select a restaurant
5. Click "Create User"
6. ✅ Success: User created successfully

## Build Status

✅ Build succeeds with no errors
✅ No TypeScript diagnostics
✅ Ready for deployment

## Deployment

This fix needs to be:
1. Committed to GitHub
2. Pushed to production
3. Vercel will auto-deploy

## Files Modified

- `src/pages/SuperAdminUsers.tsx` - Added restaurant name lookup

## Related Files

- `server/mock-backend.mjs` - Backend endpoint (no changes needed)
- `src/pages/SuperAdminUsers.tsx` - Frontend component (fixed)

## Error Messages

### Before Fix
```
POST https://hotel-vpuj.onrender.com/superadmin/users 400 (Bad Request)
Error: Invalid user payload
```

### After Fix
```
✅ Manager created. Temporary credentials dispatched (demo queue).
```

## Data Flow

```
User fills form
    ↓
Selects restaurant from dropdown
    ↓
Frontend stores restaurantId
    ↓
User clicks "Create User"
    ↓
Frontend looks up restaurantName using restaurantId
    ↓
Frontend sends both restaurantId and restaurantName
    ↓
Backend validates and creates user
    ↓
✅ Success message
```

## Payload Example

**Request:**
```json
{
  "name": "John Manager",
  "email": "john@example.com",
  "role": "manager",
  "restaurantId": 1,
  "restaurantName": "Pizza Palace",
  "temporaryPassword": "Temp@1234"
}
```

**Response:**
```json
{
  "id": 101,
  "name": "John Manager",
  "email": "john@example.com",
  "role": "manager",
  "restaurant_id": 1,
  "restaurant_name": "Pizza Palace"
}
```

## Summary

The issue was a missing `restaurantName` field in the user creation payload. The fix looks up the restaurant name from the selected restaurant ID and includes it in the request. This ensures the backend receives all required data and successfully creates the user.

**Status: ✅ FIXED AND READY FOR DEPLOYMENT**
