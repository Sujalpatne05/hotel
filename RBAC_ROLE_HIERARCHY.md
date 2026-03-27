# RBAC Role Hierarchy & Access Levels

## Role Hierarchy Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    SUPER ADMIN                              │
│              (System Administrator)                         │
│  • Manages all restaurants                                  │
│  • Manages all admin users                                  │
│  • System-wide settings                                     │
│  • Billing & subscriptions                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Creates & Manages
                         │
        ┌────────────────┴────────────────┐
        │                                 │
        ▼                                 ▼
┌──────────────────────────┐    ┌──────────────────────────┐
│      ADMIN (100%)        │    │   ADMIN (100%)           │
│   (Restaurant Owner)     │    │   (Restaurant Owner)     │
│                          │    │                          │
│ • Full system access     │    │ • Full system access     │
│ • Manage all staff       │    │ • Manage all staff       │
│ • Create/Edit/Delete     │    │ • Create/Edit/Delete     │
│ • View all reports       │    │ • View all reports       │
│ • System settings        │    │ • System settings        │
└────────────┬─────────────┘    └────────────┬─────────────┘
             │                              │
             │ Creates & Manages           │ Creates & Manages
             │                              │
    ┌────────┴────────┐          ┌──────────┴──────────┐
    │                 │          │                     │
    ▼                 ▼          ▼                     ▼
┌─────────────┐  ┌─────────────┐ ┌─────────────┐  ┌─────────────┐
│  MANAGER    │  │  MANAGER    │ │  MANAGER    │  │  MANAGER    │
│   (70%)     │  │   (70%)     │ │   (70%)     │  │   (70%)     │
│             │  │             │ │             │  │             │
│ • Manage    │  │ • Manage    │ │ • Manage    │  │ • Manage    │
│   staff     │  │   staff     │ │   staff     │  │   staff     │
│ • Edit menu │  │ • Edit menu │ │ • Edit menu │  │ • Edit menu │
│ • Process   │  │ • Process   │ │ • Process   │  │ • Process   │
│   orders    │  │   orders    │ │   orders    │  │   orders    │
│ • View      │  │ • View      │ │ • View      │  │ • View      │
│   reports   │  │   reports   │ │   reports   │  │   reports   │
└────────────┬┘  └────────────┬┘ └────────────┬┘  └────────────┬┘
             │                │              │                │
             │ Supervises     │ Supervises   │ Supervises     │ Supervises
             │                │              │                │
    ┌────────┴────────┐  ┌────┴────┐  ┌────┴────┐  ┌────────┴────────┐
    │                 │  │         │  │         │  │                 │
    ▼                 ▼  ▼         ▼  ▼         ▼  ▼                 ▼
