# RBAC Implementation - Next Steps

**Current Status**: 50% Complete
**What's Done**: Phases 1 & 2 (Backend setup + Frontend UI)
**What's Remaining**: Phases 3 & 4 (Backend checks + Advanced features)

---

## The Situation

You have a working RBAC system where:
- ✅ Users can be created with different roles (Admin, Manager, Staff)
- ✅ Users are assigned to specific restaurants
- ✅ Sidebar shows only role-appropriate menu items
- ✅ Dashboard shows only role-appropriate widgets
- ✅ Staff sees only Kitchen Display and Orders
- ✅ Manager cannot see financial data

**BUT** there's a security gap:
- ❌ Backend doesn't check permissions
- ❌ API endpoints are not protected
- ❌ Data is not filtered by restaurant_id
- ❌ No audit logging

**This means**: If a user knows the API endpoint, they can access data they shouldn't see.

---

## What You Need to Do

### Phase 3: Backend Permission Checks (CRITICAL)
**Time**: 8-12 hours (1-2 days)
**Priority**: HIGH - Do this first

This phase protects all API endpoints so users can't bypass the UI.

**What to implement**:
1. Add permission checks to all API endpoints
2. Filter data by restaurant_id
3. Add audit logging
4. Create audit log endpoints

**Files to update**:
- `server/mock-backend.mjs` - Main backend file

**Files already created**:
- ✅ `server/middleware/permissions.mjs` - Permission checking logic
- ✅ `server/middleware/audit.mjs` - Audit logging logic

**Detailed guide**: Read `RBAC_PHASE_3_IMPLEMENTATION_GUIDE.md`

---

### Phase 4: Advanced Features (OPTIONAL)
**Time**: 6-10 hours (1 day)
**Priority**: MEDIUM - Nice to have

This phase improves user experience with caching and role-based UI elements.

**What to implement**:
1. Cache permissions in localStorage
2. Hide form fields by role
3. Hide buttons by role
4. Hide modals by role

**Files to update**:
- `src/lib/session.ts` - Add permission caching
- `src/pages/MenuManagement.tsx` - Add role-based fields/buttons
- `src/pages/Orders.tsx` - Add role-based fields/buttons
- `src/pages/Inventory.tsx` - Add role-based fields/buttons
- `src/pages/Payroll.tsx` - Add role-based fields/buttons
- `src/pages/CRM.tsx` - Add role-based fields/buttons

**Detailed guide**: Read `RBAC_PHASE_4_IMPLEMENTATION_GUIDE.md`

---

## Step-by-Step Instructions

### Step 1: Understand the Current System (15 minutes)
1. Read `RBAC_FINAL_STATUS.md` - Overall status
2. Read `RBAC_REMAINING_WORK_SUMMARY.md` - What's remaining
3. Review the permission matrix in `RBAC_PERMISSION_MATRIX.md`

### Step 2: Review the Middleware (15 minutes)
1. Open `server/middleware/permissions.mjs` - Understand permission checking
2. Open `server/middleware/audit.mjs` - Understand audit logging
3. Review the code comments

### Step 3: Read Phase 3 Guide (30 minutes)
1. Open `RBAC_PHASE_3_IMPLEMENTATION_GUIDE.md`
2. Read the overview and tasks
3. Review the code examples
4. Understand the permission matrix

### Step 4: Start Phase 3 Implementation (8-12 hours)
1. **Task 1**: Integrate permission middleware into backend
   - Import middleware
   - Add permission checks to high-priority endpoints
   - Test with different roles
   
2. **Task 2**: Add data filtering by restaurant_id
   - Add restaurant_id to all data models
   - Filter data in GET endpoints
   - Validate restaurant_id in POST/PUT/PATCH endpoints
   
3. **Task 3**: Add audit logging
   - Log all successful actions
   - Log permission denials
   - Create audit log endpoints
   
4. **Task 4**: Test everything
   - Test each role with different endpoints
   - Verify permission denials
   - Verify data filtering
   - Verify audit logs

