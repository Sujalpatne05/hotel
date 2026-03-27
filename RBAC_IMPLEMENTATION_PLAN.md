# Role-Based Access Control (RBAC) Implementation Plan

## Overview
Implement a comprehensive RBAC system for restaurant management with three user roles: Admin, Manager, and Staff. Each role has specific permissions and access levels.

---

## 1. Role Hierarchy & Access Levels

### Role Levels (from highest to lowest)
```
Admin (Full Access) 
  ↓
Manager (High Access)
  ↓
Staff (Limited Access)
```

---

## 2. Detailed Permission Matrix

### ADMIN (Full Access - 100%)
**Restaurant Management:**
- ✅ Create/Edit/Delete restaurants
- ✅ View all restaurant data
- ✅ Manage all staff and managers
- ✅ Access all reports and analytics

**Menu Management:**
- ✅ Create/Edit/Delete menu items
- ✅ Manage categories
- ✅ Set prices
- ✅ Upload images

**Orders & Billing:**
- ✅ View all orders
- ✅ Modify orders
- ✅ Process refunds
- ✅ View all bills
- ✅ Generate reports

**Inventory:**
- ✅ Create/Edit/Delete inventory items
- ✅ Manage stock levels
- ✅ Set reorder points
- ✅ View inventory reports

**Staff Management:**
- ✅ Add/Edit/Delete staff
- ✅ Manage payroll
- ✅ Track attendance
- ✅ Assign roles

**Payments:**
- ✅ View all payment methods
- ✅ Configure payment settings
- ✅ View payment reports

**Settings:**
- ✅ System settings
- ✅ User management
- ✅ Security settings
- ✅ Backup & restore

---

### MANAGER (High Access - 70%)
**Restaurant Management:**
- ✅ View restaurant data
- ✅ Manage staff (add/edit/delete)
- ✅ View reports
- ❌ Cannot create/delete restaurants
- ❌ Cannot manage other managers

**Menu Management:**
- ✅ View menu items
- ✅ Edit menu items (name, price, availability)
- ✅ Upload images
- ❌ Cannot delete menu items
- ❌ Cannot create new categories

**Orders & Billing:**
- ✅ View all orders
- ✅ Modify order status
- ✅ View bills
- ✅ Process refunds (up to limit)
- ✅ Generate daily reports
- ❌ Cannot delete orders
- ❌ Cannot modify prices

**Inventory:**
- ✅ View inventory
- ✅ Update stock levels
- ✅ Create restock requests
- ✅ View inventory reports
- ❌ Cannot delete items
- ❌ Cannot modify categories

**Staff Management:**
- ✅ View staff list
- ✅ Add staff
- ✅ Edit staff details
- ✅ Track attendance
- ✅ Manage payroll
- ❌ Cannot delete staff
- ❌ Cannot change staff roles

**Payments:**
- ✅ View payment methods
- ✅ View payment reports
- ❌ Cannot configure payment settings

**Settings:**
- ✅ View basic settings
- ❌ Cannot modify system settings
- ❌ Cannot manage users
- ❌ Cannot access security settings

---

### STAFF (Limited Access - 30%)
**Restaurant Management:**
- ✅ View basic restaurant info
- ❌ Cannot modify anything
- ❌ Cannot view sensitive data

**Menu Management:**
- ✅ View menu items
- ✅ Mark items as available/unavailable
- ❌ Cannot edit prices
- ❌ Cannot upload images
- ❌ Cannot delete items

**Orders & Billing:**
- ✅ View assigned orders
- ✅ Update order status (pending → preparing → ready → served)
- ✅ View own bills
- ❌ Cannot modify prices
- ❌ Cannot process refunds
- ❌ Cannot view other staff's orders

**Inventory:**
- ✅ View inventory levels
- ✅ Report low stock
- ❌ Cannot modify stock
- ❌ Cannot delete items