┌─────────┐      ┌─────────┐  ┌─────────┐  ┌─────────┐      ┌─────────┐
│ STAFF   │      │ STAFF   │  │ STAFF   │  │ STAFF   │      │ STAFF   │
│ (30%)   │      │ (30%)   │  │ (30%)   │  │ (30%)   │      │ (30%)   │
│         │      │         │  │         │  │         │      │         │
│ • View  │      │ • View  │  │ • View  │  │ • View  │      │ • View  │
│  orders │      │  orders │  │  orders │  │  orders │      │  orders │
│ • Update│      │ • Update│  │ • Update│  │ • Update│      │ • Update│
│  status │      │  status │  │  status │  │  status │      │  status │
│ • Toggle│      │ • Toggle│  │ • Toggle│  │ • Toggle│      │ • Toggle│
│  menu   │      │  menu   │  │  menu   │  │  menu   │      │  menu   │
└─────────┘      └─────────┘  └─────────┘  └─────────┘      └─────────┘
```

---

## Access Level Breakdown

### Level 1: SUPER ADMIN (System-Wide)
```
┌─────────────────────────────────────┐
│         SUPER ADMIN (100%)          │
├─────────────────────────────────────┤
│ Scope: All Restaurants              │
│ Authority: System-wide              │
│ Manages: Admin users                │
│ Access: Everything                  │
│                                     │
│ Responsibilities:                   │
│ • Manage restaurants                │
│ • Create admin accounts             │
│ • Billing & subscriptions           │
│ • System settings                   │
│ • Support & maintenance             │
└─────────────────────────────────────┘
```

### Level 2: ADMIN (Restaurant-Wide)
```
┌─────────────────────────────────────┐
│      ADMIN (100%)                   │
│   (Restaurant Owner)                │
├─────────────────────────────────────┤
│ Scope: Single Restaurant            │
│ Authority: Full restaurant control  │
│ Manages: Manager & Staff users      │
│ Access: All features                │
│                                     │
│ Responsibilities:                   │
│ • Manage all staff                  │
│ • Create/Edit/Delete menu           │
│ • View all reports                  │
│ • System settings                   │
│ • Manage inventory                  │
│ • Process refunds                   │
│ • Manage payroll                    │
└─────────────────────────────────────┘
```

### Level 3: MANAGER (Department-Level)
```
┌─────────────────────────────────────┐
│      MANAGER (70%)                  │
│   (Restaurant Manager)              │
├─────────────────────────────────────┤
│ Scope: Restaurant operations        │
│ Authority: Operational control      │
│ Manages: Staff users                │
│ Access: Most features               │
│                                     │
│ Responsibilities:                   │
│ • Manage staff                      │
│ • Edit menu items                   │
│ • Process orders                    │
│ • Manage inventory                  │
│ • View reports                      │
│ • Process refunds (limited)         │
│ • Track attendance                  │
│                                     │
│ Restrictions:                       │
│ • Cannot delete items               │
│ • Cannot change settings            │
│ • Cannot manage other managers      │
└─────────────────────────────────────┘
```

### Level 4: STAFF (Task-Level)
```
┌─────────────────────────────────────┐
│      STAFF (30%)                    │
│   (Waiter/Chef/Cashier)             │
├─────────────────────────────────────┤
│ Scope: Assigned tasks               │
│ Authority: Limited operational      │
│ Manages: Own tasks                  │
│ Access: Basic features              │
│                                     │
│ Responsibilities:                   │
│ • View assigned orders              │
│ • Update order status               │
│ • Toggle menu availability          │
│ • View inventory levels             │
│ • Change own password               │
│                                     │
│ Restrictions:                       │
│ • Cannot modify prices              │
│ • Cannot manage staff               │
│ • Cannot view reports               │
│ • Cannot delete anything            │
│ • Cannot access settings            │
└─────────────────────────────────────┘
```

---

## Permission Levels by Feature

### Menu Management
```
ADMIN (100%)
├─ Create ✅
├─ Read ✅
├─ Update ✅
├─ Delete ✅
└─ Manage Categories ✅

MANAGER (70%)
├─ Create ❌
├─ Read ✅
├─ Update ✅
├─ Delete ❌
└─ Manage Categories ❌

STAFF (30%)
├─ Create ❌
├─ Read ✅
├─ Update (Availability) ✅
├─ Delete ❌
└─ Manage Categories ❌
```

### Order Management
```
ADMIN (100%)
├─ View All ✅
├─ Create ✅
├─ Update ✅
├─ Delete ✅
└─ Process Refunds ✅

MANAGER (70%)
├─ View All ✅
├─ Create ✅
├─ Update ✅
├─ Delete ❌
└─ Process Refunds ✅

STAFF (30%)
├─ View Assigned ✅
├─ Create ✅
├─ Update (Status) ✅
├─ Delete ❌
└─ Process Refunds ❌
```

### Inventory Management
```
ADMIN (100%)
├─ View ✅
├─ Create ✅
├─ Update ✅
├─ Delete ✅
└─ Manage Stock ✅

MANAGER (70%)
├─ View ✅
├─ Create ❌
├─ Update ✅
├─ Delete ❌
└─ Manage Stock ✅

STAFF (30%)
├─ View ✅
├─ Create ❌
├─ Update ❌
├─ Delete ❌
└─ Manage Stock ❌
```

### Staff Management
```
ADMIN (100%)
├─ View All ✅
├─ Create ✅
├─ Update ✅
├─ Delete ✅
└─ Manage Roles ✅

MANAGER (70%)
├─ View All ✅
├─ Create ✅
├─ Update ✅
├─ Delete ❌
└─ Manage Roles ❌

STAFF (30%)
├─ View All ❌
├─ Create ❌
├─ Update (Own) ✅
├─ Delete ❌
└─ Manage Roles ❌
```

### Reports & Analytics
```
ADMIN (100%)
├─ View All ✅
├─ Export ✅
├─ Analytics ✅
└─ Custom Reports ✅

MANAGER (70%)
├─ View Restaurant ✅
├─ Export ✅
├─ Analytics ✅
└─ Custom Reports ❌

STAFF (30%)
├─ View All ❌
├─ Export ❌
├─ Analytics ❌
└─ Custom Reports ❌
```

### System Settings
```
ADMIN (100%)
├─ View ✅
├─ Edit ✅
├─ Manage Users ✅
└─ Security ✅

MANAGER (70%)
├─ View ❌
├─ Edit ❌
├─ Manage Users ❌
└─ Security ❌

