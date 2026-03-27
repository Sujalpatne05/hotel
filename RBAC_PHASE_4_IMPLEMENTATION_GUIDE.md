# RBAC Phase 4 Implementation Guide
## Advanced Features & UI Refinement

**Status**: Pending (After Phase 3)
**Estimated Time**: 6-10 hours (1 day)
**Priority**: MEDIUM - Nice to have, not critical

---

## Overview

Phase 4 implements advanced features to improve user experience and performance. These are refinements that make the system more polished but aren't critical for core functionality.

---

## Implementation Tasks

### Task 1: Permission Caching (1-2 hours)

**Why**: Reduce repeated permission checks, improve performance

**What to do**:

1. **Update Auth Context** (`src/lib/session.ts`):
```typescript
interface AuthContext {
  user: User;
  permissions: string[];  // Add this
  canAccess: (resource: string, method: string) => boolean;  // Add this
}

export function useAuth() {
  const { user, permissions } = useContext(AuthContext);
  
  const canAccess = (resource: string, method: string) => {
    const key = `${resource}:${method}`;
    return permissions.includes(key);
  };
  
  return { user, permissions, canAccess };
}
```

2. **Cache permissions in localStorage**:
```typescript
function cachePermissions(user: User, permissions: string[]) {
  localStorage.setItem(`permissions_${user.id}`, JSON.stringify(permissions));
}

function getCachedPermissions(userId: number): string[] | null {
  const cached = localStorage.getItem(`permissions_${userId}`);
  return cached ? JSON.parse(cached) : null;
}
```

3. **Invalidate cache on logout**:
```typescript
function logout() {
  const user = getUser();
  if (user) {
    localStorage.removeItem(`permissions_${user.id}`);
  }
  // ... rest of logout logic
}
```

---

### Task 2: Role-Based Form Fields (2-3 hours)

**Why**: Users only see fields they can edit

**What to do**:

1. **Create FormField component**:
```typescript
interface FormFieldProps {
  name: string;
  label: string;
  type: string;
  requiredRoles?: string[];  // Add this
  // ... other props
}

export function FormField({ name, label, type, requiredRoles, ...props }: FormFieldProps) {
  const { user } = useAuth();
  
  // Hide field if user doesn't have required role
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return null;
  }
  
  return (
    <input
      name={name}
      type={type}
      placeholder={label}
      {...props}
    />
  );
}
```

2. **Update Menu Form** (`src/pages/MenuManagement.tsx`):
```typescript
<FormField
  name="price"
  label="Price"
  type="number"
  requiredRoles={['admin']}  // Only admin can edit price
/>

<FormField
  name="available"
  label="Available"
  type="checkbox"
  requiredRoles={['admin', 'manager']}  // Admin and manager can edit
/>
```

3. **Update Order Form** (`src/pages/Orders.tsx`):
```typescript
<FormField
  name="paymentMethod"
  label="Payment Method"
  type="select"
  requiredRoles={['admin']}  // Only admin can set payment method
/>
```

4. **Update Inventory Form** (`src/pages/Inventory.tsx`):
```typescript
<FormField
  name="minStock"
  label="Min Stock"
  type="number"
  requiredRoles={['admin']}  // Only admin can set min stock
/>
```

---

### Task 3: Role-Based Buttons (2-3 hours)

**Why**: Users only see actions they can perform

**What to do**:

1. **Create PermissionButton component**:
```typescript
interface PermissionButtonProps {
  requiredRoles?: string[];
  onClick: () => void;
  children: React.ReactNode;
  // ... other button props
}

export function PermissionButton({ requiredRoles, onClick, children, ...props }: PermissionButtonProps) {
  const { user } = useAuth();
  
  // Hide button if user doesn't have required role
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return null;
  }
  
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
}
```

2. **Update Menu Management** (`src/pages/MenuManagement.tsx`):
```typescript
<PermissionButton
  requiredRoles={['admin']}
  onClick={handleDeleteItem}
>
  Delete
</PermissionButton>

<PermissionButton
  requiredRoles={['admin', 'manager']}
  onClick={handleEditItem}
>
  Edit
</PermissionButton>
```

3. **Update Orders Page** (`src/pages/Orders.tsx`):
```typescript
<PermissionButton
  requiredRoles={['admin']}
  onClick={handleCancelOrder}
>
  Cancel Order
</PermissionButton>

<PermissionButton
  requiredRoles={['admin', 'manager']}
  onClick={handleUpdateStatus}
>
  Update Status
</PermissionButton>
```

