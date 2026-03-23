# Debug Restaurant Login Issue

## 🔍 What's Happening

When you try to login with a newly created restaurant, you get "Invalid credentials". This is because:

1. **The credentials shown might not be what you're entering**
2. **The email format needs to be exact**
3. **The password needs to be exact**

## 🧪 Debug Steps

### Step 1: Check What Users Exist
Open this URL in your browser:
```
http://localhost:5000/debug/users
```

This will show you ALL users in the system with their:
- Email
- Role
- Restaurant ID
- Restaurant Name

**Example response**:
```json
{
  "users": [
    {
      "id": 1,
      "name": "Super Admin",
      "email": "superadmin@restrohub.local",
      "role": "superadmin",
      "restaurant_id": null,
      "restaurant_name": null
    },
    {
      "id": 2,
      "name": "Admin User",
      "email": "admin@example.com",
      "role": "admin",
      "restaurant_id": 1,
      "restaurant_name": "Demo Restaurant"
    },
    {
      "id": 3,
      "name": "My Test Restaurant Admin",
      "email": "admin2@restrohub.local",
      "role": "admin",
      "restaurant_id": 2,
      "restaurant_name": "My Test Restaurant"
    }
  ]
}
```

### Step 2: Check Backend Logs
Look at the terminal where you ran `npm run backend`. You should see logs like:

```
[RESTAURANT] ✅ Created restaurant: My Test Restaurant (ID: 2)
[RESTAURANT] ✅ Created admin account: admin2@restrohub.local / admin2123
[RESTAURANT] Total users now: 3
```

And when you try to login:
```
[LOGIN] Attempting login with email: admin2@restrohub.local, role: admin
[LOGIN] Available users: [
  { email: 'superadmin@restrohub.local', role: 'superadmin' },
  { email: 'admin@example.com', role: 'admin' },
  { email: 'admin2@restrohub.local', role: 'admin' }
]
[LOGIN] ✅ Login successful for user: admin2@restrohub.local
```

Or if it fails:
```
[LOGIN] Attempting login with email: sujalpathne52@gmail.com, role: admin
[LOGIN] Available users: [...]
[LOGIN] ❌ Login failed - invalid credentials
```

## 🎯 The Issue

From your screenshot, you're trying to login with `sujalpathne52@gmail.com` but that email doesn't exist in the system!

**The correct format for newly created restaurants is**:
```
Email: admin{restaurantId}@restrohub.local
Password: admin{restaurantId}123
```

## ✅ Correct Login Process

### 1. Create Restaurant (as Super Admin)
- Go to Restaurants → Add Restaurant
- Fill in details
- Click Create
- **IMPORTANT**: Note the response showing:
  - `admin_email`: The email to use
  - `admin_password`: The password to use

### 2. Copy the Exact Credentials
The response will show something like:
```
admin_email: admin2@restrohub.local
admin_password: admin2123
```

**Copy these EXACTLY** - don't modify them!

### 3. Logout

### 4. Login with Exact Credentials
- Select "Admin" role
- Email: `admin2@restrohub.local` (exactly as shown)
- Password: `admin2123` (exactly as shown)
- Click Login

### 5. ✅ Should Work!

## 🐛 Troubleshooting

### "Invalid credentials" error

**Check 1**: Is the email exactly right?
```bash
# Check what users exist
curl http://localhost:5000/debug/users
```

**Check 2**: Are you using the right role?
- Must select "Admin" (not "Super Admin")

**Check 3**: Is the password exactly right?
- No spaces
- Correct capitalization
- Correct numbers

**Check 4**: Did you copy from the response?
- When you create a restaurant, the response shows the credentials
- Copy them exactly from there

**Check 5**: Check backend logs
- Look at terminal running `npm run backend`
- See what email/password it created
- See what email/password you're trying to login with

## 📝 Example Walkthrough

### Creating Restaurant

**Step 1**: Login as Super Admin
- Email: `superadmin@restrohub.local`
- Password: `super123`

**Step 2**: Go to Restaurants → Add Restaurant
- Name: "Pizza Palace"
- Owner: "John Doe"
- City: "New York"
- Plan: "Standard"

**Step 3**: Click Create
- System creates restaurant with ID 2
- System creates admin account
- Response shows:
  ```
  admin_email: admin2@restrohub.local
  admin_password: admin2123
  ```

**Step 4**: Backend logs show:
```
[RESTAURANT] ✅ Created restaurant: Pizza Palace (ID: 2)
[RESTAURANT] ✅ Created admin account: admin2@restrohub.local / admin2123
```

### Logging In

**Step 1**: Logout from Super Admin

**Step 2**: Go to Admin Login
- Select "Admin" role
- Email: `admin2@restrohub.local`
- Password: `admin2123`

**Step 3**: Click Login

**Step 4**: Backend logs show:
```
[LOGIN] Attempting login with email: admin2@restrohub.local, role: admin
[LOGIN] Available users: [...]
[LOGIN] ✅ Login successful for user: admin2@restrohub.local
```

**Step 5**: ✅ Dashboard loads!

## 🔑 Key Points

1. **Email format**: `admin{id}@restrohub.local`
2. **Password format**: `admin{id}123`
3. **Role**: Must be "Admin" (not "Super Admin")
4. **Exact match**: Copy credentials exactly from response
5. **No modifications**: Don't change the email or password

## 📊 Debug Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 8080
- [ ] Can login as Super Admin
- [ ] Can create restaurant
- [ ] Check `/debug/users` endpoint
- [ ] Check backend logs for restaurant creation
- [ ] Copy exact credentials from response
- [ ] Logout
- [ ] Try login with exact credentials
- [ ] Check backend logs for login attempt
- [ ] ✅ Login successful!

## 🆘 If Still Not Working

1. **Check `/debug/users` endpoint**
   - Does the new admin account exist?
   - Is the email correct?

2. **Check backend logs**
   - Did restaurant creation succeed?
   - What email/password was created?
   - What email/password are you trying?

3. **Check frontend**
   - Are you entering the email correctly?
   - Are you entering the password correctly?
   - Did you select "Admin" role?

4. **Check browser console (F12)**
   - What error message is shown?
   - What is the API response?

5. **Restart backend**
   ```bash
   npm run backend
   ```

## 📞 Support

If you're still having issues:

1. Check the `/debug/users` endpoint
2. Check the backend logs
3. Verify the exact credentials
4. Try the exact credentials from the response
5. Check browser console for errors

---

**Debug Endpoint**: http://localhost:5000/debug/users  
**Backend Logs**: Check terminal running `npm run backend`  
**Status**: Ready to debug  

