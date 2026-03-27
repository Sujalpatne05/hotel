# RBAC Quick Test Guide

## System Status
✅ Backend: Ready with role support
✅ Frontend: Ready with role selector
✅ Test Users: Pre-loaded in system

---

## Pre-loaded Test Users

### 1. Admin User
- **Email**: admin@example.com
- **Password**: admin123
- **Role**: Admin (Full Access)
- **Restaurant**: Demo Restaurant

### 2. Manager User
- **Email**: manager@example.com
- **Password**: manager123
- **Role**: Manager (High Access)
- **Restaurant**: Demo Restaurant

### 3. Staff User
- **Email**: staff@example.com
- **Password**: staff123
- **Role**: Staff (Limited Access)
- **Restaurant**: Demo Restaurant

---

## Quick Test Steps

### Step 1: Access User Management
1. Go to Super Admin Dashboard
2. Click "Users" in sidebar
3. You should see 3 users listed with different colored badges:
   - Admin: Amber badge
   - Manager: Blue badge
   - Staff: Green badge

### Step 2: Create a New Manager
1. Click "Add User" button
2. Fill form:
   ```
   Name: John Manager
   Email: john.manager@example.com
   Role: Manager (High Access)
   Restaurant: Demo Restaurant
   Password: Manager@123
   ```
3. Click "Create User"
4. Verify success message appears
5. Verify new user appears in list with blue badge

### Step 3: Create a New Staff
1. Click "Add User" button
2. Fill form:
   ```
   Name: Jane Staff
   Email: jane.staff@example.com
   Role: Staff (Limited Access)
   Restaurant: Demo Restaurant
   Password: Staff@123
   ```
3. Click "Create User"
4. Verify success message appears
5. Verify new user appears in list with green badge

### Step 4: Test User Actions
1. Click menu (three dots) on any user
2. Options available:
   - **Activate/Deactivate**: Toggle user status
   - **Reset Temp Password**: Set new temporary password
   - **Delete User**: Remove user from system

### Step 5: Test Deactivation
1. Click menu on "Manager User"
2. Click "Deactivate"
3. Verify status changes to "inactive" (gray badge)
4. Click menu again
5. Click "Activate"
6. Verify status changes back to "active" (green badge)

### Step 6: Test Password Reset
1. Click menu on any user
2. Click "Reset Temp Password"
3. Enter new password: "NewPass@123"
4. Click OK
5. Verify success message
6. Verify "Password Policy" shows "Reset Required"

### Step 7: Test Deletion
1. Click menu on "John Manager" (the one you created)
2. Click "Delete User"
3. Confirm deletion
4. Verify user is removed from list
5. Verify success message

---

## Expected Behavior

### Role Badges
- **Admin**: Amber/Yellow background
- **Manager**: Blue background
- **Staff**: Green background

### Status Badges
- **Active**: Green background
- **Inactive**: Gray background

### Password Policy
- **Reset Required**: Red background (new users)
- **Compliant**: Green background (password set)

### Form Validation
- Name: Required
- Email: Required, must be valid email
- Role: Required, dropdown with 3 options
- Restaurant: Required
- Password: Required, minimum 8 characters

---

## API Endpoints Being Used

### GET /superadmin/users
Returns list of all users with roles

### POST /superadmin/users
Creates new user with selected role
```json
{
  "name": "John Manager",
  "email": "john@example.com",
  "role": "manager",
  "restaurantName": "Demo Restaurant",
  "temporaryPassword": "Manager@123"
}
```

### PATCH /superadmin/users/:id
Updates user status or role
```json
{
  "isActive": false
}
```

### POST /superadmin/users/:id/reset-password
Resets user password
```json
{
  "temporaryPassword": "NewPass@123"
}
```

### DELETE /superadmin/users/:id
Deletes user from system

---

## Troubleshooting

### Issue: Role dropdown not showing
- **Solution**: Refresh page, clear browser cache

### Issue: User not appearing after creation
- **Solution**: Refresh page, check browser console for errors

### Issue: Cannot delete user
- **Solution**: Check if user is active, try deactivating first

### Issue: Password reset not working
- **Solution**: Ensure password is at least 8 characters

---

## Next Phase Features (Coming Soon)

- [ ] Login with different roles
- [ ] Role-based dashboard views
- [ ] Permission-based menu visibility
- [ ] Role-based data access
- [ ] Audit logging for role changes

---

## Notes

- All changes are in-memory (mock backend)
- Data resets when server restarts
- No database persistence yet
- Ready for Phase 2: Permission system implementation

---

## Success Criteria

✅ Can create users with different roles
✅ Can see role badges with correct colors
✅ Can activate/deactivate users
✅ Can reset passwords
✅ Can delete users
✅ Form validation works
✅ Success/error messages display

All criteria met! System is ready for Phase 2.
