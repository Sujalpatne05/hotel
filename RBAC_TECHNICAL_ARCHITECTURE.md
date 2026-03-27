# RBAC Technical Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Authentication Context                               │  │
│  │ - User info (id, name, email, role)                 │  │
│  │ - Permissions array                                 │  │
│  │ - JWT token                                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Permission Hook (usePermission)                      │  │
│  │ - Check if user has permission                      │  │
│  │ - Return boolean                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Protected Routes & Components                        │  │
│  │ - Render based on permissions                       │  │
│  │ - Show/hide UI elements                             │  │
│  │ - Redirect if unauthorized                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ↓ (API Calls)
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js)                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Authentication Middleware                            │  │
│  │ - Verify JWT token                                  │  │
│  │ - Extract user info                                 │  │
│  │ - Attach to request                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Authorization Middleware                             │  │
│  │ - Check user role                                   │  │
│  │ - Check permissions                                 │  │
│  │ - Return 403 if denied                              │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Route Handlers                                       │  │
│  │ - Process request                                   │  │
│  │ - Filter data by role                               │  │
│  │ - Return response                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                          ↓                                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Database                                             │  │
│  │ - Users table (with role)                           │  │
│  │ - Permissions table                                 │  │
│  │ - Role_permissions table                            │  │
│  │ - Audit logs                                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### Login Flow
```
1. User enters credentials
   ↓
2. Backend validates credentials
   ↓
3. Backend fetches user role and permissions
   ↓
4. Backend generates JWT token
   ↓
5. Frontend stores token + user info + permissions
   ↓
6. Frontend redirects to dashboard based on role
```

### API Request Flow
```
1. Frontend makes API request with JWT token
   ↓
2. Backend receives request
   ↓
3. Authentication middleware verifies token
   ↓
4. Authorization middleware checks permissions
   ↓
5. If authorized:
   - Process request
   - Filter data by role
   - Return response
   ↓
6. If unauthorized:
   - Return 403 Forbidden
   - Log attempt
```

---

## Database Schema

### Users Table
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- Indexes
CREATE INDEX idx_role ON users(role);
CREATE INDEX idx_restaurant_id ON users(restaurant_id);
CREATE INDEX idx_email ON users(email);
```

### Permissions Table
```sql
CREATE TABLE permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  permission_key VARCHAR(100) UNIQUE NOT NULL,
  description VARCHAR(255),
  resource VARCHAR(50) NOT NULL,
  action VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Example data
INSERT INTO permissions VALUES
(1, 'menu:view', 'View menu items', 'menu', 'view'),
(2, 'menu:create', 'Create menu items', 'menu', 'create'),
(3, 'menu:edit', 'Edit menu items', 'menu', 'edit'),
(4, 'menu:delete', 'Delete menu items', 'menu', 'delete'),
...
```

### Role Permissions Table
```sql
CREATE TABLE role_permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  role ENUM('admin', 'manager', 'staff') NOT NULL,
  permission_id INT NOT NULL,
  FOREIGN KEY (permission_id) REFERENCES permissions(id),
  UNIQUE KEY (role, permission_id)
);

-- Example data
INSERT INTO role_permissions VALUES
(1, 'admin', 1),    -- admin can view menu
(2, 'admin', 2),    -- admin can create menu
(3, 'admin', 3),    -- admin can edit menu
(4, 'admin', 4),    -- admin can delete menu
(5, 'manager', 1),  -- manager can view menu
(6, 'manager', 3),  -- manager can edit menu
(7, 'staff', 1),    -- staff can view menu
...
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(50) NOT NULL,
  resource_id INT,
  old_value JSON,
  new_value JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);
