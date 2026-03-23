# Deployment Checklist - Vercel & Render

## PRE-DEPLOYMENT (Do This First)

### Code Preparation
- [ ] All changes committed to GitHub
- [ ] No uncommitted changes in working directory
- [ ] Latest code pushed to `main` branch
- [ ] Run `npm run build` locally - should succeed
- [ ] No console errors in development

### Backend Preparation
- [ ] `server/mock-backend.mjs` uses `process.env.PORT`
- [ ] `server/mock-backend.mjs` uses `process.env.FRONTEND_URL` for CORS
- [ ] `package.json` has `"start": "node server/mock-backend.mjs"`
- [ ] `package.json` has `"engines": { "node": "18.x" }`

### Frontend Preparation
- [ ] `src/lib/api.ts` uses `import.meta.env.VITE_API_URL`
- [ ] `package.json` has `"build": "vite build"`
- [ ] `vite.config.ts` configured correctly
- [ ] No hardcoded `localhost:5000` URLs in code

---

## RENDER DEPLOYMENT (Backend)

### Account Setup
- [ ] Create account at https://render.com
- [ ] Connect GitHub account
- [ ] Authorize access to `Sujalpatne05/hotel` repository

### Create Web Service
- [ ] Click "New +" → "Web Service"
- [ ] Select `Sujalpatne05/hotel` repository
- [ ] Select branch: `main`
- [ ] Service name: `restrohub-backend`
- [ ] Environment: `Node`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Instance Type: `Free` (or Starter for production)

### Environment Variables
- [ ] Add `PORT=5000`
- [ ] Add `FRONTEND_URL=https://restrohub.vercel.app` (update after Vercel deployment)
- [ ] Add `NODE_ENV=production`

### Deployment
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Check deployment logs for errors
- [ ] Copy backend URL (e.g., `https://restrohub-backend.onrender.com`)
- [ ] Test backend: `curl https://restrohub-backend.onrender.com/auth/login`

---

## VERCEL DEPLOYMENT (Frontend)

### Account Setup
- [ ] Create account at https://vercel.com
- [ ] Connect GitHub account
- [ ] Authorize access to `Sujalpatne05/hotel` repository

### Create Project
- [ ] Click "Add New" → "Project"
- [ ] Select `Sujalpatne05/hotel` repository
- [ ] Project name: `restrohub`
- [ ] Framework Preset: `Vite`
- [ ] Root Directory: `./`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`

### Environment Variables
- [ ] Add `VITE_API_URL=https://restrohub-backend.onrender.com`
  (Use the URL from Render deployment)

### Deployment
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-3 minutes)
- [ ] Check deployment logs for errors
- [ ] Copy frontend URL (e.g., `https://restrohub.vercel.app`)
- [ ] Visit URL and verify page loads

---

## POST-DEPLOYMENT VERIFICATION

### Backend Testing
- [ ] Backend URL is accessible
- [ ] CORS headers are correct
- [ ] Test login endpoint: `curl -X POST https://restrohub-backend.onrender.com/auth/login`
- [ ] Check logs for errors

### Frontend Testing
- [ ] Frontend URL is accessible
- [ ] Page loads without errors
- [ ] Open DevTools (F12) → Console tab
- [ ] No red errors in console
- [ ] No CORS errors

### Integration Testing
- [ ] Open DevTools → Network tab
- [ ] Try logging in with:
  - Email: `admin@example.com`
  - Password: `admin123`
- [ ] Verify API calls go to Render backend URL
- [ ] Login should succeed
- [ ] Dashboard should load

### Feature Testing
- [ ] Dashboard loads
- [ ] Billing page loads
- [ ] Kitchen Display loads
- [ ] Orders page loads
- [ ] Menu Management loads
- [ ] Table Management loads
- [ ] Payments Overview loads
- [ ] All menu items are clickable
- [ ] Images display correctly
- [ ] No 404 errors in Network tab

---

## TROUBLESHOOTING

### Backend Issues

