# Simple Restaurant Login Guide

## ✅ Step-by-Step (Copy & Paste)

### Step 1: Login as Super Admin
```
Email: superadmin@restrohub.local
Password: super123
Role: Super Admin
```

### Step 2: Create Restaurant
1. Click "Restaurants" in sidebar
2. Click "Add Restaurant"
3. Fill in:
   - Name: `My Restaurant`
   - Owner: `My Name`
   - City: `My City`
   - Plan: `Standard`
4. Click "Create Restaurant"

### Step 3: Copy the Credentials
When restaurant is created, you'll see:
```
admin_email: admin2@restrohub.local
admin_password: admin2123
```

**COPY THESE EXACTLY!**

### Step 4: Logout
Click profile icon → Logout

### Step 5: Login as New Admin
```
Email: admin2@restrohub.local
Password: admin2123
Role: Admin
```

### Step 6: ✅ Done!
You should see the restaurant dashboard.

---

## 🔑 The Pattern

When you create restaurant with ID `X`:
- Email: `adminX@restrohub.local`
- Password: `adminX123`

**Examples**:
- Restaurant ID 2: `admin2@restrohub.local` / `admin2123`
- Restaurant ID 3: `admin3@restrohub.local` / `admin3123`
- Restaurant ID 4: `admin4@restrohub.local` / `admin4123`

---

## ⚠️ Common Mistakes

❌ **Wrong**: Using your personal email  
✅ **Right**: Using `admin{id}@restrohub.local`

❌ **Wrong**: Selecting "Super Admin" role  
✅ **Right**: Selecting "Admin" role

❌ **Wrong**: Modifying the password  
✅ **Right**: Using exact password from response

❌ **Wrong**: Adding spaces or special characters  
✅ **Right**: Copying exactly as shown

---

## 🧪 Quick Test

1. Open: http://localhost:5000/debug/users
2. Look for your new admin account
3. Copy the email exactly
4. Use that email to login

---

## ✅ Checklist

- [ ] Logged in as Super Admin
- [ ] Created restaurant
- [ ] Copied admin credentials
- [ ] Logged out
- [ ] Logged in with new credentials
- [ ] ✅ Dashboard loaded!

---

**That's it!** 🎉