```

---

## Frontend Implementation

### Authentication Context
```typescript
// AuthContext.tsx
interface AuthContextType {
  user: User | null;
  permissions: string[];
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (resource: string, action: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [token, setToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    
    setUser(data.user);
    setPermissions(data.permissions);
    setToken(data.token);
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('permissions', JSON.stringify(data.permissions));
  };

  const hasPermission = (resource: string, action: string) => {
    return permissions.includes(`${resource}:${action}`);
  };

  return (
    <AuthContext.Provider value={{ user, permissions, token, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Permission Hook
```typescript
// usePermission.ts
export function usePermission(resource: string, action: string) {
  const { hasPermission } = useAuth();
  return hasPermission(resource, action);
}

// Usage
function MenuPage() {
  const canEdit = usePermission('menu', 'edit');
  const canDelete = usePermission('menu', 'delete');

  return (
    <div>
      {canEdit && <EditButton />}
      {canDelete && <DeleteButton />}
    </div>
  );
}
```

### Protected Route
```typescript
// ProtectedRoute.tsx
interface ProtectedRouteProps {
  component: React.ComponentType;
  requiredPermissions?: string[];
  requiredRole?: 'admin' | 'manager' | 'staff';
}

export function ProtectedRoute({
  component: Component,
  requiredPermissions,
  requiredRole
}: ProtectedRouteProps) {
  const { user, permissions } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <AccessDenied />;
  }

  if (requiredPermissions) {
    const hasAll = requiredPermissions.every(perm => 
      permissions.includes(perm)
    );
    if (!hasAll) {
      return <AccessDenied />;
    }
  }

  return <Component />;
}

// Usage
<Routes>
  <Route 
    path="/menu" 
    element={
      <ProtectedRoute 
        component={MenuPage}
        requiredPermissions={['menu:view']}
      />
    }
  />
  <Route 
    path="/admin" 
    element={
      <ProtectedRoute 
        component={AdminPanel}
        requiredRole="admin"
      />
    }
  />
</Routes>
```

---

## Backend Implementation

### Authentication Middleware
```javascript
// authMiddleware.js
export function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
```

### Authorization Middleware
```javascript
// authorizationMiddleware.js
export function authorize(resource, action) {
  return async (req, res, next) => {
    const { user } = req;
    
    if (!user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if user has permission
    const hasPermission = await checkPermission(
      user.role,
      resource,
      action
    );

    if (!hasPermission) {
      // Log unauthorized attempt
      await logAudit({
        userId: user.id,
        action: 'UNAUTHORIZED_ACCESS',
        resource,
        resourceId: req.params.id,
        ipAddress: req.ip
      });

      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
}

// Usage
app.put('/menu/:id', authMiddleware, authorize('menu', 'edit'), updateMenu);
```

### Permission Checking
```javascript
// permissionService.js
export async function checkPermission(role, resource, action) {
  const query = `
    SELECT COUNT(*) as count
    FROM role_permissions rp
    JOIN permissions p ON rp.permission_id = p.id
    WHERE rp.role = ? 
    AND p.resource = ? 
    AND p.action = ?
  `;

  const [result] = await db.query(query, [role, resource, action]);
  return result[0].count > 0;
}

export async function getPermissions(role) {
  const query = `
    SELECT p.permission_key
    FROM role_permissions rp
    JOIN permissions p ON rp.permission_id = p.id
    WHERE rp.role = ?
  `;

  const [permissions] = await db.query(query, [role]);
  return permissions.map(p => p.permission_key);
}
```

### Data Filtering by Role
```javascript
// dataFilterService.js
export function filterDataByRole(data, userRole) {
  if (userRole === 'staff') {
    // Remove sensitive fields
    delete data.cost;
    delete data.profit;
    delete data.staffSalaries;
    delete data.vendorInfo;
  }

  if (userRole === 'manager') {
    // Remove admin-only fields
    delete data.systemSettings;
    delete data.auditLogs;
  }

  return data;
}
```

---

## Security Best Practices

### Password Security
```javascript
// Hash passwords with bcrypt
const hashedPassword = await bcrypt.hash(password, 10);

// Verify passwords
const isValid = await bcrypt.compare(password, hashedPassword);
```

### JWT Token
```javascript
// Generate token
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### HTTPS Only
```javascript
// Enforce HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

### CORS Configuration
```javascript
// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

---

## Audit Logging

### Log All Actions
```javascript
// auditService.js
export async function logAudit(action, resource, resourceId, userId, changes) {
  await db.query(
    `INSERT INTO audit_logs 
    (user_id, action, resource, resource_id, old_value, new_value, ip_address)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [userId, action, resource, resourceId, JSON.stringify(changes.old), JSON.stringify(changes.new), req.ip]
  );
}

// Usage
await logAudit('UPDATE', 'menu', menuId, userId, {
  old: { price: 100 },
  new: { price: 150 }
});
```

---

## Testing Strategy

### Unit Tests
- Test permission checking logic
- Test role validation
- Test data filtering

### Integration Tests
- Test API endpoints with different roles
- Test authorization middleware
- Test permission inheritance

### Security Tests
- Test unauthorized access attempts
- Test token expiration
- Test password policies
- Test SQL injection prevention

---

## Deployment Checklist

- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] JWT secret set
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Audit logging enabled
- [ ] Rate limiting configured
- [ ] Error handling tested
- [ ] Security headers set
- [ ] Monitoring enabled

---

## Summary

This RBAC architecture provides:
- ✅ Secure authentication with JWT
- ✅ Granular permission control
- ✅ Role-based data filtering
- ✅ Comprehensive audit logging
- ✅ Scalable permission system
- ✅ Frontend and backend integration
- ✅ Security best practices

Ready to implement!