4. **Update Inventory Page** (`src/pages/Inventory.tsx`):
```typescript
<PermissionButton
  requiredRoles={['admin']}
  onClick={handleDeleteItem}
>
  Delete
</PermissionButton>
```

---

### Task 4: Role-Based Modals (1-2 hours)

**Why**: Users only see modals they can use

**What to do**:

1. **Create PermissionModal component**:
```typescript
interface PermissionModalProps {
  requiredRoles?: string[];
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  // ... other modal props
}

export function PermissionModal({ requiredRoles, isOpen, onClose, children, ...props }: PermissionModalProps) {
  const { user } = useAuth();
  
  // Don't show modal if user doesn't have required role
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return null;
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose} {...props}>
      {children}
    </Dialog>
  );
}
```

2. **Update Menu Management Modal**:
```typescript
<PermissionModal
  requiredRoles={['admin']}
  isOpen={isAddMenuOpen}
  onClose={() => setIsAddMenuOpen(false)}
>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Add Menu Item</DialogTitle>
    </DialogHeader>
    {/* Form content */}
  </DialogContent>
</PermissionModal>
```

3. **Update Order Modal**:
```typescript
<PermissionModal
  requiredRoles={['admin', 'manager']}
  isOpen={isOrderDetailsOpen}
  onClose={() => setIsOrderDetailsOpen(false)}
>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Order Details</DialogTitle>
    </DialogHeader>
    {/* Order details */}
  </DialogContent>
</PermissionModal>
```

---

### Task 5: Permission Validation in Forms (1-2 hours)

**Why**: Prevent form submission if user lacks permission

**What to do**:

1. **Create useFormPermission hook**:
```typescript
export function useFormPermission(resource: string, action: string) {
  const { user } = useAuth();
  
  const canSubmit = () => {
    // Check if user has permission for this action
    const permissions = rolePermissions[user.role];
    if (!permissions) return false;
    
    const resourcePerms = permissions[resource];
    if (!resourcePerms) return false;
    
    return resourcePerms.includes(action);
  };
  
  return { canSubmit };
}
```

2. **Use in forms**:
```typescript
export function MenuForm() {
  const { canSubmit } = useFormPermission('menu', 'POST');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit()) {
      alert('You do not have permission to add menu items');
      return;
    }
    
    // Submit form
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={!canSubmit()}>
        Add Item
      </button>
    </form>
  );
}
```

---

## Implementation Steps

### Step 1: Permission Caching (1-2 hours)
1. Update auth context with permissions
2. Add caching functions
3. Test cache invalidation
4. Verify performance improvement

### Step 2: Form Fields (2-3 hours)
1. Create FormField component
2. Update all forms
3. Test field visibility
4. Verify form submission

### Step 3: Buttons (2-3 hours)
1. Create PermissionButton component
2. Update all pages
3. Test button visibility
4. Verify click handlers

### Step 4: Modals (1-2 hours)
1. Create PermissionModal component
2. Update all modals
3. Test modal visibility
4. Verify modal functionality

### Step 5: Form Validation (1-2 hours)
1. Create useFormPermission hook
2. Update all forms
3. Test form submission
4. Verify error messages

---

## Testing Checklist

### Permission Caching Tests
- [ ] Permissions cached in localStorage
- [ ] Cache invalidated on logout
- [ ] Cache updated on role change
- [ ] Performance improved

### Form Field Tests
- [ ] Admin sees all fields
- [ ] Manager sees limited fields
- [ ] Staff sees minimal fields
- [ ] Fields are read-only when appropriate

### Button Tests
- [ ] Admin sees all buttons
- [ ] Manager sees limited buttons
- [ ] Staff sees minimal buttons
- [ ] Buttons are disabled when appropriate

### Modal Tests
- [ ] Admin sees all modals
- [ ] Manager sees limited modals
- [ ] Staff sees minimal modals
- [ ] Modals cannot be opened by unauthorized users

### Form Validation Tests
- [ ] Form submission blocked if no permission
- [ ] Error message shown
- [ ] Form submission allowed if permission granted
- [ ] Validation works for all forms

---

## Code Examples

