# Production Deployment - Quick Start Guide

**Time to Deploy**: 30-45 minutes  
**Difficulty**: Easy  
**Prerequisites**: GitHub, Render, Vercel accounts

---

## STEP 1: Deploy Backend (5 minutes)

### 1.1 Go to Render
- Visit https://render.com
- Sign in with GitHub

### 1.2 Create Web Service
- Click "New +" → "Web Service"
- Select repository: `Sujalpatne05/hotel`
- Select branch: `main`

### 1.3 Configure
```
Name: restrohub-backend
Environment: Node
Build Command: npm install
Start Command: node server/mock-backend.mjs
Instance Type: Free (or Starter for production)
```

### 1.4 Add Environment Variables
```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://restrohub.vercel.app
JWT_SECRET=your_secure_random_string
SUPERADMIN_EMAIL=superadmin@restrohub.local
SUPERADMIN_PASSWORD=super123
```

### 1.5 Deploy
- Click "Create Web Service"
- Wait 2-3 minutes
- Note the URL: `https://restrohub-backend.onrender.com`

---

## STEP 2: Deploy Frontend (5 minutes)

### 2.1 Go to Vercel
- Visit https://vercel.com
- Sign in with GitHub

### 2.2 Import Project
- Click "Add New..." → "Project"
- Click "Import Git Repository"
- Paste: `https://github.com/Sujalpatne05/hotel`
- Click "Import"

### 2.3 Configure
```
Project Name: restrohub
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

### 2.4 Add Environment Variables
```
VITE_API_URL=https://restrohub-backend.onrender.com
VITE_APP_NAME=RestroHub
VITE_ENABLE_PWA=true
```

### 2.5 Deploy
- Click "Deploy"
- Wait 2-3 minutes
- Note the URL: `https://restrohub.vercel.app`

---

## STEP 3: Update Backend CORS (2 minutes)

### 3.1 Go to Render
- Visit https://render.com/dashboard
- Click on `restrohub-backend`

### 3.2 Update Environment Variable
- Click "Settings" → "Environment"
- Update `FRONTEND_URL`:
  ```
  FRONTEND_URL=https://restrohub.vercel.app
  ```
- Click "Save"
- Wait for redeploy (1-2 minutes)

---

## STEP 4: Test (5 minutes)

### 4.1 Test Frontend
```
Visit: https://restrohub.vercel.app
Should see: Login page
```

### 4.2 Test Login
```
Email: superadmin@restrohub.local
Password: super123
Should see: Dashboard
```

### 4.3 Test API Connection
```
Open DevTools (F12)
Go to Network tab
Try any action
Should see: API calls to https://restrohub-backend.onrender.com
```

### 4.4 Test Backend Directly
```bash
curl https://restrohub-backend.onrender.com/auth/login
Should return: {"message":"Login endpoint"}
```

---

## STEP 5: Verify Everything Works (5 minutes)

### 5.1 Create Restaurant
1. Login as SuperAdmin
2. Go to "Restaurants"
3. Click "Add Restaurant"
4. Fill form and submit
5. Should see success message

### 5.2 Create User
1. Go to "Users"
2. Click "Create User"
3. Fill form and submit
4. Should see user in list

### 5.3 Check Mobile
1. Open DevTools (F12)
2. Click device toggle
3. Test on mobile view
4. All features should work

---

## TROUBLESHOOTING

### "Cannot reach backend"
1. Check backend URL in Vercel environment variables
2. Check `FRONTEND_URL` in Render environment variables
3. Redeploy both services

### "Build fails"
1. Check build logs
2. Try building locally: `npm run build`
3. If local works, try Vercel again

### "Login doesn't work"
1. Check browser console for errors
2. Check Network tab for API calls
3. Verify test credentials are correct

### "Images not loading"
1. Check if images are in `public/` folder
2. Check Network tab for image URLs
3. Ensure images are committed to git

---

## IMPORTANT URLS

```
Frontend: https://restrohub.vercel.app
Backend: https://restrohub-backend.onrender.com
Render Dashboard: https://render.com/dashboard
Vercel Dashboard: https://vercel.com/dashboard
GitHub: https://github.com/Sujalpatne05/hotel
```

---

## TEST CREDENTIALS

```
SuperAdmin:
  Email: superadmin@restrohub.local
  Password: super123

Admin:
  Email: admin@example.com
  Password: admin123
```

---

## NEXT STEPS

1. ✅ Deploy backend on Render
2. ✅ Deploy frontend on Vercel
3. ✅ Test everything works
4. ⏳ Monitor logs for errors
5. ⏳ Phase 3: Add backend permission checks
6. ⏳ Phase 4: Add advanced frontend features

---

## MONITORING

### Check Backend Logs
1. Go to https://render.com/dashboard
2. Click on `restrohub-backend`
3. Click "Logs" tab
4. View real-time logs

### Check Frontend Logs
1. Go to https://vercel.com/dashboard
2. Click on `restrohub` project
3. Click on latest deployment
4. Click "Logs" tab

---

## QUICK REFERENCE

| Task | Time | Steps |
|------|------|-------|
| Deploy Backend | 5 min | Render → New → Web Service → Configure → Deploy |
| Deploy Frontend | 5 min | Vercel → Add Project → Configure → Deploy |
| Update CORS | 2 min | Render → Settings → Update FRONTEND_URL |
| Test | 5 min | Visit URLs → Login → Create Restaurant → Check Network |
| **Total** | **17 min** | **All steps above** |

---

## COMMON ISSUES & FIXES

| Issue | Fix |
|-------|-----|
| CORS error | Update `FRONTEND_URL` on Render |
| Backend timeout | Upgrade to Starter plan on Render |
| Build fails | Check build logs, try locally |
| Login fails | Check credentials, check console errors |
| Images missing | Ensure in `public/` folder, committed to git |

---

## AFTER DEPLOYMENT

- [ ] Monitor error logs daily
- [ ] Check performance metrics
- [ ] Respond to user feedback
- [ ] Plan Phase 3 implementation
- [ ] Set up automated backups
- [ ] Configure monitoring alerts

---

**Deployment Date**: _______________  
**Deployed By**: _______________  
**Status**: ✅ Live

