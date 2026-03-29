# Multi-Restaurant Database Strategy

**Question**: When we add many restaurants, do we need separate databases or one shared database?

**Answer**: ✅ **ONE SHARED DATABASE** (with proper data isolation)

---

## THE ANSWER

### ❌ DON'T DO THIS (Separate Database per Restaurant)
```
Restaurant 1 → Database 1
Restaurant 2 → Database 2
Restaurant 3 → Database 3
...
Restaurant 100 → Database 100

Problems:
- 100 databases to manage ❌
- 100x more expensive ❌
- Backup nightmare ❌
- Scaling nightmare ❌
- Maintenance nightmare ❌
```

### ✅ DO THIS (One Database, Multiple Restaurants)
```
One Database
├─ Restaurant 1 data (filtered by restaurant_id)
├─ Restaurant 2 data (filtered by restaurant_id)
├─ Restaurant 3 data (filtered by restaurant_id)
└─ Restaurant 100 data (filtered by restaurant_id)

Benefits:
- 1 database to manage ✅
- Cost-effective ✅
- Easy backups ✅
- Easy scaling ✅
- Easy maintenance ✅
```

---

## HOW IT WORKS (Multi-Tenancy)

### Database Structure

```sql
-- Users Table
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255),
  password VARCHAR(255),
  role VARCHAR(50),
  restaurant_id INT,  -- ← KEY: Links user to restaurant
  created_at TIMESTAMP
);

-- Restaurants Table
CREATE TABLE restaurants (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  address VARCHAR(255),
  created_at TIMESTAMP
);

-- Menu Table
CREATE TABLE menu (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(10, 2),
  restaurant_id INT,  -- ← KEY: Links menu to restaurant
  created_at TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
  id INT PRIMARY KEY,
  table_number INT,
  restaurant_id INT,  -- ← KEY: Links order to restaurant
  created_at TIMESTAMP
);

-- Inventory Table
CREATE TABLE inventory (
  id INT PRIMARY KEY,
  item_name VARCHAR(255),
  quantity INT,
  restaurant_id INT,  -- ← KEY: Links inventory to restaurant
  created_at TIMESTAMP
);
```

### The Key: `restaurant_id` Field

Every table has a `restaurant_id` field that identifies which restaurant owns the data.

---

## DATA ISOLATION (How Restaurants Don't See Each Other's Data)

### ❌ WRONG (No Filtering)
```javascript
// Backend endpoint - NO FILTERING
app.get('/menu', (req, res) => {
  const allMenu = db.query('SELECT * FROM menu');
  res.json(allMenu);  // Returns ALL restaurants' menu ❌
});
```

**Problem**: Restaurant 1 sees Restaurant 2's menu!

### ✅ CORRECT (With Filtering)
```javascript
// Backend endpoint - WITH FILTERING
app.get('/menu', (req, res) => {
  const user = extractUser(req);  // Get logged-in user
  const restaurantId = user.restaurant_id;  // Get their restaurant
  
  // Query ONLY this restaurant's menu
  const menu = db.query(
    'SELECT * FROM menu WHERE restaurant_id = ?',
    [restaurantId]
  );
  
  res.json(menu);  // Returns ONLY this restaurant's menu ✅
});
```

**Benefit**: Restaurant 1 only sees their own menu!

---

## EXAMPLE: How It Works in Practice

### Scenario: 3 Restaurants

