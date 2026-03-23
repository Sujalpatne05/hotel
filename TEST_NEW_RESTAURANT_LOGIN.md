# Test New Restaurant Login - Step by Step

## ✅ Quick Test (5 minutes)

### Step 1: Login as Super Admin
1. Open http://localhost:8080
2. Select "Super Admin" role
3. Email: `superadmin@restrohub.local`
4. Password: `super123`
5. Click Login

### Step 2: Create a New Restaurant
1. Click on "Restaurants" in the sidebar
2. Click "Add Restaurant" button
3. Fill in the form:
   - **Name**: "My Test Restaurant"
   - **Owner**: "Test Owner"
   - **City**: "Test City"
   - **Plan**: "Standard"
4. Click "Create Restaurant"
5. **IMPORTANT**: Note the admin credentials shown in the response!

### Step 3: Copy the Admin Credentials
The system will show:
- **Admin Email**: `admin{id}@restrohub.local` (e.g., `admin2@restrohub.local`)
- **Admin Password**: `admin{id}123` (e.g., `admin2123`)

**Save these credentials!**

### Step 4: Logout
1. Click on your profile icon (top right)
2. Click "Logout"

### Step 5: Login as New Admin
1. Select "Admin" role (NOT Super Admin)
2. Email: Enter the admin email from Step 3
3. Password: Enter the admin password from Step 3
4. Click Login

### Step 6: Verify Success
✅ You should see the restaurant dashboard  
✅ You can access all admin features  
✅ You can manage menu, orders, tables, etc.

---

## 🔍 What to Look For

### Success Indicators
- ✅ Login page accepts the credentials
- ✅ Dashboard loads without errors
- ✅ Restaurant name appears in the header
- ✅ All menu items are visible
- ✅ Can create orders, reservations, etc.

### Error Indicators
- ❌ "Invalid credentials" message
- ❌ Page doesn't load
- ❌ Console shows errors (F12)
- ❌ Can't access any features

---

## 📝 Example Walkthrough

### Creating Restaurant with ID 2

**Step 1**: Create restaurant named "Pizza Palace"
- System creates admin account
- Admin Email: `admin2@restrohub.local`
- Admin Password: `admin2123`

**Step 2**: Logout from Super Admin

**Step 3**: Login as Admin
- Role: Admin
- Email: `admin2@restrohub.local`
- Password: `admin2123`

**Step 4**: ✅ Login successful!
- See "Pizza Palace" dashboard
- Can manage menu, orders, tables
- Can view reports

---

## 🎯 Testing Checklist

- [ ] Backend running on port 5000
- [ ] Frontend running on port 8080
- [ ] Can login as Super Admin
- [ ] Can navigate to Restaurants page
- [ ] Can create new restaurant
- [ ] Admin credentials are displayed
- [ ] Can logout
- [ ] Can login with new admin credentials
- [ ] Dashboard loads correctly
- [ ] Can access all admin features

---

## 🐛 Troubleshooting

### "Invalid credentials" error
**Solution**:
1. Check email format: `admin{id}@restrohub.local`
2. Check password format: `admin{id}123`
3. Make sure you selected "Admin" role (not "Super Admin")
4. Clear browser cache (Ctrl+Shift+Delete)
5. Refresh page (F5)

### Can't see admin credentials
**Solution**:
1. Check browser console (F12)
2. Look for the API response
3. Or use the pattern: `admin{restaurantId}@restrohub.local` / `admin{restaurantId}123`
4. Check the restaurant ID from the restaurants list

### Backend not responding
**Solution**:
```bash
npm run backend
```

### Frontend not loading
**Solution**:
```bash
npm run dev
```

---

## 📊 Expected Behavior

### Before Fix
- ❌ Create restaurant
- ❌ Try to login with auto-generated credentials
- ❌ Get "Invalid credentials" error
- ❌ Can't access restaurant

### After Fix
- ✅ Create restaurant
- ✅ Get admin credentials
- ✅ Logout
- ✅ Login with new credentials
- ✅ Access restaurant dashboard
- ✅ Manage all features

---

## 🎓 Understanding the Credentials

### Email Format
```
admin{restaurantId}@restrohub.local
```

**Examples**:
- Restaurant ID 1: `admin1@restrohub.local`
- Restaurant ID 2: `admin2@restrohub.local`
- Restaurant ID 3: `admin3@restrohub.local`

### Password Format
```
admin{restaurantId}123
```

**Examples**:
- Restaurant ID 1: `admin1123`
- Restaurant ID 2: `admin2123`
- Restaurant ID 3: `admin3123`

---

## ✅ Verification Steps

### 1. Check Backend
```bash
curl http://localhost:5000/health
```
Should return: `{"ok":true,"service":"mock-backend"}`

### 2. Check Frontend
Open http://localhost:8080 in browser

### 3. Test Login
1. Login as Super Admin
2. Create restaurant
3. Logout
4. Login as new admin
5. Verify dashboard loads

---

## 📞 Support

### If login still fails:
1. Check browser console (F12) for errors
2. Check network tab for API responses
3. Verify backend is running
4. Verify credentials format
5. Try clearing cache and refreshing

### If you need help:
1. Check RESTAURANT_LOGIN_FIX.md for details
2. Check QUICK_REFERENCE.md for troubleshooting
3. Check backend logs (terminal running `npm run backend`)

---

## 🎉 Success!

Once you can login with the new admin credentials:
- ✅ Restaurant login is working
- ✅ Auto-admin creation is working
- ✅ System is fully functional
- ✅ Ready for production use

---

**Test Date**: March 23, 2026  
**Status**: Ready to test  
**Expected Result**: ✅ Login successful  

**Let's test it!** 🚀

