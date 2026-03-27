# Phase 4: Advanced Features - Remaining 25%

**Status**: Pending (Optional)
**Estimated Time**: 6-10 hours (1 day)
**Priority**: MEDIUM - Nice to have, not critical

---

## Overview

Phase 4 adds performance optimizations and UI refinements. These are nice-to-have features that improve user experience but aren't critical for core functionality.

---

## Task 1: Permission Caching (1-2 hours)

### What
Cache permissions in localStorage to reduce repeated permission checks

### Why
- Improve performance
- Reduce backend calls
- Faster permission validation

### Implementation

**Update Auth Context** (`src/lib/session.ts`):
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

**Cache Functions**:
```typescript
function cachePermissions(user: User, permissions: string[]) {
  localStorage.setItem(`permissions_${user.id}`, JSON.stringify(permissions));
}

function getCachedPermissions(userId: number): string[] | null {
  const cached = localStorage.getItem(`permissions_${userId}`);
  return cached ? JSON.parse(cached) : null;
}

function logout() {
  const user = getUser();
  if (user) {
    localStorage.removeItem(`permissions_${user.id}`);
  }
}
```

---

## Task 2: Role-Based Form Fields (2-3 hours)

### What
Hide/show form fields based on user role

### Why
- Users only see fields they can edit
- Cleaner UI
- Better UX

### Implementation

**Create FormField Component** (`src/components/FormField.tsx`):
```typescript
interface FormFieldProps {
  name: string;
  label: string;
  type: string;
  requiredRoles?: string[];  // Add this
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

**Update Menu Form** (`src/pages/MenuManagement.tsx`):
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

**Update Other Forms**:
- Order form
- Inventory form
- Payroll form
- CRM form

---

## Task 3: Role-Based Buttons (2-3 hours)

### What
Hide/show buttons based on user role

### Why
- Users only see actions they can perform
- Prevent confusion
- Better UX

### Implementation

**Create PermissionButton Component** (`src/components/PermissionButton.tsx`):
```typescript
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

**Update Menu Management** (`src/pages/MenuManagement.tsx`):
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

**Update Other Pages**:
- Orders page
- Inventory page
- Payroll page
- CRM page

---

## Task 4: Role-Based Modals (1-2 hours)

### What
Hide/show modals based on user role

### Why
- Users only see modals they can use
- Prevent unauthorized actions
- Better UX

### Implementation

**Create PermissionModal Component** (`src/components/PermissionModal.tsx`):
```typescript
interface PermissionModalProps {
  requiredRoles?: string[];
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  [key: string]: any;
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

**Update Modals**:
- Menu add/edit modal
- Order details modal
- Inventory modal
- Payroll modal

---

## Task 5: Form Permission Validation (1-2 hours)

### What
Prevent form submission if user lacks permission

### Why
- Extra security layer
- Better error handling
- User feedback

### Implementation

**Create useFormPermission Hook** (`src/hooks/useFormPermission.ts`):
```typescript
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
```

**Use in Forms**:
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

## Implementation Timeline

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

## Testing Checklist

- [ ] Permissions cached in localStorage
- [ ] Cache invalidated on logout
- [ ] Cache updated on role change
- [ ] Form fields hidden by role
- [ ] Buttons hidden by role
- [ ] Modals hidden by role
- [ ] Form submission validated by role
- [ ] Performance improved with caching
- [ ] All components tested

---

## Success Criteria

✅ Permissions cached in localStorage
✅ Form fields hidden by role
✅ Buttons hidden by role
✅ Modals hidden by role
✅ Form submission validated by role
✅ Performance improved
✅ All components tested

---

## Priority

**Priority**: MEDIUM - Nice to have
**Criticality**: LOW - Not required for core functionality
**Impact**: HIGH - Improves UX and performance

---

## Recommendation

Phase 4 is optional and can be implemented after Phase 3 is tested and deployed. It provides performance improvements and UI refinements but isn't critical for security or core functionality.

**Recommendation**: 
1. Deploy Phase 3 first
2. Test thoroughly
3. Then implement Phase 4 if time permits

---

## Summary

**Phase 4 Status**: Pending (Optional)
**Estimated Time**: 6-10 hours (1 day)
**Priority**: MEDIUM - Nice to have

**What it does**:
- Caches permissions for performance
- Hides form fields by role
- Hides buttons by role
- Hides modals by role
- Validates form submission by role

**When to implement**: After Phase 3 is tested and deployed

