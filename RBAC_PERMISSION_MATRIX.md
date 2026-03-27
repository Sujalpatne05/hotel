# RBAC Permission Matrix

## Overview
Complete permission matrix showing what each role can access and do in the system.

---

## Permission Matrix

| Feature | Admin | Manager | Staff |
|---------|:-----:|:-------:|:-----:|
| **RESTAURANT MANAGEMENT** | | | |
| View restaurant data | ✅ | ✅ | ✅ |
| Edit restaurant settings | ✅ | ❌ | ❌ |
| Delete restaurant | ✅ | ❌ | ❌ |
| Manage staff | ✅ | ✅ | ❌ |
| View all reports | ✅ | ✅ | ❌ |
| **MENU MANAGEMENT** | | | |
| View menu items | ✅ | ✅ | ✅ |
| Create menu items | ✅ | ❌ | ❌ |
| Edit menu items | ✅ | ✅ | ❌ |
| Edit prices | ✅ | ❌ | ❌ |
| Delete menu items | ✅ | ❌ | ❌ |
| Toggle availability | ✅ | ✅ | ✅ |
| Upload images | ✅ | ✅ | ❌ |
| **ORDER MANAGEMENT** | | | |
| View all orders | ✅ | ✅ | ❌ |
| View assigned orders | ✅ | ✅ | ✅ |
| Create orders | ✅ | ✅ | ✅ |
| Edit orders | ✅ | ✅ | ❌ |
| Update order status | ✅ | ✅ | ✅ |
| Delete orders | ✅ | ❌ | ❌ |
| Process refunds | ✅ | ✅ | ❌ |
| **BILLING** | | | |
| View all bills | ✅ | ✅ | ❌ |
| View own bills | ✅ | ✅ | ✅ |
| Generate bills | ✅ | ✅ | ✅ |
| Modify bill amounts | ✅ | ❌ | ❌ |
| **INVENTORY** | | | |
| View inventory | ✅ | ✅ | ✅ |
| Create items | ✅ | ❌ | ❌ |
| Edit items | ✅ | ✅ | ❌ |
| Update stock levels | ✅ | ✅ | ❌ |
| Delete items | ✅ | ❌ | ❌ |
| Report low stock | ✅ | ✅ | ✅ |
| **STAFF MANAGEMENT** | | | |
| View all staff | ✅ | ✅ | ❌ |
| Add staff | ✅ | ✅ | ❌ |
| Edit staff details | ✅ | ✅ | ❌ |
| Delete staff | ✅ | ❌ | ❌ |
| Manage payroll | ✅ | ✅ | ❌ |
| Track attendance | ✅ | ✅ | ❌ |
| **PAYMENTS** | | | |
| View payment methods | ✅ | ✅ | ❌ |
| Configure payments | ✅ | ❌ | ❌ |
| View payment reports | ✅ | ✅ | ❌ |
| Process payments | ✅ | ✅ | ✅ |
| **REPORTS & ANALYTICS** | | | |
| View dashboard | ✅ | ✅ | ❌ |
| View sales reports | ✅ | ✅ | ❌ |
| View inventory reports | ✅ | ✅ | ❌ |
| View staff reports | ✅ | ✅ | ❌ |
| Export reports | ✅ | ✅ | ❌ |
| **SETTINGS** | | | |
| View settings | ✅ | ❌ | ❌ |
| Edit settings | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ |
| Security settings | ✅ | ❌ | ❌ |
| Backup & restore | ✅ | ❌ | ❌ |
| **PROFILE** | | | |
| View own profile | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ |
| Change own password | ✅ | ✅ | ✅ |
| View other profiles | ✅ | ✅ | ❌ |

---

## Access Level Summary

### ADMIN (100% Access)
- **Full system access**
- Can perform all operations
- Can manage all users and roles
- Can access all reports and analytics
- Can modify system settings
- Can delete any data

**Use Case**: Restaurant owner, system administrator

### MANAGER (70% Access)
- **Restaurant-level access**
- Can manage staff and operations
- Can view and edit menu (not delete)
- Can process orders and refunds
- Can manage inventory
- Can view reports
- Cannot delete items or change settings

**Use Case**: Restaurant manager, shift supervisor

### STAFF (30% Access)
- **Limited operational access**
- Can view assigned orders only
- Can update order status
- Can toggle menu availability
- Can view inventory levels
- Can change own password
- Cannot modify prices or manage staff

**Use Case**: Waiter, chef, kitchen staff, cashier

---

## Data Visibility Rules

### Admin
- Sees all data across all restaurants
- Sees all user information
- Sees all financial data
- Sees all reports

### Manager
- Sees data for their restaurant only
- Sees staff information for their restaurant
- Sees financial data for their restaurant
- Sees reports for their restaurant

