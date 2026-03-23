# RestroHub Installation & Setup Guide

## Prerequisites

Before installing, ensure you have:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

---

## STEP 1: Verify Prerequisites

### Check Node.js Installation
```bash
node --version
# Should show: v18.x.x or higher

npm --version
# Should show: 9.x.x or higher

git --version
# Should show: git version 2.x.x or higher
```

If any command fails, install the missing software from the links above.

---

## STEP 2: Clone Repository

### Option A: Using Git (Recommended)
```bash
# Clone the repository
git clone https://github.com/Sujalpatne05/hotel.git

# Navigate to project directory
cd hotel
```

### Option B: Download ZIP
1. Go to https://github.com/Sujalpatne05/hotel
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file
4. Open terminal in the extracted folder

---

## STEP 3: Install Dependencies

### Install All Dependencies
```bash
npm install
```

This will:
- Download all packages from `package.json`
- Create `node_modules` folder
- Generate `package-lock.json`
- Take 2-5 minutes depending on internet speed

### Verify Installation
```bash
npm list
# Should show all installed packages without errors
```

---

## STEP 4: Environment Setup

### Create `.env` File (Optional for Development)
```bash
# Create .env file in project root
echo "VITE_API_URL=http://localhost:5000" > .env
```

Or manually create `.env` file with:
```
VITE_API_URL=http://localhost:5000
```

---

## STEP 5: Start Development Server

### Terminal 1: Start Backend
```bash
npm run dev:backend
```

Or manually:
```bash
node server/mock-backend.mjs
```

Expected output:
```
Server running on http://localhost:5000
```

### Terminal 2: Start Frontend
```bash
npm run dev
```

Or manually:
```bash
npm run dev
```

Expected output:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:8080/
➜  press h to show help
```

---

## STEP 6: Access Application

### Open in Browser
```
http://localhost:8080
```

### Login with Test Credentials
- **Email**: `admin@example.com`
- **Password**: `admin123`

Or for Super Admin:
- **Email**: `superadmin@restrohub.local`
- **Password**: `super123`

---

## STEP 7: Verify Installation

### Check Frontend
- [ ] Page loads without errors
- [ ] Dashboard displays
- [ ] Sidebar menu visible
- [ ] No red errors in console (F12)

### Check Backend
- [ ] Terminal shows "Server running on http://localhost:5000"
- [ ] No error messages in backend terminal
- [ ] API calls succeed (check Network tab in DevTools)

### Check Integration
1. Open DevTools (F12)
2. Go to Network tab
3. Try logging in
4. Verify API calls go to `http://localhost:5000`
5. Login should succeed

---

## Available Commands

### Development
```bash
# Start frontend dev server
npm run dev

# Start backend dev server
npm run dev:backend

# Start both (if configured)
npm run dev:all
```

### Build
```bash
# Build frontend for production
npm run build

# Preview production build
npm run preview
```

### Linting & Formatting
```bash
# Run ESLint
npm run lint

# Format code with Prettier (if configured)
npm run format
```

### Testing
```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## Project Structure

```
hotel/
├── server/
│   └── mock-backend.mjs          ← Backend server
├── src/
│   ├── components/               ← React components
│   │   ├── AppSidebar.tsx
│   │   ├── NavLink.tsx
│   │   └── ...
│   ├── pages/                    ← Page components
│   │   ├── Billing.tsx
│   │   ├── Orders.tsx
│   │   ├── Dashboard.tsx
│   │   └── ...
│   ├── lib/                      ← Utilities
│   │   ├── api.ts                ← API configuration
│   │   ├── session.ts
│   │   └── ...
│   ├── App.tsx                   ← Main app component
│   ├── main.tsx                  ← Entry point
│   └── index.css
├── public/                       ← Static assets
├── package.json                  ← Dependencies
├── vite.config.ts                ← Vite configuration
├── tsconfig.json                 ← TypeScript configuration
├── eslint.config.js              ← ESLint configuration
└── README.md

```

---

## Troubleshooting

### Issue: "npm: command not found"
**Solution**: Node.js not installed
- Download and install from https://nodejs.org/
- Restart terminal after installation
- Verify: `node --version`

### Issue: "Port 5000 already in use"
**Solution**: Another process is using port 5000
```bash
# Find process using port 5000
# On Windows:
netstat -ano | findstr :5000

# On Mac/Linux:
lsof -i :5000

# Kill the process (replace PID with actual process ID)
# On Windows:
taskkill /PID <PID> /F