**Problem**: Deployment fails on Render
- [ ] Check build logs for errors
- [ ] Verify `package.json` has all dependencies
- [ ] Ensure `server/mock-backend.mjs` exists
- [ ] Check Node version (should be 18.x)

**Problem**: Backend URL returns 404
- [ ] Verify service is running (check Render dashboard)
- [ ] Check logs for startup errors
- [ ] Restart service: Dashboard → Service → Manual Deploy

**Problem**: CORS errors in browser
- [ ] Verify `FRONTEND_URL` in Render environment variables
- [ ] Ensure it matches your Vercel URL exactly
- [ ] Redeploy backend after updating environment variables

### Frontend Issues

**Problem**: Build fails on Vercel
- [ ] Check build logs for errors
- [ ] Verify all imports are correct
- [ ] Ensure `vite.config.ts` is valid
- [ ] Check for TypeScript errors: `npm run build` locally

**Problem**: "Cannot reach backend" error
- [ ] Check `VITE_API_URL` environment variable
- [ ] Verify it matches your Render backend URL
- [ ] Redeploy frontend after updating environment variables
- [ ] Check Network tab in DevTools for actual error

**Problem**: Blank page or 404
- [ ] Check browser console for errors
- [ ] Verify build output directory is `dist`
- [ ] Check Vercel deployment logs
- [ ] Try clearing browser cache (Ctrl+Shift+Delete)

### API Connection Issues

**Problem**: API calls timeout
- [ ] Render free tier sleeps after 15 minutes of inactivity
- [ ] Upgrade to Starter plan ($7/month)
- [ ] Or use a monitoring service to keep it awake

**Problem**: Login fails with "Invalid credentials"
- [ ] Check Network tab → see actual error response
- [ ] Verify backend is running
- [ ] Check backend logs for errors
- [ ] Try test credentials: `admin@example.com` / `admin123`

---

## MONITORING & MAINTENANCE

### Daily Checks
- [ ] Visit frontend URL and verify it loads
- [ ] Try logging in
- [ ] Check for any error messages

### Weekly Checks
- [ ] Review Render logs for errors
- [ ] Review Vercel deployment logs
- [ ] Check backend performance metrics
- [ ] Monitor API response times

### Monthly Checks
- [ ] Review analytics on both platforms
- [ ] Check for security updates
- [ ] Update dependencies if needed
- [ ] Review error logs and fix issues

---

## UPGRADE TO PRODUCTION (Optional)

### Render Starter Plan ($7/month)
- [ ] Go to Render Dashboard → Your Service → Settings
- [ ] Click "Change Plan"
- [ ] Select "Starter"
- [ ] Confirm upgrade

### Vercel Pro ($20/month)
- [ ] Go to Vercel Dashboard → Settings → Billing
- [ ] Click "Upgrade to Pro"
- [ ] Add payment method
- [ ] Confirm upgrade

---

## CUSTOM DOMAIN (Optional)

### Add Domain to Vercel
- [ ] Go to Vercel Dashboard → Your Project → Settings → Domains
- [ ] Add your domain (e.g., `restrohub.com`)
- [ ] Update DNS records as instructed
- [ ] Wait for DNS propagation (up to 48 hours)

### Add Domain to Render
- [ ] Go to Render Dashboard → Your Service → Settings → Custom Domain
- [ ] Add your domain
- [ ] Update DNS records as instructed
- [ ] Wait for DNS propagation

---

## FINAL CHECKLIST

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured correctly
- [ ] CORS working properly
- [ ] Login works with test credentials
- [ ] All pages load without errors
- [ ] API calls reach backend successfully
- [ ] Images upload and display correctly
- [ ] Mobile responsive design works
- [ ] SSL certificates active (automatic)
- [ ] Monitoring set up
- [ ] Team notified of deployment URLs

---

## DEPLOYMENT URLS

```
Frontend: https://restrohub.vercel.app
Backend:  https://restrohub-backend.onrender.com
```

Share these with your team!