```
Database:
┌─────────────────────────────────────────────────────────────┐
│                      SINGLE DATABASE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Users Table:                                              │
│  ├─ User 1: admin@dosti.com, restaurant_id=1              │
│  ├─ User 2: admin@abc.com, restaurant_id=2                │
│  └─ User 3: admin@taj.com, restaurant_id=3                │
│                                                             │
│  Menu Table:                                               │
│  ├─ Biryani, price=250, restaurant_id=1 (Dosti)           │
│  ├─ Butter Chicken, price=300, restaurant_id=1 (Dosti)    │
│  ├─ Burger, price=150, restaurant_id=2 (ABC)              │
│  ├─ Pizza, price=200, restaurant_id=2 (ABC)               │
│  ├─ Samosa, price=50, restaurant_id=3 (Taj)               │
│  └─ Naan, price=30, restaurant_id=3 (Taj)                 │
│                                                             │
│  Orders Table:                                             │
│  ├─ Order 1, table=1, restaurant_id=1 (Dosti)             │
│  ├─ Order 2, table=2, restaurant_id=2 (ABC)               │
│  └─ Order 3, table=1, restaurant_id=3 (Taj)               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### When Dosti Admin Logs In

```
1. Admin logs in with: admin@dosti.com
2. Backend finds user: restaurant_id = 1
3. Admin requests menu
4. Backend queries: SELECT * FROM menu WHERE restaurant_id = 1
5. Backend returns: [Biryani, Butter Chicken]
6. Admin sees ONLY Dosti's menu ✅
```

### When ABC Admin Logs In

```
1. Admin logs in with: admin@abc.com
2. Backend finds user: restaurant_id = 2
3. Admin requests menu
4. Backend queries: SELECT * FROM menu WHERE restaurant_id = 2
5. Backend returns: [Burger, Pizza]
6. Admin sees ONLY ABC's menu ✅
```

### When Taj Admin Logs In

```
1. Admin logs in with: admin@taj.com
2. Backend finds user: restaurant_id = 3
3. Admin requests menu
4. Backend queries: SELECT * FROM menu WHERE restaurant_id = 3
5. Backend returns: [Samosa, Naan]
6. Admin sees ONLY Taj's menu ✅
```

---

## CURRENT STATE OF YOUR SYSTEM

### What You Have Now
```
✅ One database (PostgreSQL configured)
✅ restaurant_id field in users table
✅ Users linked to restaurants
⏳ Data filtering NOT YET implemented (Phase 3)
```

### What You Need to Add (Phase 3)

Add `restaurant_id` to ALL tables:
```
✅ users table (already has it)
⏳ menu table (add restaurant_id)
⏳ orders table (add restaurant_id)
⏳ inventory table (add restaurant_id)
⏳ payroll table (add restaurant_id)
⏳ reservations table (add restaurant_id)
⏳ All other tables (add restaurant_id)
```

Then filter ALL queries by `restaurant_id`:
```
⏳ GET /menu → Filter by restaurant_id
⏳ GET /orders → Filter by restaurant_id
⏳ GET /inventory → Filter by restaurant_id
⏳ GET /payroll → Filter by restaurant_id
⏳ All other endpoints → Filter by restaurant_id
```

---

## COST COMPARISON

### Option 1: Separate Database per Restaurant (❌ WRONG)
```
100 restaurants × $15/month per database = $1,500/month ❌
```

### Option 2: One Shared Database (✅ CORRECT)
```
1 database × $15/month = $15/month ✅
```

**Savings**: $1,485/month! 💰

---

## SECURITY: Can Restaurants See Each Other's Data?

### Current State (Before Phase 3)
```
❌ Frontend hides features by role
❌ Backend doesn't filter by restaurant_id
❌ If staff knows the API, they could see other restaurants' data
```

### After Phase 3
```
✅ Frontend hides features by role
✅ Backend filters by restaurant_id
✅ Even if staff knows the API, they can't see other restaurants' data
```

---

## IMPLEMENTATION ROADMAP

### Phase 1 (Already Done) ✅
- Create restaurants table
- Create users table with restaurant_id
- Link users to restaurants

### Phase 2 (Already Done) ✅
- Create menu, orders, inventory tables
- Add restaurant_id to all tables

### Phase 3 (NEXT - 2 days) ⏳
- Add filtering to ALL endpoints
- Ensure every query filters by restaurant_id
- Add permission checks
- Add audit logging

### Phase 4 (After Phase 3) ⏳
- Add role-based features
- Add advanced filtering
- Add reporting by restaurant

---

## EXAMPLE: Adding restaurant_id to Menu Table

### Current Menu Table (No restaurant_id)
```sql
CREATE TABLE menu (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(10, 2),
  created_at TIMESTAMP
);
```

### Updated Menu Table (With restaurant_id)
```sql
CREATE TABLE menu (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  price DECIMAL(10, 2),
  restaurant_id INT,  -- ← ADD THIS
  created_at TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);
```

### Current Menu Endpoint (No Filtering)
```javascript
app.get('/menu', (req, res) => {
  const menu = db.query('SELECT * FROM menu');
  res.json(menu);  // Returns ALL menus ❌
});
```

### Updated Menu Endpoint (With Filtering)
```javascript
app.get('/menu', (req, res) => {
  const user = extractUser(req);
  const restaurantId = user.restaurant_id;
  
  const menu = db.query(
    'SELECT * FROM menu WHERE restaurant_id = ?',
    [restaurantId]
  );
  res.json(menu);  // Returns ONLY this restaurant's menu ✅
});
```

---

## SUMMARY

| Question | Answer |
|----------|--------|
| Separate DB per restaurant? | ❌ NO |
| One shared database? | ✅ YES |
| Can restaurants see each other's data? | ❌ NO (with Phase 3) |
| How to prevent data leakage? | Filter by restaurant_id |
| Cost for 100 restaurants? | $15/month (not $1,500) |
| When to implement filtering? | Phase 3 (2 days) |

---

## VISUAL DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                    SINGLE DATABASE                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Restaurant 1 Data (restaurant_id = 1)               │  │
│  │ ├─ Users: admin@dosti.com                           │  │
│  │ ├─ Menu: Biryani, Butter Chicken                    │  │
│  │ ├─ Orders: Order 1, Order 2                         │  │
│  │ └─ Inventory: Rice, Chicken                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Restaurant 2 Data (restaurant_id = 2)               │  │
│  │ ├─ Users: admin@abc.com                             │  │
│  │ ├─ Menu: Burger, Pizza                              │  │
│  │ ├─ Orders: Order 3, Order 4                         │  │
│  │ └─ Inventory: Beef, Cheese                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Restaurant 3 Data (restaurant_id = 3)               │  │
│  │ ├─ Users: admin@taj.com                             │  │
│  │ ├─ Menu: Samosa, Naan                               │  │
│  │ ├─ Orders: Order 5, Order 6                         │  │
│  │ └─ Inventory: Flour, Spices                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

Each restaurant's data is isolated by restaurant_id ✅
```

---

## FINAL ANSWER

**Question**: Do we need separate databases?

**Answer**: 
- ❌ NO - One shared database is better
- ✅ Use `restaurant_id` to isolate data
- ✅ Filter all queries by `restaurant_id`
- ✅ This is called "Multi-Tenancy"
- ✅ Cheaper, easier, more scalable
- ✅ Your system already supports this
- ⏳ Phase 3 will implement the filtering

**Cost**: $15/month for 100 restaurants (not $1,500/month)

**Timeline**: Phase 3 (2 days) to add filtering

