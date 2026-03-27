# Quick Start - Test Multi-Tenant Fixes

**Time**: 5 minutes
**Status**: Ready to test

---

## Step 1: Verify Backend is Running

Backend should already be running on `http://localhost:5000`

Check by opening DevTools and looking at Network tab - you should see API calls going to localhost:5000

---

## Step 2: Test ABC Hotel Admin Login

1. Open `http://localhost:3000`
2. Click "Admin Login"
3. Enter:
   - Email: `abc@example.com`
   - Password: `abc123`
4. Click "Sign In"

**Expected**: Login succeeds, redirected to Dashboard

---

## Step 3: Verify Data Isolation

1. Go to Menu page
2. Open DevTools → Network tab
3. Look for GET `/menu` request
4. Check Response tab

**Expected Response**:
```json
[
  { id: 1, restaurant_id: 3, name: "...", ... },
  { id: 2, restaurant_id: 3, name: "...", ... }
]
```

**Key Point**: All items have `restaurant_id: 3` (ABC Hotel)

---

## Step 4: Test Another Restaurant

1. Logout (click profile → logout)
2. Login as Mitu Cafe:
   - Email: `mitu@example.com`
   - Password: `mitu123`
3. Go to Menu page
4. Check Network tab for GET `/menu` response

**Expected Response**:
```json
[
  { id: 1, restaurant_id: 2, name: "...", ... },
  { id: 2, restaurant_id: 2, name: "...", ... }
]
```

**Key Point**: All items have `restaurant_id: 2` (Mitu Cafe)

---

## Step 5: Verify Token Format

1. Open DevTools → Application → Local Storage
2. Look for `restaurantId` key
3. ABC Hotel admin should have: `3`
4. Mitu Cafe admin should have: `2`

---

## Success Criteria

✅ All tests pass when:
- ABC Hotel admin sees only ABC Hotel data
- Mitu Cafe admin sees only Mitu Cafe data
- No cross-restaurant data visible
- Token includes restaurant_id

---

## If Something Fails

### Login fails with 401
- Check backend is running: `npm run dev`
- Check credentials are correct
- Check browser console for errors

### Wrong data visible
- Check Network tab for API response
- Verify restaurant_id in response
- Check token in localStorage

### Permission denied
- Check user role has permission
- Check browser console for error
- Verify permission middleware is working

---

## Test Users Quick Reference

| Email | Password | Restaurant |
|-------|----------|------------|
| abc@example.com | abc123 | ABC Hotel |
| mitu@example.com | mitu123 | Mitu Cafe |
| admin@example.com | admin123 | Demo Restaurant |
| superadmin@restrohub.local | super123 | All |

---

## What Was Fixed

✅ Token now includes restaurant_id
✅ All endpoints filter by restaurant_id
✅ Users see only their restaurant's data
✅ No cross-restaurant data leakage
✅ All modifications verified for ownership

---

## Next Steps

1. If tests pass: System is ready
2. If tests fail: Check backend logs
3. Run full test suite: See `TEST_MULTI_TENANT_FIXES.md`

---
