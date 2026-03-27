# RBAC Quick Overview

## Three User Roles

### 1. ADMIN (Full Access - 100%)
```
┌─────────────────────────────────┐
│ ADMIN - Full Control            │
├─────────────────────────────────┤
│ ✅ Create/Edit/Delete Everything│
│ ✅ Manage all users             │
│ ✅ View all reports             │
│ ✅ System settings              │
│ ✅ Security & backups           │
└─────────────────────────────────┘
```

### 2. MANAGER (High Access - 70%)
```
┌─────────────────────────────────┐
│ MANAGER - Restaurant Control    │
├─────────────────────────────────┤
│ ✅ Manage staff                 │
│ ✅ Edit menu (not delete)       │
│ ✅ View/process orders          │
│ ✅ Manage inventory             │
│ ✅ View reports                 │
│ ❌ Cannot delete items          │
│ ❌ Cannot change settings       │
└─────────────────────────────────┘
```

### 3. STAFF (Limited Access - 30%)
```
┌─────────────────────────────────┐
│ STAFF - Order Management        │
├─────────────────────────────────┤
│ ✅ View assigned orders         │
│ ✅ Update order status          │
│ ✅ Toggle menu availability     │
│ ✅ View inventory               │
│ ✅ Change own password          │
│ ❌ Cannot modify prices         │
│ ❌ Cannot manage staff          │
│ ❌ Cannot view reports          │
└─────────────────────────────────┘
```

---

## Permission Matrix

| Feature | Admin | Manager | Staff |
|---------|-------|---------|-------|
| **Menu** | ✅ Full | ✅ Edit | ✅ View |
| **Orders** | ✅ Full | ✅ Manage | ✅ Assigned |
| **Inventory** | ✅ Full | ✅ Edit | ✅ View |
| **Staff** | ✅ Full | ✅ Manage | ❌ No |
| **Reports** | ✅ Full | ✅ View | ❌ No |
| **Settings** | ✅ Full | ❌ No | ❌ No |
| **Users** | ✅ Full | ❌ No | ❌ No |

---

## Implementation Steps

### Step 1: Backend
- Add role field to users table
- Create permissions system
- Add role checks to API endpoints
- Filter data by role

### Step 2: Frontend
- Create permission checking hook
- Create protected routes
- Update components based on role
- Hide/show UI elements

### Step 3: UI Updates
- Update user creation form
- Add role selector
- Update sidebar for each role
- Add access denied page

### Step 4: Testing
- Test each role's access
- Test permission boundaries
- Security testing
- Performance testing

---

## User Creation Flow

```
SuperAdmin
    ↓
Create User
    ↓
Select Role
    ├─ Admin (Full Access)
    ├─ Manager (High Access)
    └─ Staff (Limited Access)
    ↓
Assign to Restaurant
    ↓
Send Credentials
```

---

## Dashboard Views

### Admin Dashboard
- All restaurants
- All users
- All reports
- System settings
- Full control

### Manager Dashboard
- Restaurant data
- Staff management
- Order management
- Inventory
- Reports

### Staff Dashboard
- Assigned orders
- Menu management
- Basic inventory
- Own profile
- Limited features

---

## Key Benefits

✅ **Security** - Prevent unauthorized access
✅ **Scalability** - Easy to add new roles
✅ **Flexibility** - Granular permissions
✅ **Compliance** - Audit trail
✅ **User Experience** - Simplified UI
✅ **Maintenance** - Centralized control

---

## Permission Levels

```
Admin (100%)
  ├─ Create/Edit/Delete
  ├─ Manage users
  ├─ View all data
  └─ System settings

Manager (70%)
  ├─ Edit/View
  ├─ Manage staff
  ├─ View reports
  └─ Limited settings

Staff (30%)
  ├─ View/Update
  ├─ Assigned tasks
  ├─ Basic operations
  └─ Own profile
```

---

## Next Steps

1. ✅ Review this plan
2. ⏳ Approve role definitions
3. ⏳ Start backend implementation
4. ⏳ Add frontend components
5. ⏳ Update UI
6. ⏳ Test thoroughly
7. ⏳ Deploy

Ready to implement? Let's start!