**Staff Management:**
- ✅ View own profile
- ✅ Update own password
- ❌ Cannot view other staff
- ❌ Cannot manage staff

**Payments:**
- ❌ No access to payment settings
- ❌ Cannot view payment reports

**Settings:**
- ✅ Change own password
- ❌ Cannot access other settings

---

## 3. Database Schema Changes

### Users Table (Enhanced)
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'staff') NOT NULL,
  restaurant_id INT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);
```

### Permissions Table (Optional - for granular control)
```sql
CREATE TABLE permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role ENUM('admin', 'manager', 'staff') NOT NULL,
  resource VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  allowed BOOLEAN DEFAULT true,
  UNIQUE KEY (role, resource, action)
);
```

### Role Permissions Table
```sql
CREATE TABLE role_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role ENUM('admin', 'manager', 'staff') NOT NULL,
  permission_key VARCHAR(100) NOT NULL,
  UNIQUE KEY (role, permission_key)
);
```

---

## 4. Frontend Implementation Strategy

### 4.1 Authentication & Authorization
```typescript
// Store in localStorage/session
{
  user: {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "manager",
    restaurantId: 1
  },
  permissions: [
    "orders:view",
    "orders:edit",
    "menu:view",
    "menu:edit",
    ...
  ]
}
```

### 4.2 Permission Checking Hook
```typescript
// usePermission.ts
function usePermission(resource: string, action: string) {
  const { permissions } = useAuth();
  return permissions.includes(`${resource}:${action}`);
}

// Usage
const canEditMenu = usePermission('menu', 'edit');
if (!canEditMenu) return <AccessDenied />;
```

### 4.3 Protected Routes
```typescript
// ProtectedRoute.tsx
function ProtectedRoute({ 
  component: Component, 
  requiredRole, 
  requiredPermissions 
}) {
  const { user, permissions } = useAuth();
  
  if (!user) return <Navigate to="/login" />;
  if (requiredRole && user.role !== requiredRole) 
    return <AccessDenied />;
  if (requiredPermissions && !hasAllPermissions(permissions, requiredPermissions))
    return <AccessDenied />;
    
  return <Component />;
}
```

### 4.4 UI Component Visibility
```typescript
// Conditional rendering based on role
{user.role === 'admin' && <AdminPanel />}
{['admin', 'manager'].includes(user.role) && <ManagerPanel />}
{user.role !== 'staff' && <SensitiveData />}
```

---

## 5. Backend Implementation Strategy

### 5.1 Middleware for Authorization
```javascript
// authMiddleware.js
function checkPermission(resource, action) {
  return (req, res, next) => {
    const userRole = req.user.role;
    const hasPermission = checkRolePermission(userRole, resource, action);
    
    if (!hasPermission) {
      return res.status(403).json({ error: "Access denied" });
    }
    next();
  };
}

// Usage
app.put('/menu/:id', checkPermission('menu', 'edit'), updateMenu);
```

### 5.2 API Endpoints with Role Checks
```javascript
// GET /orders - Different data based on role
app.get('/orders', (req, res) => {
  if (req.user.role === 'admin') {
    // Return all orders
  } else if (req.user.role === 'manager') {
    // Return restaurant orders
  } else if (req.user.role === 'staff') {
    // Return only assigned orders
  }
});
```

### 5.3 Data Filtering by Role
```javascript
// Filter sensitive data based on role
function filterDataByRole(data, userRole) {
  if (userRole === 'staff') {
    delete data.cost;
    delete data.profit;
    delete data.staffSalaries;
  }
  return data;
}
```

---

## 6. Implementation Phases

### Phase 1: Backend Setup (Week 1)
- [ ] Update users table schema
- [ ] Create permissions/role_permissions tables
- [ ] Add role field to existing users
- [ ] Create permission checking middleware
- [ ] Update API endpoints with role checks
- [ ] Add role-based data filtering

### Phase 2: Frontend Setup (Week 2)
- [ ] Create usePermission hook
- [ ] Create ProtectedRoute component
- [ ] Create AccessDenied page
- [ ] Update authentication context
- [ ] Add permission checking to components

### Phase 3: UI Updates (Week 3)
- [ ] Update SuperAdminUsers page to add Manager/Staff
- [ ] Add role selector in user creation form
- [ ] Hide/show UI elements based on role
- [ ] Update sidebar based on role
- [ ] Add permission indicators

### Phase 4: Testing & Refinement (Week 4)
- [ ] Test each role's access
- [ ] Test permission boundaries
- [ ] Test data filtering
- [ ] Security testing
- [ ] Performance testing

---

## 7. User Creation Flow

### Current (Admin Only)
```
SuperAdmin → Create Admin → Assign to Restaurant
```

### New (Admin, Manager, Staff)
```
SuperAdmin → Create User → Select Role → Assign to Restaurant
  ├─ Admin (Full access)
  ├─ Manager (High access)
  └─ Staff (Limited access)
