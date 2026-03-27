# Login Test Instructions

## What to Do
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to http://localhost:8080/admin-login
4. Enter credentials:
   - Email: staff@example.com
   - Password: staff123
5. Click "Sign In"
6. Watch the console for debug messages

## Expected Console Output
```
✅ Login successful: { role: "staff", name: "Staff User", restaurantId: 1 }
✅ Session saved, redirecting...
✅ Redirecting to: /
📋 Orders page loading, headers: ✅ present
📋 Fetching orders from: http://localhost:5000/orders
📋 Orders response: { status: 200, dataLength: X }
📋 Orders loaded: X
```

## If You See Errors
- Check Network tab to see actual API responses
- Look for 401/403 errors (auth issues)
- Check if /orders endpoint is returning data

## Backend Logs
Check terminal 4 for backend logs showing:
```
[LOGIN] Attempting login with email: staff@example.com, role: null
[LOGIN] ✅ Login successful for user: staff@example.com
```

## Current Status
- ✅ Backend login working (tested with curl)
- ✅ Frontend code fixed (no role parameter)
- ✅ Frontend rebuilt
- ⏳ Need to test full flow in browser