### Staff
- Sees only assigned orders
- Sees only own profile information
- Sees only basic inventory levels
- Cannot see financial data
- Cannot see other staff information

---

## Action Restrictions

### Admin
- Can create/edit/delete anything
- Can change any user's role
- Can reset any password
- Can deactivate any user
- Can access all features

### Manager
- Can create/edit staff (not delete)
- Can edit menu items (not delete)
- Can update inventory (not delete)
- Can process orders (not delete)
- Cannot access system settings

### Staff
- Can only update order status
- Can only toggle menu availability
- Can only change own password
- Cannot create or delete anything
- Cannot access management features

---

## Feature Access by Role

### Kitchen Display System (KDS)
- **Admin**: Full access, can manage all orders
- **Manager**: Full access, can manage all orders
- **Staff**: Can see assigned orders, update status

### Menu Management
- **Admin**: Full CRUD operations
- **Manager**: Can view and edit (not delete)
- **Staff**: Can view and toggle availability

### Inventory Management
- **Admin**: Full CRUD operations
- **Manager**: Can view and update stock
- **Staff**: Can view only

### Payroll & Attendance
- **Admin**: Full access
- **Manager**: Can manage staff attendance and payroll
- **Staff**: Can view own attendance only

### Reports & Analytics
- **Admin**: Full access to all reports
- **Manager**: Can view restaurant reports
- **Staff**: No access

### Billing & Payments
- **Admin**: Full access
- **Manager**: Can process payments and refunds
- **Staff**: Can process payments only

---

## Permission Keys (For Implementation)

### Menu Permissions
- `menu:view` - View menu items
- `menu:create` - Create menu items
- `menu:edit` - Edit menu items
- `menu:delete` - Delete menu items
- `menu:toggle_availability` - Toggle item availability

### Order Permissions
- `orders:view_all` - View all orders
- `orders:view_assigned` - View assigned orders
- `orders:create` - Create orders
- `orders:edit` - Edit orders
- `orders:delete` - Delete orders
- `orders:update_status` - Update order status

### Inventory Permissions
- `inventory:view` - View inventory
- `inventory:create` - Create items
- `inventory:edit` - Edit items
- `inventory:delete` - Delete items
- `inventory:update_stock` - Update stock levels

### Staff Permissions
- `staff:view` - View staff
- `staff:create` - Create staff
- `staff:edit` - Edit staff
- `staff:delete` - Delete staff
- `staff:manage_payroll` - Manage payroll

### Reports Permissions
- `reports:view` - View reports
- `reports:export` - Export reports
- `reports:analytics` - View analytics

### Settings Permissions
- `settings:view` - View settings
- `settings:edit` - Edit settings
- `settings:admin` - Admin settings

---

## Role Hierarchy

```
┌─────────────────────────────────────┐
│         ADMIN (100%)                │
│  Full system access & control       │
│  Can manage all users & roles       │
│  Can access all features            │
└──────────────┬──────────────────────┘
               │
               ├─ Can create/manage
               │
┌──────────────▼──────────────────────┐
│       MANAGER (70%)                 │
│  Restaurant-level management        │
│  Can manage staff & operations      │
│  Can view reports                   │
└──────────────┬──────────────────────┘
               │
               ├─ Can supervise
               │
┌──────────────▼──────────────────────┐
│        STAFF (30%)                  │
│  Limited operational access         │
│  Can perform assigned tasks         │
│  Can update own information         │
└─────────────────────────────────────┘
```

---

## Implementation Checklist

### Phase 1: Backend Setup ✅
- [x] Add role field to users table
- [x] Create role validation
- [x] Add role to API responses
- [x] Create test users with different roles

### Phase 2: Frontend Permission System ⏳
- [ ] Create usePermission hook
- [ ] Create ProtectedRoute component
- [ ] Create AccessDenied page
- [ ] Update auth context with permissions

### Phase 3: UI Updates ⏳
- [ ] Hide/show menu items by role
- [ ] Hide/show sidebar items by role
- [ ] Hide/show form fields by role
- [ ] Update dashboard by role

### Phase 4: Backend Permission Checks ⏳
- [ ] Add permission middleware
- [ ] Filter data by role
- [ ] Add audit logging
- [ ] Implement role-based access

---

## Notes

- Permissions are hierarchical (Admin > Manager > Staff)
- Each role has specific use cases
- Data is filtered based on user role
- Audit logging tracks all sensitive operations
- Permission checks happen on both frontend and backend
- System is designed for scalability

---

## Questions?

Refer to:
- `RBAC_IMPLEMENTATION_PLAN.md` - Detailed implementation plan
- `RBAC_QUICK_OVERVIEW.md` - Quick reference
- `RBAC_QUICK_TEST_GUIDE.md` - Testing guide