```

---

## 8. Login & Dashboard Flow

### Admin Dashboard
- Full access to all features
- All menu items visible
- All reports accessible
- User management available

### Manager Dashboard
- Restaurant-specific features
- Limited reporting
- Staff management
- Order management

### Staff Dashboard
- Order management only
- Menu availability toggle
- Basic inventory view
- Own profile management

---

## 9. Security Considerations

### Password Policy
- Minimum 8 characters
- Must contain uppercase, lowercase, number, special char
- Force password change on first login
- Password expiry every 90 days

### Session Management
- JWT tokens with 24-hour expiry
- Refresh tokens for extended sessions
- Logout clears all sessions
- One session per user (optional)

### Audit Logging
- Log all admin actions
- Log all data modifications
- Log failed login attempts
- Log permission denials

### Data Protection
- Encrypt sensitive data
- Hash passwords with bcrypt
- Use HTTPS only
- Implement CORS properly

---

## 10. Permission Keys Reference

### Menu Permissions
- `menu:view` - View menu items
- `menu:create` - Create menu items
- `menu:edit` - Edit menu items
- `menu:delete` - Delete menu items

### Order Permissions
- `orders:view` - View orders
- `orders:create` - Create orders
- `orders:edit` - Edit orders
- `orders:delete` - Delete orders

### Inventory Permissions
- `inventory:view` - View inventory
- `inventory:create` - Create items
- `inventory:edit` - Edit items
- `inventory:delete` - Delete items

### Staff Permissions
- `staff:view` - View staff
- `staff:create` - Create staff
- `staff:edit` - Edit staff
- `staff:delete` - Delete staff

### Reports Permissions
- `reports:view` - View reports
- `reports:export` - Export reports
- `reports:analytics` - View analytics

### Settings Permissions
- `settings:view` - View settings
- `settings:edit` - Edit settings
- `settings:admin` - Admin settings

---

## 11. Benefits of This RBAC System

✅ **Security** - Prevent unauthorized access
✅ **Scalability** - Easy to add new roles
✅ **Flexibility** - Granular permission control
✅ **Compliance** - Audit trail for all actions
✅ **User Experience** - Simplified UI for each role
✅ **Maintenance** - Centralized permission management
✅ **Performance** - Efficient permission checking

---

## 12. Next Steps

1. **Review this plan** - Confirm all requirements
2. **Approve role definitions** - Finalize permissions
3. **Start Phase 1** - Backend implementation
4. **Test thoroughly** - Security and functionality
5. **Deploy gradually** - Start with admin, then manager, then staff

---

## Summary

This RBAC system provides:
- **3 distinct roles** with clear permission boundaries
- **Granular permission control** for future flexibility
- **Secure authentication** with proper session management
- **Audit logging** for compliance
- **Scalable architecture** for future growth

Ready to implement? Let me know which phase to start with!