### Step 5: (Optional) Implement Phase 4 (6-10 hours)
1. Read `RBAC_PHASE_4_IMPLEMENTATION_GUIDE.md`
2. Implement permission caching
3. Add role-based form fields
4. Add role-based buttons
5. Add role-based modals
6. Test everything

---

## Quick Reference

### Permission Matrix
```
SUPERADMIN: Full access to everything
ADMIN: Can manage their restaurant's data
MANAGER: Can view and manage operations (no financial data)
STAFF: Can only view orders and kitchen display
```

### Endpoints to Protect (Priority Order)

**High Priority** (Do first):
- GET /menu
- POST /menu
- PUT /menu/:id
- DELETE /menu/:id
- GET /orders
- POST /orders
- GET /inventory
- POST /inventory
- PATCH /inventory/:id

**Medium Priority**:
- GET /reservations
- POST /reservations
- GET /tables
- POST /tables
- GET /crm/customers
- POST /crm/customers
- GET /payroll/staff
- POST /payroll/staff

**Low Priority** (Admin only):
- GET /superadmin/users
- POST /superadmin/users
- PATCH /superadmin/users/:id
- DELETE /superadmin/users/:id

### Test Users
```
SuperAdmin:
  Email: superadmin@restrohub.local
  Password: super123
  Role: superadmin

Admin:
  Email: admin@example.com
  Password: admin123
  Role: admin
  Restaurant: Demo Restaurant

Manager:
  Email: manager@example.com
  Password: manager123
  Role: manager
  Restaurant: Demo Restaurant

Staff:
  Email: staff@example.com
  Password: staff123
  Role: staff
  Restaurant: Demo Restaurant
```

---

## Implementation Checklist

### Phase 3 Checklist

#### Task 1: Permission Middleware Integration
- [ ] Import permission middleware in backend
- [ ] Import audit middleware in backend
- [ ] Add permission check to GET /menu
- [ ] Add permission check to POST /menu
- [ ] Add permission check to PUT /menu/:id
- [ ] Add permission check to DELETE /menu/:id
- [ ] Test with staff user (should be denied)
- [ ] Test with admin user (should be allowed)

#### Task 2: Data Filtering
- [ ] Add restaurant_id to menu items
- [ ] Add restaurant_id to orders
- [ ] Add restaurant_id to inventory
- [ ] Add restaurant_id to reservations
- [ ] Add restaurant_id to tables
- [ ] Filter GET /menu by restaurant_id
- [ ] Filter GET /orders by restaurant_id
- [ ] Filter GET /inventory by restaurant_id
- [ ] Test data isolation between restaurants

#### Task 3: Audit Logging
- [ ] Add audit logging to POST /menu
- [ ] Add audit logging to PUT /menu/:id
- [ ] Add audit logging to DELETE /menu/:id
- [ ] Create GET /superadmin/audit-logs endpoint
- [ ] Create GET /superadmin/audit-logs/stats endpoint
- [ ] Test audit log retrieval
- [ ] Test audit log filtering

#### Task 4: Testing
- [ ] Test staff cannot POST /menu
- [ ] Test staff cannot DELETE /orders
- [ ] Test manager cannot GET /reports
- [ ] Test manager cannot GET /payments
- [ ] Test admin can access all endpoints
- [ ] Test data filtering works
- [ ] Test audit logs are created

### Phase 4 Checklist (Optional)

#### Task 1: Permission Caching
- [ ] Update auth context with permissions
- [ ] Add caching functions
- [ ] Test cache invalidation
- [ ] Verify performance improvement

#### Task 2: Form Fields
- [ ] Create FormField component
- [ ] Update Menu form
- [ ] Update Order form
- [ ] Update Inventory form
- [ ] Test field visibility

#### Task 3: Buttons
- [ ] Create PermissionButton component
- [ ] Update Menu page
- [ ] Update Order page
- [ ] Update Inventory page
- [ ] Test button visibility

#### Task 4: Modals
- [ ] Create PermissionModal component
- [ ] Update all modals
- [ ] Test modal visibility