STAFF (30%)
├─ View ❌
├─ Edit ❌
├─ Manage Users ❌
└─ Security ❌
```

---

## Data Access Scope

### ADMIN
```
Can Access:
├─ All restaurant data
├─ All staff information
├─ All financial data
├─ All reports
├─ All settings
└─ All audit logs
```

### MANAGER
```
Can Access:
├─ Restaurant data (own restaurant)
├─ Staff information (own restaurant)
├─ Financial data (own restaurant)
├─ Reports (own restaurant)
├─ Limited settings
└─ Audit logs (own restaurant)
```

### STAFF
```
Can Access:
├─ Assigned orders only
├─ Own profile
├─ Basic inventory
├─ No financial data
├─ No other staff info
└─ No audit logs
```

---

## Role Transition Flow

```
User Registration
    ↓
Select Role
    ├─ Admin (Full Access)
    ├─ Manager (High Access)
    └─ Staff (Limited Access)
    ↓
Assign to Restaurant
    ↓
Set Temporary Password
    ↓
User Logs In
    ↓
Must Change Password
    ↓
Access Dashboard (Role-Based)
    ├─ Admin Dashboard (All Features)
    ├─ Manager Dashboard (Operations)
    └─ Staff Dashboard (Tasks)
```

---

## Permission Inheritance

```
SUPER ADMIN
    ↓
    └─→ ADMIN (Inherits all permissions)
            ↓
            ├─→ MANAGER (Inherits subset)
            │       ↓
            │       └─→ STAFF (Inherits limited subset)
            │
            └─→ MANAGER (Inherits subset)
                    ↓
                    └─→ STAFF (Inherits limited subset)
```

---

## Access Control Decision Tree

```
User Requests Access to Feature
    ↓
Check User Role
    ├─ SUPER ADMIN?
    │   └─ YES → Grant Access ✅
    │
    ├─ ADMIN?
    │   ├─ Feature in Admin Permissions?
    │   │   ├─ YES → Grant Access ✅
    │   │   └─ NO → Deny Access ❌
    │   └─ NO → Continue
    │
    ├─ MANAGER?
    │   ├─ Feature in Manager Permissions?
    │   │   ├─ YES → Grant Access ✅
    │   │   └─ NO → Deny Access ❌
    │   └─ NO → Continue
    │
    └─ STAFF?
        ├─ Feature in Staff Permissions?
        │   ├─ YES → Grant Access ✅
        │   └─ NO → Deny Access ❌
        └─ NO → Deny Access ❌
```

---

## Role Badge Colors

```
┌─────────────────────────────────────┐
│ ADMIN                               │
│ ████████████████████████████████    │ Amber/Yellow
│ #FBBF24 / bg-amber-100              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ MANAGER                             │
│ ████████████████████████████████    │ Blue
│ #3B82F6 / bg-blue-100               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ STAFF                               │
│ ████████████████████████████████    │ Green
│ #10B981 / bg-green-100              │
└─────────────────────────────────────┘
```

---

## Typical User Scenarios

### Scenario 1: Restaurant Owner
```
Role: ADMIN
Access: Everything
Typical Tasks:
├─ Create menu items
├─ Manage staff
├─ View all reports
├─ Change system settings
└─ Process refunds
```

### Scenario 2: Restaurant Manager
```
Role: MANAGER
Access: Operations
Typical Tasks:
├─ Edit menu items
├─ Manage staff attendance
├─ Process orders
├─ View daily reports
└─ Manage inventory
```

### Scenario 3: Kitchen Staff
```
Role: STAFF
Access: Assigned Tasks
Typical Tasks:
├─ View assigned orders
├─ Update order status
├─ Toggle menu availability
└─ View inventory levels
```

### Scenario 4: Waiter/Cashier
```
Role: STAFF
Access: Assigned Tasks
Typical Tasks:
├─ View assigned orders
├─ Update order status
├─ Process payments
└─ View menu items
```

---

## Summary

| Aspect | Admin | Manager | Staff |
|--------|:-----:|:-------:|:-----:|
| **Access Level** | 100% | 70% | 30% |
| **Scope** | All | Restaurant | Assigned |
| **Can Create** | ✅ | Limited | ❌ |
| **Can Edit** | ✅ | Limited | Limited |
| **Can Delete** | ✅ | ❌ | ❌ |
| **View Reports** | ✅ | ✅ | ❌ |
| **Manage Staff** | ✅ | ✅ | ❌ |
| **System Settings** | ✅ | ❌ | ❌ |
| **Data Visibility** | All | Restaurant | Assigned |

---

## Next Steps

1. ✅ Phase 1: Backend setup with roles
2. ⏳ Phase 2: Frontend permission system
3. ⏳ Phase 3: UI updates based on role
4. ⏳ Phase 4: Backend permission checks

Ready to implement Phase 2!
