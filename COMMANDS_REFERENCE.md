# RestroHub Commands Reference

## Installation Commands

```bash
# Install Node.js (if not installed)
# Download from: https://nodejs.org/

# Verify installation
node --version
npm --version
git --version

# Clone repository
git clone https://github.com/Sujalpatne05/hotel.git
cd hotel

# Install dependencies
npm install
```

---

## Development Commands

### Start Development Servers

```bash
# Terminal 1: Start Backend (Port 5000)
npm run dev:backend

# Or manually:
node server/mock-backend.mjs

# Terminal 2: Start Frontend (Port 8080)
npm run dev

# Or manually:
npm run dev
```

### Access Application
```
Frontend: http://localhost:8080
Backend:  http://localhost:5000
```

### Test Credentials
```
Email:    admin@example.com
Password: admin123

Or Super Admin:
Email:    superadmin@restrohub.local
Password: super123
```

---

## Build Commands

```bash
# Build frontend for production
npm run build

# Preview production build locally
npm run preview

# Build and preview
npm run build && npm run preview
```

---

## Code Quality Commands

```bash
# Run ESLint
npm run lint

# Fix linting errors automatically
npm run lint --fix

# Format code (if Prettier configured)
npm run format

# Type check
npm run type-check
```

---

## Testing Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- filename.test.ts
```

---

## Git Commands

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main

# View commit history
git log

# Create new branch
git checkout -b feature/your-feature

# Switch branch
git checkout main

# Delete branch
git branch -d feature/your-feature
```

---

## Troubleshooting Commands

### Check if Ports are in Use

```bash
# Windows: Check port 5000
netstat -ano | findstr :5000

# Windows: Check port 8080
netstat -ano | findstr :8080

# Mac/Linux: Check port 5000
lsof -i :5000

# Mac/Linux: Check port 8080
lsof -i :8080
```

### Kill Process Using Port

```bash
# Windows: Kill process (replace PID with actual ID)
taskkill /PID <PID> /F

# Mac/Linux: Kill process
kill -9 <PID>
```

### Clear Cache and Reinstall

```bash
# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Clear npm cache
npm cache clean --force
```

### Test Backend Connection

```bash
# Test if backend is running
curl http://localhost:5000/auth/login

# Test with data
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Check Logs

```bash
# View backend logs (if running in background)
npm run dev:backend 2>&1 | tee backend.log

# View frontend build logs
npm run build 2>&1 | tee build.log
```

---

## Environment Variables

### Development (.env)
```bash
VITE_API_URL=http://localhost:5000
```

### Production (.env.production)
```bash
VITE_API_URL=https://restrohub-backend.onrender.com
```

### Backend Environment Variables
```bash
PORT=5000
FRONTEND_URL=http://localhost:8080
NODE_ENV=development
```

---

## Package Management

```bash
# Install specific package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Update all packages
npm update

# Check for outdated packages
npm outdated

# Remove package
npm uninstall package-name

# List installed packages
npm list

# Check for security vulnerabilities
npm audit

# Fix security vulnerabilities
npm audit fix
```

---

## Deployment Commands

### Prepare for Deployment

```bash
# Build frontend
npm run build

# Verify build
npm run preview

# Commit changes
git add .
git commit -m "Prepare for deployment"

# Push to GitHub
git push origin main
```

### Deploy on Vercel

```bash
# Install Vercel CLI (optional)
npm install -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Deploy on Render

```bash
# No CLI needed - connect GitHub and deploy from dashboard
# https://render.com
```

---

## Docker Commands (Optional)

```bash
# Build Docker image
docker build -t restrohub .

# Run Docker container
docker run -p 5000:5000 -p 8080:8080 restrohub

# Stop container
docker stop <container-id>

# View running containers
docker ps
```

---

## Database Commands (Optional)

### MongoDB

```bash
# Connect to MongoDB
mongosh "mongodb+srv://username:password@cluster.mongodb.net/database"

# List databases
show databases

# Use database
use restrohub

# List collections
show collections

# Query data
db.users.find()
```

### PostgreSQL

```bash
# Connect to PostgreSQL
psql -U username -d restrohub

# List databases
\l

# Connect to database
\c restrohub

# List tables
\dt

# Query data
SELECT * FROM users;
```

---

## Useful Shortcuts

### VS Code
```
Ctrl+` : Open terminal
Ctrl+Shift+P : Command palette
Ctrl+/ : Comment/uncomment
Ctrl+D : Select word
Ctrl+Shift+L : Select all occurrences
Ctrl+H : Find and replace
Ctrl+F : Find
```

### Browser DevTools
```
F12 : Open DevTools
Ctrl+Shift+I : Open DevTools (Windows)
Cmd+Option+I : Open DevTools (Mac)
Ctrl+Shift+J : Open Console
Ctrl+Shift+K : Open Network tab
Ctrl+Shift+C : Element picker
```

---

## Common Workflows

### Add New Feature

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and test
npm run dev

# Commit changes
git add .
git commit -m "Add new feature"

# Push branch
git push origin feature/new-feature

# Create Pull Request on GitHub
```

### Fix Bug

```bash
# Create bug fix branch
git checkout -b fix/bug-name

# Make changes and test
npm run dev

# Commit changes
git add .
git commit -m "Fix bug: description"

# Push branch
git push origin fix/bug-name

# Create Pull Request on GitHub
```

### Deploy to Production

```bash
# Ensure all changes are committed
git status

# Build for production
npm run build

# Verify build
npm run preview

# Push to main branch
git push origin main

# Vercel/Render will auto-deploy
```

---

## Performance Monitoring

```bash
# Check bundle size
npm run build

# Analyze bundle
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer dist/stats.json

# Check performance
npm run preview

# Monitor in DevTools: Performance tab
```

---

## Security Commands

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (may break compatibility)
npm audit fix --force

# Check outdated packages
npm outdated

# Update packages safely
npm update
```

---

## Quick Start (Copy & Paste)

```bash
# Clone and setup
git clone https://github.com/Sujalpatne05/hotel.git
cd hotel
npm install

# Terminal 1: Start backend
npm run dev:backend

# Terminal 2: Start frontend
npm run dev

# Open browser
# http://localhost:8080

# Login with:
# Email: admin@example.com
# Password: admin123
```

---

## Emergency Commands

```bash
# If everything breaks, start fresh
rm -rf node_modules package-lock.json
npm install
npm run dev:backend
npm run dev

# If ports are stuck
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :5000
kill -9 <PID>

# If git is stuck
git reset --hard HEAD
git clean -fd

# If npm is stuck
npm cache clean --force
npm install
```

---

## Useful Links

- **Node.js**: https://nodejs.org/
- **npm**: https://www.npmjs.com/
- **Git**: https://git-scm.com/
- **GitHub**: https://github.com/Sujalpatne05/hotel
- **Vercel**: https://vercel.com/
- **Render**: https://render.com/
- **VS Code**: https://code.visualstudio.com/
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/

---

## Command Cheat Sheet

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Start backend | `npm run dev:backend` |
| Start frontend | `npm run dev` |
| Build | `npm run build` |
| Preview build | `npm run preview` |
| Lint | `npm run lint` |
| Test | `npm run test` |
| Git status | `git status` |
| Git commit | `git commit -m "msg"` |
| Git push | `git push origin main` |
| Git pull | `git pull origin main` |
| Check Node | `node --version` |
| Check npm | `npm --version` |

