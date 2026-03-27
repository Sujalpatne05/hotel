# Admin Credentials Fix - Restaurant Creation

## Problem Found
When creating a new restaurant in the Super Admin panel, the admin email and password you entered were **NOT being sent to the backend**. The system was using auto-generated default credentials instead.

### What Was Happening:
- Frontend collected admin credentials: `adminOneForm.name`, `adminOneForm.email`, `adminOneForm.temporaryPassword`
- But when sending the restaurant creation request, these fields were **NOT included** in the request body
- Backend was looking for: `admin_name`, `admin_email`, `admin_password`
- Since they weren't sent, backend used defaults: `admin2@restrohub.local` / `admin2123`

## Solution Applied
Updated `src/pages/SuperAdminRestaurants.tsx` in the `handleAdd` function:

**Before:**
```javascript
const createResponse = await fetch(`${API_BASE_URL}/superadmin/restaurants`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: form.name.trim(),
    owner: form.owner.trim(),
    city: form.city.trim(),
    plan: form.plan,
    status: "Active",
    logo: form.logo || null,
    subscriptionStartDate: form.subscriptionStartDate,
    subscriptionExpiryDate: form.subscriptionExpiryDate,
    // ❌ Admin credentials NOT included
  }),
});
```

**After:**
```javascript
const createResponse = await fetch(`${API_BASE_URL}/superadmin/restaurants`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: form.name.trim(),
    owner: form.owner.trim(),
    city: form.city.trim(),
    plan: form.plan,
    status: "Active",
    logo: form.logo || null,
    subscriptionStartDate: form.subscriptionStartDate,
    subscriptionExpiryDate: form.subscriptionExpiryDate,
    // ✅ Include admin credentials if quick admin is enabled
    ...(quickAdminEnabled && {
      admin_name: adminOneForm.name.trim(),
      admin_email: adminOneForm.email.trim(),
      admin_password: adminOneForm.temporaryPassword.trim(),
    }),
  }),
});
```

## How It Works Now
1. When you create a restaurant with "Quick Admin Setup" enabled
2. You enter: Admin Name, Admin Email, Admin Password
3. These are now **sent to the backend** in the request
4. Backend receives them and creates the admin user with **YOUR credentials**
5. Admin user is saved to `server/data/users.json` with your email and password

## Testing
Create a new restaurant with:
- Restaurant Name: Test Restaurant
- Owner: Your Name
- Admin 1 Email: **youremail@example.com**
- Admin 1 Password: **yourpassword123**

The admin user will be created with exactly those credentials and saved to the backend!

## Files Modified
- `src/pages/SuperAdminRestaurants.tsx` - Added admin credentials to request body
