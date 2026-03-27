# 📊 Current Data Status - In Memory & Backend

**Last Updated**: March 27, 2026

---

## RESTAURANTS

### Total: **3 Restaurants**

#### 1. Demo Restaurant (ID: 1)
- Owner: Platform Team
- City: Delhi
- Status: Active
- Plan: Standard

#### 2. Mitu Cafe (ID: 2)
- Owner: Mitu Owner
- City: Delhi
- Status: Active
- Plan: Standard

#### 3. ABC Hotel (ID: 3)
- Owner: ABC Owner
- City: Delhi
- Status: Active
- Plan: Standard

**Storage**: 
- ✅ In Memory (loaded on server startup)
- ✅ In File: `server/data/restaurants.json`

---

## USERS

### Total: **7 Users**

#### Super Admin (1 user)
1. **Super Admin**
   - Email: `superadmin@restrohub.local`
   - Password: `super123`
   - Role: superadmin
   - Restaurant: None (manages all)

#### Demo Restaurant (4 users)
2. **Admin User**
   - Email: `admin@example.com`
   - Password: `admin123`
   - Role: admin
   - Restaurant: Demo Restaurant (ID: 1)

3. **Manager User**
   - Email: `manager@example.com`
   - Password: `manager123`
   - Role: manager
   - Restaurant: Demo Restaurant (ID: 1)

4. **Staff User**
   - Email: `staff@example.com`
   - Password: `staff123`
   - Role: staff
   - Restaurant: Demo Restaurant (ID: 1)

5. **SS Manager** (Test User)
   - Email: `ss`
   - Password: `ss`
   - Role: manager
   - Restaurant: Demo Restaurant (ID: 1)

#### Mitu Cafe (1 user)
6. **Mitu Admin**
   - Email: `mitu@example.com`
   - Password: `mitu123`
   - Role: admin
   - Restaurant: Mitu Cafe (ID: 2)

#### ABC Hotel (1 user)
7. **ABC Admin**
   - Email: `abc@example.com`
   - Password: `abc123`
   - Role: admin
   - Restaurant: ABC Hotel (ID: 3)

**Storage**:
- ✅ In Memory (loaded on server startup)
- ✅ In File: `server/data/users.json`

---

## DATA PERSISTENCE

### How It Works

1. **Server Startup**
   ```
   Server starts
     ↓
   Load restaurants from server/data/restaurants.json
   [INIT] Loaded 3 restaurants from file
     ↓
   Load users from server/data/users.json
   [INIT] Loaded 7 users from file
     ↓
   All data available in memory
   ```

2. **Create New Restaurant**
   ```
   User creates restaurant in Super Admin UI
     ↓
   Restaurant added to memory
     ↓
   Admin user created for restaurant
     ↓
   Both saved to JSON files
     ↓
   Data persists across restarts
   ```

3. **Create New User**
   ```
   User creates user in Super Admin UI
     ↓
   User added to memory
     ↓
   User saved to JSON file
     ↓
   Data persists across restarts
   ```

---

## NEXT IDs (For New Records)

When you create new restaurants/users, they'll get these IDs:

- **Next Restaurant ID**: 4
- **Next User ID**: 8

So when you create a new restaurant, it will be:
- Restaurant ID: 4
- Auto-created admin user ID: 8

---

## SUMMARY TABLE

| Type | Count | Storage | Persistence |
|------|-------|---------|-------------|
| Restaurants | 3 | Memory + JSON | ✅ Yes |
| Users | 7 | Memory + JSON | ✅ Yes |
| Super Admin | 1 | Memory + JSON | ✅ Yes |
| Restaurant Admins | 3 | Memory + JSON | ✅ Yes |
| Other Users | 3 | Memory + JSON | ✅ Yes |

---

## WHAT HAPPENS WHEN YOU TEST

### Step 1: Create New Restaurant
- New restaurant gets ID: **4**
- Auto-admin user gets ID: **8**
- Both saved to JSON files
- Next IDs become: Restaurant 5, User 9

### Step 2: Create New User for That Restaurant
- New user gets ID: **9** (or next available)
- User saved to JSON file
- Next ID becomes: User 10

### Step 3: Restart Server
- Server loads 4 restaurants from JSON
- Server loads 8+ users from JSON
- All data available in memory
- New restaurant and users still exist

---

## FILES LOCATION

```
server/
  ├── data/
  │   ├── restaurants.json  (3 restaurants)
  │   └── users.json        (7 users)
  ├── mock-backend.mjs      (Backend server)
  └── middleware/
      ├── permissions.mjs   (Permission checks)
      └── audit.mjs         (Audit logging)
```

---

## VERIFICATION

To verify current data:

1. **Check Restaurants**:
   ```bash
   cat server/data/restaurants.json
   ```

2. **Check Users**:
   ```bash
   cat server/data/users.json
   ```

3. **Check Backend Logs**:
   - Look for `[INIT] Loaded X restaurants from file`
   - Look for `[INIT] Loaded X users from file`

---

## READY TO TEST ✅

Everything is set up and ready. You can now:

1. ✅ Create new restaurant (will be ID 4)
2. ✅ Create new user for that restaurant (will be ID 8+)
3. ✅ Test login with new user
4. ✅ Verify data isolation
5. ✅ Restart server and verify persistence

**All data is persisted and will survive server restarts!**

---
