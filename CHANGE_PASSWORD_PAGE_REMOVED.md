# Change Password Page - Removed & Fixed

## Problem
You were getting a **404 error** when trying to login because:
1. The `/change-password` route was removed from the app
2. But the login component was still trying to redirect to it
3. The browser was showing a password update dialog

## Root Cause
In `src/pages/AdminLogin.tsx`, the login handler was checking `mustChangePassword` and redirecting:
```javascript
if (mustChangePassword) { 
  window.location.href = "/change-password"; 
  return; 
}
```

But the route doesn't exist anymore!

## Solution Applied
Updated `src/pages/AdminLogin.tsx` to:
1. Remove the `mustChangePassword` check
2. Always go directly to dashboard after login
3. No more redirects to non-existent change-password page

**New flow:**
```javascript
// Always go directly to dashboard - no change password page
saveAuthSession(data.token, data.user.role, data.user.name,
  String(data?.user?.restaurantName || ""),
  typeof data?.user?.restaurantId === "number" ? data.user.restaurantId : null,
  false);
window.location.href = data.user.role === "superadmin" ? "/superadmin-dashboard" : "/";
```

## Result
✅ All users now login directly to their dashboard
✅ No more 404 errors
✅ No more browser password dialogs
✅ Smooth login experience

## Test It
Try logging in with any user:
- Super Admin: superadmin@restrohub.local / super123
- Admin: admin@example.com / admin123
- Manager: manager@example.com / manager123
- Staff: staff@example.com / staff123

You should go directly to the dashboard!
