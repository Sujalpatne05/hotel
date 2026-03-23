# RestroHub Deployment Guide - Vercel & Render

## Overview
- **Frontend**: Deploy on Vercel (React + Vite)
- **Backend**: Deploy on Render (Node.js + Express)
- **Database**: In-memory (mock backend) - can be upgraded to MongoDB/PostgreSQL

---

## PART 1: DEPLOY BACKEND ON RENDER

### Step 1: Prepare Backend for Deployment

1. **Update `server/mock-backend.mjs`** to use environment variables:

```javascript
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Add CORS configuration
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
```

2. **Create `.env` file** (don't commit this):
```
PORT=5000
FRONTEND_URL=http://localhost:8080
NODE_ENV=development
```

3. **Update `package.json`** - ensure it has:
```json
{
  "name": "restrohub-backend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server/mock-backend.mjs",
    "dev": "node server/mock-backend.mjs"
  },
  "engines": {
    "node": "18.x"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2"
  }
}
```

### Step 2: Create Render Account & Deploy

1. **Go to [render.com](https://render.com)** and sign up
2. **Click "New +"** → Select **"Web Service"**
3. **Connect GitHub Repository**:
   - Click "Connect account" and authorize GitHub
   - Select your `Sujalpatne05/hotel` repository
   - Select branch: `main`

4. **Configure Web Service**:
   - **Name**: `restrohub-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free` (or Starter for production)

5. **Add Environment Variables**:
   - Click "Environment"
   - Add:
     ```
     PORT=5000
     FRONTEND_URL=https://your-vercel-domain.vercel.app
     NODE_ENV=production
     ```

6. **Click "Create Web Service"**
   - Wait for deployment (2-3 minutes)
   - You'll get a URL like: `https://restrohub-backend.onrender.com`

### Step 3: Test Backend Deployment

```bash
# Test if backend is running
curl https://restrohub-backend.onrender.com/auth/login

# Should return: {"message":"Login endpoint"}
```

---

## PART 2: DEPLOY FRONTEND ON VERCEL

### Step 1: Prepare Frontend for Deployment

1. **Update `src/lib/api.ts`** to use environment variables:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

2. **Create `.env.production`** file:
```
VITE_API_URL=https://restrohub-backend.onrender.com
```

3. **Update `vite.config.ts`** (if needed):
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
```

4. **Ensure `package.json` has build script**:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Step 2: Create Vercel Account & Deploy

1. **Go to [vercel.com](https://vercel.com)** and sign up
2. **Click "Add New..."** → Select **"Project"**
3. **Import Git Repository**:
   - Click "Import Git Repository"
   - Paste: `https://github.com/Sujalpatne05/hotel`
   - Click "Import"

4. **Configure Project**:
   - **Project Name**: `restrohub`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://restrohub-backend.onrender.com
     ```

6. **Click "Deploy"**
   - Wait for deployment (2-3 minutes)
   - You'll get a URL like: `https://restrohub.vercel.app`

### Step 3: Update Backend CORS

1. **Go back to Render dashboard**
2. **Edit your backend service**
3. **Update Environment Variable**:
   ```
   FRONTEND_URL=https://restrohub.vercel.app
   ```
4. **Click "Save"** - backend will redeploy automatically

---

## PART 3: VERIFICATION & TESTING

### Test Frontend
```bash
# Visit your Vercel URL
https://restrohub.vercel.app

# Try logging in with:
# Email: admin@example.com
# Password: admin123
```

### Test Backend Connection
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try any action in the app
4. Check if API calls go to `https://restrohub-backend.onrender.com`

### Common Issues & Fixes

**Issue**: "CORS error" or "Cannot reach backend"
- **Fix**: Verify `FRONTEND_URL` in Render environment variables matches your Vercel URL

**Issue**: "API calls timeout"
- **Fix**: Render free tier may sleep after 15 minutes. Upgrade to Starter plan or use a monitoring service

**Issue**: "Build fails on Vercel"
- **Fix**: Check build logs, ensure all dependencies are in `package.json`

---

## PART 4: PRODUCTION CHECKLIST

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured on both platforms
- [ ] CORS properly configured
- [ ] Login works with test credentials
- [ ] API calls reach backend successfully
- [ ] Images upload and display correctly
- [ ] All pages load without errors
- [ ] Mobile responsive design works
- [ ] SSL certificates active (automatic on both platforms)

---

## PART 5: MONITORING & MAINTENANCE

### Render Dashboard
- Monitor logs: Dashboard → Your Service → Logs
- Check metrics: Dashboard → Your Service → Metrics
- Restart service if needed: Dashboard → Your Service → Manual Deploy

### Vercel Dashboard
- Monitor deployments: Dashboard → Your Project → Deployments
- Check analytics: Dashboard → Your Project → Analytics
- View logs: Click on deployment → Logs

---

## PART 6: UPGRADE TO PAID PLANS (Optional)

### Render Starter Plan ($7/month)
- Prevents free tier sleep
- Better performance
- Recommended for production

### Vercel Pro ($20/month)
- Unlimited deployments
- Priority support
- Advanced analytics

---

## PART 7: CUSTOM DOMAIN (Optional)

### Add Custom Domain to Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `restrohub.com`)
3. Update DNS records as instructed

### Add Custom Domain to Render
1. Go to Render Dashboard → Your Service → Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed

---

## QUICK REFERENCE

| Component | Platform | URL | Status |
|-----------|----------|-----|--------|
| Frontend | Vercel | https://restrohub.vercel.app | ✅ |
| Backend | Render | https://restrohub-backend.onrender.com | ✅ |
| Database | In-Memory | N/A | ✅ |

---

## NEXT STEPS

1. Deploy backend on Render first
2. Deploy frontend on Vercel
3. Update environment variables
4. Test all features
5. Monitor logs for errors
6. Upgrade to paid plans if needed