### Example 1: Permission Caching
```typescript
// src/lib/session.ts
export interface AuthContext {
  user: User;
  permissions: string[];
  canAccess: (resource: string, method: string) => boolean;
}

export function useAuth() {
  const { user, permissions } = useContext(AuthContext);
  
  const canAccess = (resource: string, method: string) => {
    const key = `${resource}:${method}`;
    return permissions.includes(key);
  };
  
  return { user, permissions, canAccess };
}

// Cache permissions
function cachePermissions(user: User, permissions: string[]) {
  localStorage.setItem(`permissions_${user.id}`, JSON.stringify(permissions));
}

// Get cached permissions
function getCachedPermissions(userId: number): string[] | null {
  const cached = localStorage.getItem(`permissions_${userId}`);
  return cached ? JSON.parse(cached) : null;
}

// Invalidate cache on logout
function logout() {
  const user = getUser();
  if (user) {
    localStorage.removeItem(`permissions_${user.id}`);
  }
}
```

### Example 2: Role-Based Form Fields
```typescript
// src/components/FormField.tsx
interface FormFieldProps {
  name: string;
  label: string;
  type: string;
  requiredRoles?: string[];
  [key: string]: any;
}

export function FormField({ name, label, type, requiredRoles, ...props }: FormFieldProps) {
  const { user } = useAuth();
  
  // Hide field if user doesn't have required role
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return null;
  }
  
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={label}
        {...props}
      />
    </div>
  );
}
```

### Example 3: Role-Based Buttons
```typescript
// src/components/PermissionButton.tsx
interface PermissionButtonProps {
  requiredRoles?: string[];
  onClick: () => void;
  children: React.ReactNode;
  [key: string]: any;
}

export function PermissionButton({ requiredRoles, onClick, children, ...props }: PermissionButtonProps) {
  const { user } = useAuth();
  
  // Hide button if user doesn't have required role
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return null;
  }
  
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
}
```

### Example 4: Form Permission Validation
```typescript
// src/hooks/useFormPermission.ts
export function useFormPermission(resource: string, action: string) {
  const { user } = useAuth();
  
  const canSubmit = () => {
    const permissions = rolePermissions[user.role];
    if (!permissions) return false;
    
    const resourcePerms = permissions[resource];
    if (!resourcePerms) return false;
    
    return resourcePerms.includes(action);
  };
  
  return { canSubmit };
}

// Usage in component
export function MenuForm() {
  const { canSubmit } = useFormPermission('menu', 'POST');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canSubmit()) {
      alert('You do not have permission to add menu items');
      return;
    }
    
    // Submit form
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Item name" />
      <button type="submit" disabled={!canSubmit()}>
        Add Item
      </button>
    </form>
  );
}
```

---

## Files to Create

- `src/components/FormField.tsx` - Role-based form field
- `src/components/PermissionButton.tsx` - Role-based button
- `src/components/PermissionModal.tsx` - Role-based modal
- `src/hooks/useFormPermission.ts` - Form permission validation

---

## Files to Update

- `src/lib/session.ts` - Add permission caching
- `src/pages/MenuManagement.tsx` - Add role-based fields/buttons
- `src/pages/Orders.tsx` - Add role-based fields/buttons
- `src/pages/Inventory.tsx` - Add role-based fields/buttons
- `src/pages/Payroll.tsx` - Add role-based fields/buttons
- `src/pages/CRM.tsx` - Add role-based fields/buttons

---

## Estimated Timeline

```
Task 1: Permission Caching      1-2 hours
Task 2: Form Fields             2-3 hours
Task 3: Buttons                 2-3 hours
Task 4: Modals                  1-2 hours
Task 5: Form Validation         1-2 hours
─────────────────────────────────────
Total:                          7-12 hours (1-2 days)
```

---

## Success Criteria

✅ Permissions cached in localStorage
✅ Form fields hidden by role
✅ Buttons hidden by role
✅ Modals hidden by role
✅ Form submission validated by role
✅ Performance improved with caching
✅ All components tested

---

## Next Steps

1. **Complete Phase 3** - Backend permission checks
2. **Review this guide** - Understand Phase 4 requirements
3. **Start with Task 1** - Permission caching
4. **Move to Task 2-5** - UI refinements
5. **Final testing** - Comprehensive testing

---

## Questions?

Refer to:
- `RBAC_FINAL_STATUS.md` - Overall status
- `RBAC_PHASE_3_IMPLEMENTATION_GUIDE.md` - Phase 3 details
- `RBAC_PERMISSION_MATRIX.md` - Permission details

