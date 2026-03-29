# RestroHub Production Deployment Guide

**Date**: March 29, 2026  
**Status**: Ready for Production  
**Estimated Deployment Time**: 30-45 minutes

---

## TABLE OF CONTENTS

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Architecture Overview](#architecture-overview)
3. [Environment Variables](#environment-variables)
4. [Backend Deployment (Render)](#backend-deployment-render)
5. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
6. [Database Setup](#database-setup)
7. [Post-Deployment Testing](#post-deployment-testing)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)
10. [Security Considerations](#security-considerations)

---

## PRE-DEPLOYMENT CHECKLIST

### Code Quality
- [ ] All console errors fixed
- [ ] No hardcoded credentials in code
- [ ] All environment variables use `.env` files
- [ ] No sensitive data in git history
- [ ] All tests passing locally
- [ ] Build completes without warnings

### Backend
- [ ] `server/mock-backend.mjs` uses environment variables
- [ ] CORS configured for production domain
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Database connection tested (if using PostgreSQL)
- [ ] All API endpoints tested locally

### Frontend
- [ ] `vite.config.ts` has production build settings
- [ ] Environment variables configured in `.env.production`
- [ ] API base URL points to backend
- [ ] PWA manifest configured
- [ ] Icons and assets optimized
- [ ] No console errors in production build

### Git & Deployment
- [ ] All changes committed to `main` branch
- [ ] No uncommitted changes
- [ ] GitHub repository is public or accessible
- [ ] Render and Vercel accounts created
- [ ] GitHub connected to both platforms

---

## ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION ARCHITECTURE                   │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                         USERS                                │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend)                          │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  React + Vite + TypeScript + Tailwind CSS             │  │
│  │  URL: https://restrohub.vercel.app                    │  │
│  │  Build: npm run build                                 │  │
│  │  Output: dist/                                        │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                    (API calls via /api)
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    RENDER (Backend)                           │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Node.js + Express                                    │  │
│  │  URL: https://restrohub-backend.onrender.com          │  │
│  │  Start: node server/mock-backend.mjs                  │  │
│  │  Port: 5000                                           │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    DATABASE (Optional)                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Neon PostgreSQL (configured but not used yet)        │  │
│  │  URL: postgresql://...                                │  │
│  │  Status: Ready for Phase 3 implementation             │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

---

## ENVIRONMENT VARIABLES

### Frontend Environment Variables

**File**: `.env.production` (create this file)

```env
# API Configuration
VITE_API_URL=https://restrohub-backend.onrender.com

# App Configuration
VITE_APP_NAME=RestroHub
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_OFFLINE=true
```

**How to use in code**:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

### Backend Environment Variables

**File**: `.env` (don't commit this)

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend Configuration (for CORS)
FRONTEND_URL=https://restrohub.vercel.app

# Database Configuration (optional, for Phase 3)
DATABASE_URL=postgresql://neondb_owner:npg_mEYy08HtFGpW@ep-icy-fog-a1ovxx6v-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

# JWT Configuration
JWT_SECRET=your_secure_jwt_secret_here_change_this

# SuperAdmin Credentials
SUPERADMIN_EMAIL=superadmin@restrohub.local
SUPERADMIN_PASSWORD=super123
```

**Important**: 
- Never commit `.env` files
- Use `.env.example` for documentation
- Change `JWT_SECRET` to a secure random string
- Change `SUPERADMIN_PASSWORD` in production

---

## BACKEND DEPLOYMENT (RENDER)

### Step 1: Prepare Backend

1. **Verify `server/mock-backend.mjs` uses environment variables**:

```javascript
// Should have:
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';
const NODE_ENV = process.env.NODE_ENV || 'development';
```

2. **Verify CORS is configured**:

```javascript
// Should have CORS middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

3. **Verify `package.json` has correct scripts**:

```json
{
  "scripts": {
    "start": "node server/mock-backend.mjs",
    "dev": "node server/mock-backend.mjs",
    "backend": "node server/mock-backend.mjs"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### Step 2: Create Render Account

1. Go to https://render.com
2. Click "Sign up"
3. Sign up with GitHub (recommended)
4. Authorize access to your repositories

### Step 3: Deploy Backend on Render

1. **Click "New +"** → Select **"Web Service"**
2. **Connect GitHub**:
   - Click "Connect account"
   - Authorize GitHub
   - Select repository: `Sujalpatne05/hotel`
   - Select branch: `main`

3. **Configure Web Service**:
   - **Name**: `restrohub-backend`
   - **Environment**: `Node`
   - **Region**: `Oregon` (or closest to you)
   - **Build Command**: `npm install`
   - **Start Command**: `node server/mock-backend.mjs`
   - **Instance Type**: `Free` (for testing) or `Starter` ($7/month for production)

4. **Add Environment Variables**:
   - Click "Advanced" → "Environment"
   - Add each variable:
     ```
     PORT=5000
     NODE_ENV=production
     FRONTEND_URL=https://restrohub.vercel.app
     JWT_SECRET=your_secure_random_string_here
     SUPERADMIN_EMAIL=superadmin@restrohub.local
     SUPERADMIN_PASSWORD=super123
     DATABASE_URL=postgresql://...
     ```

5. **Click "Create Web Service"**
   - Wait for deployment (2-3 minutes)
   - Check logs for errors
   - Once deployed, note the URL: `https://restrohub-backend.onrender.com`

### Step 4: Verify Backend Deployment

```bash
# Test if backend is running
curl https://restrohub-backend.onrender.com/auth/login

# Should return: {"message":"Login endpoint"}
```

---

## FRONTEND DEPLOYMENT (VERCEL)

### Step 1: Prepare Frontend

1. **Verify `vite.config.ts` has production settings**:

```typescript
export default defineConfig(({ mode }) => ({
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  },
  // ... rest of config
}));
```

2. **Create `.env.production`**:

```env
VITE_API_URL=https://restrohub-backend.onrender.com
VITE_APP_NAME=RestroHub
VITE_ENABLE_PWA=true
```

3. **Verify `package.json` has build script**:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Step 2: Create Vercel Account

1. Go to https://vercel.com
2. Click "Sign up"
3. Sign up with GitHub (recommended)
4. Authorize access to your repositories

### Step 3: Deploy Frontend on Vercel

1. **Click "Add New..."** → Select **"Project"**
2. **Import Git Repository**:
   - Click "Import Git Repository"
   - Paste: `https://github.com/Sujalpatne05/hotel`
   - Click "Import"

3. **Configure Project**:
   - **Project Name**: `restrohub`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://restrohub-backend.onrender.com
     VITE_APP_NAME=RestroHub
     VITE_ENABLE_PWA=true
     ```

5. **Click "Deploy"**
   - Wait for deployment (2-3 minutes)
   - Check build logs for errors
   - Once deployed, note the URL: `https://restrohub.vercel.app`

### Step 4: Update Backend CORS

1. **Go back to Render dashboard**
2. **Click on your backend service**: `restrohub-backend`
3. **Click "Settings"** → **"Environment"**
4. **Update `FRONTEND_URL`**:
   ```
   FRONTEND_URL=https://restrohub.vercel.app
   ```
5. **Click "Save"** - backend will redeploy automatically

---

## DATABASE SETUP

### Current Status
- **Using**: Mock backend with JSON file persistence
- **Location**: `server/data/users.json`
- **Status**: Works for current phase (Phase 1-2)

### For Phase 3 (Backend Permission Checks)

The database is already configured but not used yet:

```env
DATABASE_URL=postgresql://neondb_owner:npg_mEYy08HtFGpW@ep-icy-fog-a1ovxx6v-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

**When to migrate to PostgreSQL**:
- After Phase 3 is complete
- When you need persistent data across deployments
- When you need advanced querying

**Migration steps** (for later):
1. Create database schema
2. Migrate data from JSON to PostgreSQL
3. Update backend to use PostgreSQL driver
4. Test thoroughly before going live

---

## POST-DEPLOYMENT TESTING

### Test 1: Frontend Loads

```bash
# Visit frontend URL
https://restrohub.vercel.app

# Should see:
- Login page loads
- No console errors
- All images load
- Responsive design works
```

### Test 2: Backend Responds

```bash
# Test backend endpoint
curl https://restrohub-backend.onrender.com/auth/login

# Should return:
{"message":"Login endpoint"}
```

### Test 3: Login Works

1. Go to https://restrohub.vercel.app
2. Login with test credentials:
   ```
   Email: superadmin@restrohub.local
   Password: super123
   ```
3. Should see dashboard
4. Check browser DevTools → Network tab
5. API calls should go to `https://restrohub-backend.onrender.com`

### Test 4: Create Restaurant

1. Login as SuperAdmin
2. Go to "Restaurants" page
3. Click "Add Restaurant"
4. Fill form and submit
5. Should see success message
6. Check Network tab - POST request should go to backend

### Test 5: Create User

1. Go to "Users" page
2. Click "Create User"
3. Fill form and submit
4. Should see user in list
5. Check Network tab - POST request should go to backend

### Test 6: Mobile Responsive

1. Open DevTools (F12)
2. Click device toggle (mobile view)
3. Test on different screen sizes
4. All features should work on mobile

### Test 7: PWA Features

1. Open DevTools → Application tab
2. Check "Service Workers" - should be registered
3. Check "Manifest" - should show app details
4. Try offline mode - should show offline page

---

## MONITORING & MAINTENANCE

### Render Dashboard

**View Logs**:
1. Go to https://render.com/dashboard
2. Click on `restrohub-backend` service
3. Click "Logs" tab
4. View real-time logs

**Check Metrics**:
1. Click on service
2. Click "Metrics" tab
3. Monitor CPU, Memory, Network

**Restart Service**:
1. Click on service
2. Click "Manual Deploy" button
3. Service will restart

### Vercel Dashboard

**View Deployments**:
1. Go to https://vercel.com/dashboard
2. Click on `restrohub` project
3. See all deployments

**Check Analytics**:
1. Click on project
2. Click "Analytics" tab
3. View performance metrics

**View Logs**:
1. Click on deployment
2. Click "Logs" tab
3. View build and runtime logs

### Monitoring Checklist

- [ ] Check backend logs daily for errors
- [ ] Monitor CPU/Memory usage on Render
- [ ] Check frontend build logs after each deployment
- [ ] Monitor API response times
- [ ] Set up alerts for errors (optional)
- [ ] Review user feedback for issues

---

## TROUBLESHOOTING

### Issue: "Cannot reach backend" or CORS error

**Symptoms**:
- Frontend loads but API calls fail
- Console shows CORS error
- Network tab shows failed requests to backend

**Solutions**:
1. Verify backend is running:
   ```bash
   curl https://restrohub-backend.onrender.com/auth/login
   ```

2. Check `FRONTEND_URL` on Render:
   - Go to Render dashboard
   - Click on backend service
   - Check Environment Variables
   - Ensure `FRONTEND_URL` matches your Vercel URL exactly

3. Check `VITE_API_URL` on Vercel:
   - Go to Vercel dashboard
   - Click on project
   - Check Environment Variables
   - Ensure `VITE_API_URL` matches your Render URL exactly

4. Redeploy both services:
   - Render: Click "Manual Deploy"
   - Vercel: Click "Redeploy"

### Issue: "Backend service sleeping" or timeout

**Symptoms**:
- First request works, then times out
- Requests fail after 15 minutes of inactivity

**Solution**:
- Upgrade Render to Starter plan ($7/month)
- Free tier sleeps after 15 minutes
- Starter tier runs 24/7

### Issue: "Build fails on Vercel"

**Symptoms**:
- Deployment fails with build error
- Error message in logs

**Solutions**:
1. Check build logs for specific error
2. Try building locally:
   ```bash
   npm run build
   ```
3. If local build works, try Vercel again
4. Clear Vercel cache and redeploy

### Issue: "Build fails on Render"

**Symptoms**:
- Deployment fails with npm install error
- Error message in logs

**Solutions**:
1. Check logs for specific error
2. Verify `package.json` is valid
3. Try locally:
   ```bash
   npm install
   ```
4. If local works, try Render again

### Issue: "Login not working"

**Symptoms**:
- Login page loads
- Submit button doesn't work
- No error message

**Solutions**:
1. Check browser console for errors
2. Check Network tab - see if POST request is sent
3. Check backend logs for errors
4. Verify test credentials are correct:
   ```
   Email: superadmin@restrohub.local
   Password: super123
   ```

### Issue: "Images not loading"

**Symptoms**:
- Images show broken icon
- Console shows 404 errors

**Solutions**:
1. Check if images are in `public/` folder
2. Verify image paths in code
3. Check Network tab for image URLs
4. Ensure images are committed to git

---

## SECURITY CONSIDERATIONS

### Before Going Live

- [ ] Change `SUPERADMIN_PASSWORD` from `super123` to a strong password
- [ ] Change `JWT_SECRET` to a random secure string (use: `openssl rand -base64 32`)
- [ ] Enable HTTPS (automatic on Vercel and Render)
- [ ] Set up rate limiting on backend
- [ ] Add input validation on all endpoints
- [ ] Add authentication checks on all endpoints
- [ ] Remove console.log statements from production code
- [ ] Enable error logging and monitoring
- [ ] Set up backup strategy for data
- [ ] Review CORS configuration

### Environment Variables Security

**Never commit**:
- `.env` files
- Passwords
- API keys
- JWT secrets
- Database URLs

**Always use**:
- `.env.example` for documentation
- Platform-specific environment variable settings
- Secure random strings for secrets

### CORS Configuration

**Current**:
```javascript
cors({
  origin: FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
})
```

**For production**:
- Ensure `FRONTEND_URL` is set correctly
- Only allow necessary HTTP methods
- Only allow necessary headers
- Consider rate limiting

---

## DEPLOYMENT SUMMARY

| Component | Platform | URL | Status |
|-----------|----------|-----|--------|
| Frontend | Vercel | https://restrohub.vercel.app | ✅ |
| Backend | Render | https://restrohub-backend.onrender.com | ✅ |
| Database | Neon PostgreSQL | postgresql://... | ⏳ (Phase 3) |

---

## NEXT STEPS

1. ✅ Read this guide
2. ✅ Complete pre-deployment checklist
3. ✅ Deploy backend on Render
4. ✅ Deploy frontend on Vercel
5. ✅ Run post-deployment tests
6. ✅ Monitor logs for errors
7. ⏳ Phase 3: Add backend permission checks
8. ⏳ Phase 4: Add advanced frontend features
9. ⏳ Migrate to PostgreSQL (optional)
10. ⏳ Set up custom domain (optional)

---

## QUICK REFERENCE

### Deployment Commands

```bash
# Local testing
npm run dev          # Frontend on port 8080
npm run backend      # Backend on port 5000

# Build for production
npm run build        # Creates dist/ folder

# Test production build locally
npm run preview      # Preview production build
```

### Important URLs

```
Frontend: https://restrohub.vercel.app
Backend: https://restrohub-backend.onrender.com
GitHub: https://github.com/Sujalpatne05/hotel
Render Dashboard: https://render.com/dashboard
Vercel Dashboard: https://vercel.com/dashboard
```

### Test Credentials

```
SuperAdmin:
  Email: superadmin@restrohub.local
  Password: super123

Admin:
  Email: admin@example.com
  Password: admin123
```

---

## SUPPORT & RESOURCES

### Documentation
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Vite Docs: https://vitejs.dev
- React Docs: https://react.dev

### Troubleshooting
- Check platform status pages
- Review error logs carefully
- Search documentation
- Contact platform support

---

## FINAL CHECKLIST

- [ ] Pre-deployment checklist completed
- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] Post-deployment tests passed
- [ ] Login works with test credentials
- [ ] API calls reach backend
- [ ] No console errors
- [ ] Mobile responsive works
- [ ] PWA features working
- [ ] Monitoring set up
- [ ] Security review completed
- [ ] Ready for production use

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Notes**: _______________