# On Mac/Linux:
kill -9 <PID>
```

### Issue: "Port 8080 already in use"
**Solution**: Another process is using port 8080
```bash
# Same as above, but for port 8080
```

### Issue: "Cannot find module" error
**Solution**: Dependencies not installed
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: "CORS error" or "Cannot reach backend"
**Solution**: Backend not running
- Ensure backend terminal shows "Server running on http://localhost:5000"
- Check `VITE_API_URL` in `.env` file
- Verify backend is accessible: `curl http://localhost:5000/auth/login`

### Issue: "Build fails"
**Solution**: TypeScript or build errors
```bash
# Check for errors
npm run build

# Fix common issues
npm run lint --fix

# Clear cache and rebuild
rm -rf dist
npm run build
```

### Issue: "Blank page or 404"
**Solution**: Frontend build issue
- Check browser console (F12) for errors
- Verify `vite.config.ts` is correct
- Try: `npm run build && npm run preview`

### Issue: "Login fails with 'Invalid credentials'"
**Solution**: Wrong credentials or backend issue
- Use test credentials: `admin@example.com` / `admin123`
- Check backend is running
- Check Network tab for actual error response
- Verify backend logs for errors

---

## Development Tips

### Hot Module Replacement (HMR)
- Frontend automatically reloads when you save files
- No need to manually refresh browser
- Backend requires manual restart

### Debug Mode
```bash
# Run with debug logging
DEBUG=* npm run dev:backend
```

### Browser DevTools
- **F12**: Open DevTools
- **Console**: Check for JavaScript errors
- **Network**: Monitor API calls
- **Application**: View local storage, cookies
- **Performance**: Check load times

### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Thunder Client (API testing)
- REST Client

---

## Database Setup (Optional)

### Current Setup
- In-memory database (data resets on server restart)
- Perfect for development and testing

### Upgrade to MongoDB (Optional)
1. Create MongoDB Atlas account: https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update backend to use MongoDB
5. Data persists across restarts

### Upgrade to PostgreSQL (Optional)
1. Install PostgreSQL: https://www.postgresql.org/download/
2. Create database
3. Update backend to use PostgreSQL
4. Data persists across restarts

---

## Production Build

### Build for Production
```bash
npm run build
```

This creates:
- `dist/` folder with optimized frontend
- Ready to deploy on Vercel

### Test Production Build Locally
```bash
npm run preview
```

Then visit: `http://localhost:4173`

---

## Git Workflow

### Check Status
```bash
git status
```

### Add Changes
```bash
git add .
```

### Commit Changes
```bash
git commit -m "Your commit message"
```

### Push to GitHub
```bash
git push origin main
```

### Pull Latest Changes
```bash
git pull origin main
```

---

## Performance Optimization

### Frontend
- Vite provides fast HMR
- React Fast Refresh for instant updates
- Code splitting for faster loads

### Backend
- In-memory database is very fast
- No database queries needed
- Perfect for development

---

## Security Notes

### Development
- Don't commit `.env` file with secrets
- Use test credentials only
- Backend runs on localhost (not exposed)

### Production
- Use environment variables for secrets
- Enable HTTPS (automatic on Vercel/Render)
- Use strong passwords
- Enable 2FA for admin accounts

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start backend: `npm run dev:backend`
3. ✅ Start frontend: `npm run dev`
4. ✅ Open browser: `http://localhost:8080`
5. ✅ Login with test credentials
6. ✅ Explore the application
7. ✅ Read deployment guides when ready

---

## Support

### Documentation
- Read `README.md` for overview
- Check `DEPLOYMENT_GUIDE.md` for deployment
- See `QUICK_REFERENCE.md` for common tasks

### Troubleshooting
- Check browser console (F12) for errors
- Check backend terminal for errors
- Review Network tab for API errors
- Check GitHub issues for known problems

### Getting Help
- Check documentation files
- Review error messages carefully
- Search GitHub issues
- Contact support (see sidebar in app)

---

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Start frontend | `npm run dev` |
| Start backend | `npm run dev:backend` |
| Build for production | `npm run build` |
| Preview production build | `npm run preview` |
| Run linter | `npm run lint` |
| Run tests | `npm run test` |
| Check Node version | `node --version` |
| Check npm version | `npm --version` |

---

## Checklist

- [ ] Node.js v18+ installed
- [ ] npm installed
- [ ] Git installed
- [ ] Repository cloned
- [ ] Dependencies installed (`npm install`)
- [ ] Backend running (`npm run dev:backend`)
- [ ] Frontend running (`npm run dev`)
- [ ] Browser opens to `http://localhost:8080`
- [ ] Login works with test credentials
- [ ] No errors in console or terminal
- [ ] Ready to develop!

