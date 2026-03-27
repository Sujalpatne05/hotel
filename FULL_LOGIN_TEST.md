# Full Login Test - Staff & Manager

## Test 1: Backend Login (✅ VERIFIED)
```
POST http://localhost:5000/auth/login
Body: {"email":"staff@example.com","password":"staff123"}
Response: 200 OK ✅
```

## Test 2: Frontend Should Now Work
1. Open http://localhost:8080/admin-login
2. Enter: staff@example.com / staff123
3. Click Sign In
4. Should redirect to Orders page (/)
5. Orders page should load with data

## Expected Flow:
1. Frontend sends: `{email: "staff@example.com", password: "staff123"}` (NO role)
2. Backend responds: `{token: "...", user: {role: "staff", ...}}`
3. Frontend saves session to localStorage
4. Frontend redirects to "/"
5. App.tsx routes "/" to Orders page for staff
6. Orders page loads and fetches /orders endpoint
7. Dashboard displays

## What to Check:
- Browser DevTools → Console for errors
- Browser DevTools → Network tab for API calls
- Browser DevTools → Application → localStorage for auth data
- Backend terminal for login logs

## Current Status:
- ✅ Backend login working
- ✅ Frontend code fixed (no role parameter)
- ✅ Frontend rebuilt
- ⏳ Need to test in browser
