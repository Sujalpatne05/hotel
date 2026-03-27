# Debug User Creation Issue

**Status**: Debugging
**Date**: March 27, 2026

---

## Issue

POST to `/superadmin/users` returns 400 (Bad Request) when trying to create a new user.

---

## Debugging Steps

### Step 1: Check Backend Logs

When you try to create a user, look for these logs in the backend console:

```
[SUPERADMIN] Creating user with body: {...}
[SUPERADMIN] Body keys: [...]
[SUPERADMIN] Parsed: email=..., name=..., role=..., restaurantId=...
```

**What to look for:**
- Is the body being logged?
- Are all fields present?
- Is `restaurantId` a number or undefined?

### Step 2: Check Restaurants Endpoint

Open browser DevTools (F12) and go to Network tab.

Make a request to check if restaurants are being fetched:
```
GET http://localhost:5000/superadmin/restaurants
```

**Expected Response:**
```json
[
  { id: 1, name: "Demo Restaurant", ... },
  { id: 2, name: "Mitu Cafe", ... }
]
```

### Step 3: Check Form State

In the browser console, add this to the form submission:

```javascript
// In SuperAdminUsers.tsx, add before the fetch call:
console.log("Form data being sent:", {
  name: addForm.name.trim(),
  email: addForm.email.trim(),
  role: addForm.role,
  restaurantId: Number(addForm.restaurantId),
  temporaryPassword: addForm.temporaryPassword,
});
```

**What to look for:**
- Is `restaurantId` a number (e.g., 1 or 2)?
- Or is it `NaN`?
- Are all other fields present?

### Step 4: Check Backend Validation

The backend checks for:
1. `body.email` - must exist
2. `body.name` - must exist
3. `body.role` - must exist
4. `body.role` - must be one of: "admin", "manager", "staff"
5. `body.restaurantId` - if provided, restaurant must exist

If any of these fail, you get a 400 error.

---

## Common Issues

### Issue 1: Restaurants Dropdown is Empty

**Symptom**: Can't select a restaurant in the form

**Cause**: `/superadmin/restaurants` endpoint is not returning data

**Solution**:
1. Check backend logs for errors
2. Verify restaurants array is initialized in backend
3. Check if auth headers are being sent correctly

### Issue 2: restaurantId is NaN

**Symptom**: Form submits but backend says "Restaurant not found"

**Cause**: `restaurantId` is being converted to `NaN` instead of a number

**Solution**:
1. Check that a restaurant is actually selected in the dropdown
2. Verify the dropdown value is a string number (e.g., "1" or "2")
3. Check that `Number(addForm.restaurantId)` converts correctly

### Issue 3: User Already Exists

**Symptom**: Backend returns "User with this email already exists"

**Cause**: You're trying to create a user with an email that's already in the system

**Solution**:
1. Use a different email address
2. Or delete the existing user first

---

## Quick Test

### Test 1: Check Restaurants

```bash
curl -X GET http://localhost:5000/superadmin/restaurants \
  -H "Authorization: Bearer token_superadmin_test"
```

**Expected**: Returns array of restaurants

### Test 2: Check Users

```bash
curl -X GET http://localhost:5000/superadmin/users \
  -H "Authorization: Bearer token_superadmin_test"
```

**Expected**: Returns array of users

### Test 3: Create User

```bash
curl -X POST http://localhost:5000/superadmin/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token_superadmin_test" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "role": "manager",
    "restaurantId": 2,
    "temporaryPassword": "test123"
  }'
```

**Expected**: Returns 201 with new user data

---

## Backend State

### Current Restaurants
- ID: 1, Name: "Demo Restaurant"
- ID: 2, Name: "Mitu Cafe"

### Current Users
- ID: 1, Email: "superadmin@restrohub.local", Role: "superadmin"
- ID: 2, Email: "admin@example.com", Role: "admin", Restaurant: 1
- ID: 3, Email: "manager@example.com", Role: "manager", Restaurant: 1
- ID: 4, Email: "staff@example.com", Role: "staff", Restaurant: 1
- ID: 5, Email: "mitu@example.com", Role: "admin", Restaurant: 2

### Next User ID
- nextUserId = 6 (so next user will have ID 6)

---

## What to Check

1. **Backend is running**: `curl http://localhost:5000/health`
2. **Restaurants endpoint works**: `curl http://localhost:5000/superadmin/restaurants`
3. **Form has restaurants**: Check dropdown in UI
4. **Form data is correct**: Check browser console logs
5. **Backend receives data**: Check backend console logs

---

## Next Steps

1. Run the quick tests above
2. Check the backend logs when creating a user
3. Check the browser console for form data
4. Report what you see in the logs

