# RestroHub - Quick Start Guide

## System Status ✅

Both servers are running and fully operational:
- **Frontend**: http://localhost:8080
- **Backend**: http://localhost:5000

## What's Working

### Core Features
- ✅ Menu Management (CRUD operations)
- ✅ Order Management with status tracking
- ✅ Table Management
- ✅ Delivery Management
- ✅ CRM Customer Management
- ✅ Inventory Management
- ✅ Recipe Management
- ✅ Reports & Analytics
- ✅ Support Tickets
- ✅ System Settings
- ✅ Subscriptions

### Technical Features
- ✅ Image Upload for Menu Items
- ✅ Order Status Transitions
- ✅ Demo Data Pre-loaded
- ✅ Mock Backend API
- ✅ React Router v6 with Future Flags
- ✅ TypeScript Support
- ✅ Tailwind CSS Styling
- ✅ Responsive Design

## Demo Credentials

### Admin Login
- **Email**: admin@example.com
- **Password**: admin123

### Super Admin Login
- **Email**: superadmin@restrohub.local
- **Password**: super123

## Demo Data Available

### Menu Items (6 items)
- Butter Chicken - ₹350
- Paneer Tikka - ₹280
- Garlic Naan - ₹60
- Jeera Rice - ₹180
- Masala Chai - ₹80
- Gulab Jamun - ₹120

### Orders (2 sample orders)
- Order #1001: Paneer Tikka x1, Garlic Naan x2 - ₹400
- Order #1002: Butter Chicken x1, Jeera Rice x1 - ₹530

### Tables (6 tables)
- Table 1: 2 seats, Main Hall (Available)
- Table 2: 4 seats, Main Hall (Occupied)
- Table 3: 4 seats, Main Hall (Reserved)
- Table 4: 6 seats, Outdoor (Available)
- Table 5: 8 seats, Private Room (Occupied)
- Table 6: 2 seats, Main Hall (Maintenance)

### CRM Customers (2 customers)
- Rahul Sharma - VIP Customer (32 visits, ₹24,500 spent)
- Priya Singh - Regular Customer (18 visits, ₹12,800 spent)

### Inventory (3 items)
- Chicken: 25 kg (Min: 10, Max: 50)
- Paneer: 8 kg (Min: 5, Max: 30)
- Basmati Rice: 45 kg (Min: 20, Max: 100)

### Recipes (2 recipes)
- Paneer Tikka (Starter, 20 min prep)
- Veg Biryani (Main Course, 30 min prep)

## API Endpoints

### Menu
```
GET    /menu              - Get all menu items
POST   /menu              - Create menu item
PUT    /menu/:id          - Update menu item
DELETE /menu/:id          - Delete menu item
POST   /menu/image        - Upload menu image
```

### Orders
```
GET    /orders            - Get all orders
POST   /orders            - Create order
GET    /orders/:id        - Get order by ID
PUT    /orders/:id        - Update order
DELETE /orders/:id        - Delete order
PATCH  /orders/:id/status - Update order status
GET    /orders/payment-summary - Get payment summary
```

### Tables
```
GET    /tables            - Get all tables
POST   /tables            - Create table
PUT    /tables/:id        - Update table
DELETE /tables/:id        - Delete table
```

### Deliveries
```
GET    /deliveries        - Get all deliveries
POST   /deliveries        - Create delivery
PATCH  /deliveries/:id    - Update delivery
DELETE /deliveries/:id    - Delete delivery
```

### CRM
```
GET    /crm/customers     - Get all customers
POST   /crm/customers     - Create customer
```

### Inventory
```
GET    /inventory         - Get inventory items
POST   /inventory         - Add inventory item
```

### Recipes
```
GET    /recipes           - Get all recipes
POST   /recipes           - Create recipe
```

### Reports
```
GET    /reports/overview  - Get reports overview
```

### Admin
```
GET    /superadmin/support      - Get support tickets
POST   /superadmin/support      - Create support ticket
GET    /superadmin/settings     - Get system settings
GET    /superadmin/subscriptions - Get subscriptions
```

## Common Tasks

### Place an Order
1. Go to Billing page
2. Select order type (Dine-in, Take-away, Delivery)
3. For dine-in: Select a table
4. Add menu items to cart
5. Select payment method
6. Click "Place Order"

### Manage Menu
1. Go to Menu Management
2. View all menu items
3. Add new item with image
4. Edit existing items
5. Delete items

### Track Deliveries
1. Go to Delivery Management
2. View all deliveries
3. Update delivery status
4. Track delivery partners

### View Reports
1. Go to Reports
2. View order statistics
3. Check revenue overview
4. Analyze customer data

### Manage Inventory
1. Go to Inventory
2. View stock levels
3. Add new items
4. Update quantities
5. Monitor min/max stock levels

## Troubleshooting

### Backend Not Responding
```bash
npm run backend
```

### Frontend Not Loading
```bash
npm run dev
```

### Port Already in Use
- Backend: Change PORT in `server/.env`
- Frontend: Vite will auto-select available port

### Clear Cache
- Browser: Ctrl+Shift+Delete
- Local Storage: Open DevTools → Application → Clear Storage

## Development Commands

```bash
# Start backend
npm run backend

# Start frontend
npm run dev

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Build for production
npm build

# Lint code
npm run lint
```

## File Structure

```
├── src/
│   ├── pages/          - Page components
│   ├── components/     - Reusable components
│   ├── lib/            - Utilities and helpers
│   ├── hooks/          - Custom React hooks
│   └── App.tsx         - Main app component
├── server/
│   ├── mock-backend.mjs - Mock API server
│   ├── src/
│   │   ├── app.ts      - Fastify app config
│   │   ├── db.ts       - Database connection
│   │   └── routes/     - API routes
│   └── .env            - Environment variables
└── public/             - Static assets
```

## Next Steps

1. ✅ System is running
2. ✅ All endpoints are working
3. ✅ Demo data is loaded
4. Start exploring features at http://localhost:8080
5. Test API endpoints at http://localhost:5000
6. Create your own data and workflows

---

**Happy Coding! 🚀**
