# Quick Deployment Fix - Backend Already on Render

## ✅ SOLUTION (3 Steps)

### Step 1: Get Your Render Backend URL
1. Go to https://dashboard.render.com
2. Find your backend service
3. Copy the URL (e.g., `https://restrohub-backend.onrender.com`)

---

### Step 2: Set Environment Variable in Vercel/Netlify

#### For Vercel:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Fill in:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend.onrender.com` (paste your Render URL)
   - **Environments:** Check all (Production, Preview, Development)
6. Click **Save**

#### For Netlify:
1. Go to https://app.netlify.com
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Fill in:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend.onrender.com` (paste your Render URL)
6. Click **Create variable**

---

### Step 3: Commit Code Fix & Redeploy

#### A. Commit the LoginFixed.tsx fix:
```bash
git add src/pages/LoginFixed.tsx
git commit -m "Fix: Use environment variable for API URL"
git push
```

#### B. Trigger Redeploy:

**Vercel:**
- Push will auto-trigger deployment
- Or go to Deployments → Click "Redeploy"

**Netlify:**
- Push will auto-trigger deployment  
- Or go to Deploys → Click "Trigger deploy"

---

## 🔍 VERIFY IT WORKS

### 1. Check Render Backend is Running:
Open in browser: `https://your-backend.onrender.com/health`

Should see something or at least not 404.

### 2. Check Frontend After Redeploy:
1. Open your deployed frontend URL
2. Open Browser DevTools (F12)
3. Go to Console tab
4. Try to login
5. Check Network tab - requests should go to your Render URL

---

## ⚠️ COMMON ISSUES

### Issue 1: Still showing "Unable to connect"
**Solution:** Clear browser cache or try incognito mode

### Issue 2: CORS Error
**Solution:** Backend needs to allow your frontend domain

Add to `server/mock-backend.mjs` (around line 176):
```javascript
"Access-Control-Allow-Origin": "*",
```

Then redeploy backend on Render.

### Issue 3: 404 on backend
**Solution:** Check Render logs:
1. Go to Render dashboard
2. Click your service
3. Check "Logs" tab
4. Look for errors

---

## 📋 CHECKLIST

- [ ] Get Render backend URL
- [ ] Add `VITE_API_URL` to Vercel/Netlify
- [ ] Commit and push LoginFixed.tsx fix
- [ ] Wait for deployment to complete
- [ ] Test login on deployed site
- [ ] Check browser console for errors

---

## 🎯 EXAMPLE

If your Render backend URL is:
```
https://restrohub-api.onrender.com
```

Then set in Vercel/Netlify:
```
VITE_API_URL=https://restrohub-api.onrender.com
```

After redeploy, frontend will connect to:
```
https://restrohub-api.onrender.com/auth/login
```

---

## 🚀 AFTER FIX

Your app will work like this:
```
User → Frontend (Vercel/Netlify)
         ↓
      Backend (Render)
         ↓
      Database (Neon)
```

All connections will work!

---

Generated: 2026-03-28