#### Task 5: Form Validation
- [ ] Create useFormPermission hook
- [ ] Update all forms
- [ ] Test form submission validation

---

## Common Issues & Solutions

### Issue 1: "Permission Denied" for all users
**Solution**: Check that the token is being parsed correctly. The token format should be `token_role_timestamp`.

### Issue 2: Data not filtered by restaurant_id
**Solution**: Make sure you're extracting the user from the request and filtering by `user.restaurant_id`.

### Issue 3: Audit logs not being created
**Solution**: Make sure you're calling `auditMiddleware.logAction()` after successful operations.

### Issue 4: Performance is slow
**Solution**: Implement permission caching in Phase 4 to reduce repeated permission checks.

---

## Files to Read

### Essential
1. `RBAC_FINAL_STATUS.md` - Current status
2. `RBAC_REMAINING_WORK_SUMMARY.md` - What's remaining
3. `RBAC_PHASE_3_IMPLEMENTATION_GUIDE.md` - Phase 3 details
4. `RBAC_PHASE_4_IMPLEMENTATION_GUIDE.md` - Phase 4 details

### Reference
1. `RBAC_PERMISSION_MATRIX.md` - Permission details
2. `RBAC_MULTI_TENANT_ISOLATION.md` - Multi-tenant details
3. `RBAC_ROLE_HIERARCHY.md` - Role hierarchy

### Code
1. `server/middleware/permissions.mjs` - Permission checking
2. `server/middleware/audit.mjs` - Audit logging
3. `server/mock-backend.mjs` - Backend to update

---

## Timeline

```
Phase 3: Backend Permission Checks
├─ Task 1: Permission Middleware Integration    2-3 hours
├─ Task 2: Data Filtering                       2-3 hours
├─ Task 3: Audit Logging                        2-3 hours
└─ Task 4: Testing                              2-3 hours
Total: 8-12 hours (1-2 days)

Phase 4: Advanced Features (Optional)
├─ Task 1: Permission Caching                   1-2 hours
├─ Task 2: Form Fields                          2-3 hours
├─ Task 3: Buttons                              2-3 hours
├─ Task 4: Modals                               1-2 hours
└─ Task 5: Form Validation                      1-2 hours
Total: 6-10 hours (1 day)

Grand Total: 14-22 hours (2-3 days)
```

---

## Success Criteria

### Phase 3 Success
- ✅ All API endpoints protected with permission checks
- ✅ Users cannot access endpoints they don't have permission for
- ✅ Data filtered by restaurant_id
- ✅ Users cannot see other restaurants' data
- ✅ All actions logged in audit trail
- ✅ Permission denials logged

### Phase 4 Success (Optional)
- ✅ Permissions cached in localStorage
- ✅ Form fields hidden by role
- ✅ Buttons hidden by role
- ✅ Modals hidden by role
- ✅ Performance improved

---

## Ready to Start?

1. ✅ Read this document
2. ✅ Read `RBAC_PHASE_3_IMPLEMENTATION_GUIDE.md`
3. ⏳ Start Phase 3 implementation
4. ⏳ Test thoroughly
5. ⏳ (Optional) Implement Phase 4

---

## Questions?

Refer to the detailed guides:
- `RBAC_PHASE_3_IMPLEMENTATION_GUIDE.md` - Phase 3 details
- `RBAC_PHASE_4_IMPLEMENTATION_GUIDE.md` - Phase 4 details
- `RBAC_PERMISSION_MATRIX.md` - Permission details

---

## Summary

**Current Status**: 50% Complete
- Phase 1 & 2: ✅ COMPLETE
- Phase 3: ⏳ PENDING (40% of work)
- Phase 4: ⏳ PENDING (10% of work)

**Remaining Work**: 14-22 hours (2-3 days)

**Next Priority**: Implement Phase 3 - Backend Permission Checks

**Security Note**: Backend permission checks are critical to prevent unauthorized data access.

**Recommendation**: Start with Phase 3 today. It's critical for security.

