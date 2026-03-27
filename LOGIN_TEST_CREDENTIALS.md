# Login Test Credentials

**Status**: Ready to Test
**Date**: March 27, 2026

---

## All Available Users

### Super Admin
- **Email**: `superadmin@restrohub.local`
- **Password**: `super123`
- **Role**: Super Admin
- **Restaurant**: None (Platform-wide access)

### Demo Restaurant Users
- **Admin**
  - Email: `admin@example.com`
  - Password: `admin123`
  - Role: Admin
  - Restaurant: Demo Restaurant

- **Manager**
  - Email: `manager@example.com`
  - Password: `manager123`
  - Role: Manager
  - Restaurant: Demo Restaurant

- **Staff**
  - Email: `staff@example.com`
  - Password: `staff123`
  - Role: Staff
  - Restaurant: Demo Restaurant

### Mitu Cafe Users
- **Admin**
  - Email: `mitu@example.com`
  - Password: `mitu123`
  - Role: Admin
  - Restaurant: Mitu Cafe

### ABC Hotel Users
- **Admin** ✅ NEW
  - Email: `abc@example.com`
  - Password: `abc123`
  - Role: Admin
  - Restaurant: ABC Hotel

---

## How to Login

1. Go to login page (`/`)
2. Enter email in the "Email or Username" field
3. Enter password in the "Password" field
4. Click "Sign In"

---

## Expected Behavior

### Admin Login
- Redirects to Dashboard (`/`)
- Full access to all features
- Can see all menu items in sidebar

### Manager Login
- Redirects to Dashboard (`/`)
- Limited access (no financial data)
- Fewer menu items in sidebar

### Staff Login
- Redirects to Orders page (`/orders`)
- Very limited access
- Only sees Orders and Kitchen Display

### Super Admin Login
- Redirects to Super Admin Dashboard (`/superadmin-dashboard`)
- Platform-wide access
- Can manage restaurants, users, subscriptions

---

## Testing Steps

### Step 1: Test ABC Hotel Admin Login
1. Go to login page
2. Email: `abc@example.com`
3. Password: `abc123`
4. Click "Sign In"
5. ✅ Should redirect to Dashboard with ABC Hotel access

### Step 2: Test Other Users
Try logging in with other credentials to verify role-based access works

### Step 3: Verify Restaurant Isolation
- Login as ABC Hotel Admin
- Verify you only see ABC Hotel data
- Logout and login as Demo Restaurant Admin
- Verify you only see Demo Restaurant data

---

## Troubleshooting

### Getting 401 (Unauthorized)
- Check email is spelled correctly (case-insensitive)
- Check password matches exactly (case-sensitive)
- Verify user exists in the list above
- Check backend logs for `[LOGIN]` messages

### Getting 400 (Bad Request)
- Check form fields are filled in
- Check no extra spaces in email/password
- Check backend logs for error message

### Can't See Restaurant Data
- Verify you're logged in with correct user
- Check restaurant_id is set correctly
- Verify backend is filtering by restaurant_id

---

## Backend Logs

When logging in, check backend console for:
```
[LOGIN] Attempting login with email: abc@example.com, password: abc123, role: null
[LOGIN] Available users: [...]
[LOGIN] ✅ Login successful for user: abc@example.com
```

If you see:
```
[LOGIN] ❌ Login failed - invalid credentials
```

Then the email/password combination doesn't match any user in the system.

