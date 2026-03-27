# Create ABC Hotel Admin User - Step by Step

**Status**: Ready to Test
**Date**: March 27, 2026

---

## Current Backend State

### Restaurants
- ID: 1 - Demo Restaurant
- ID: 2 - Mitu Cafe
- ID: 3 - ABC Hotel ✅ (Just added)

### Users
- ID: 1 - Super Admin (superadmin@restrohub.local)
- ID: 2 - Admin User (admin@example.com) - Demo Restaurant
- ID: 3 - Manager User (manager@example.com) - Demo Restaurant
- ID: 4 - Staff User (staff@example.com) - Demo Restaurant
- ID: 5 - Mitu Admin (mitu@example.com) - Mitu Cafe

### Next User ID
- nextUserId = 6 (so next user will have ID 6)

---

## Step-by-Step: Create ABC Hotel Admin User

### Step 1: Make Sure You're Logged In as Super Admin
- You should be on the Super Admin dashboard
- If not, go to `/superadmin-login`
- Email: `superadmin@restrohub.local`
- Password: `super123`

### Step 2: Go to User Access Control
- Click "User Access Control" in the sidebar
- You should see the list of existing users (5 users)

### Step 3: Click "Add User" Button
- Click the "Add User" button (top right)
- A modal form should appear

### Step 4: Fill in the Form

**Full Name:**
```
ABC Admin
```

**Email (Login ID):**
```
abc@example.com
```

**Role:**
```
Admin (Full Access)
```

**Restaurant:**
```
ABC Hotel  ← Should now appear in dropdown!
```

**Temporary Password:**
```
abc123
```

### Step 5: Click "Create User"
- Click the "Create User" button
- You should see a success message: "Admin created. Temporary credentials dispatched (demo queue)."

---

## What Happens Behind the Scenes

### Frontend Sends
```json
{
  "name": "ABC Admin",
  "email": "abc@example.com",
  "role": "admin",
  "restaurantId": 3,
  "temporaryPassword": "abc123"
}
```

### Backend Receives
```
[SUPERADMIN] Creating user with body: {...}
[SUPERADMIN] Parsed: email=abc@example.com, name=ABC Admin, role=admin, restaurantId=3
[SUPERADMIN] ✅ Restaurant found: ABC Hotel
[USER] ✅ Created user: abc@example.com (admin) for restaurant 3
```

### Backend Creates User
```javascript
{
  id: 6,
  name: "ABC Admin",
  email: "abc@example.com",
  password: "abc123",
  role: "admin",
  restaurant_id: 3,
  restaurant_name: "ABC Hotel",
  is_active: true,
  must_change_password: true
}
```

### User Added to Array
- User is added to the `users` array in memory
- User can now login immediately
- User persists until backend restart

---

## Step 6: Verify User Was Created

### Option A: Check User List
- The new user "ABC Admin" should appear in the user list
- Email: abc@example.com
- Role: Admin
- Restaurant: ABC Hotel
- Status: Active

### Option B: Check Backend Logs
- Look for `[USER] ✅ Created user: abc@example.com (admin) for restaurant 3`

### Option C: Check Debug Endpoint
- Go to `http://localhost:5000/debug/users`
- You should see the new user in the JSON response

---

## Step 7: Test Login with New User

### Logout from Super Admin
- Click logout or go to `/`

### Login with ABC Admin
- Go to login page (`/`)
- Email: `abc@example.com`
- Password: `abc123`
- Click "Sign In"

### Expected Result
✅ Redirected to Dashboard with access to ABC Hotel

---

## Demo Mode Notes

**In-Memory Storage:**
- Users created through the UI are stored in memory
- They persist while the backend is running
- They are lost when the backend restarts

**To Make Permanent:**
- Would need a database (PostgreSQL, MongoDB, etc.)
- Would need to save to database instead of in-memory array
- This is Phase 5+ work

**For Now:**
- Demo mode is perfect for testing
- Users persist during the session
- Easy to test and verify functionality

---

## Troubleshooting

### Restaurant Dropdown is Empty
- Make sure ABC Hotel was added to the backend
- Check: `const restaurants = [...]` in `server/mock-backend.mjs`
- Should have 3 restaurants: Demo Restaurant, Mitu Cafe, ABC Hotel

### Getting 400 Error
- Check backend logs for `[SUPERADMIN]` messages
- Verify all form fields are filled in
- Make sure email is unique (not already in system)

### User Created But Can't Login
- Check email and password match exactly (case-sensitive)
- Verify user appears in user list
- Try `/debug/users` endpoint to see all users

### User Disappears After Restart
- This is expected in demo mode
- Users are stored in memory, not in database
- Restart backend to reset to initial state

---

## Next Steps

1. Create ABC Hotel Admin user (abc@example.com / abc123)
2. Verify user appears in user list
3. Logout and login with new user
4. Verify you see ABC Hotel dashboard
5. Create more users for ABC Hotel (Manager, Staff)
6. Test role-based access

