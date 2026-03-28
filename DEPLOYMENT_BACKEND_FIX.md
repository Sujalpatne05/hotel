# Deployment Backend Connection Fix

## 🚨 PROBLEM
Deployed app shows "Unable to connect to server" because:
1. Frontend is trying to connect to `/api` 
2. Backend is not deployed or URL is not configured
3. Environment variable `VITE_API_URL` is not set in deployment

---

## ✅ SOLUTION

### Option 1: Deploy Backend First (Recommended)

#### Step 1: Deploy Backend to Render/Railway/Heroku

**For Render.com:**
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Configure:
   - **Name:** `restrohub-backend`
   - **Root Directory:** Leave empty
   - **Build Command:** `npm install`
   - **Start Command:** `node server/mock-backend.mjs`
   - **Environment:** Node
5. Add Environment Variables:
   - `PORT` = `5000`
   - `JWT_SECRET` = `your_jwt_secret_here`
6. Click "Create Web Service"
7. Wait for deployment
8. Copy the backend URL (e.g., `https://restrohub-backend.onrender.com`)

#### Step 2: Update Frontend Environment Variable

**For Vercel:**
1. Go to your Vercel project
2. Settings → Environment Variables
3. Add new variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://restrohub-backend.onrender.com`
   - **Environment:** Production, Preview, Development
4. Click "Save"
5. Redeploy: Deployments → Latest → "Redeploy"

**For Netlify:**
1. Go to your Netlify site
2. Site settings → Environment variables
3. Add new variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://restrohub-backend.onrender.com`
4. Click "Save"
5. Trigger new deploy

---

### Option 2: Quick Fix - Use Mock Data (Temporary)

If you just want to test the frontend without backend:

1. Update `src/pages/LoginFixed.tsx`:
```typescript
const API_BASE_URL = "/api";
```

Change to:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";
```

2. Add `.env.production` file:
```
VITE_API_URL=https://your-backend-url.com
```

---

## 🔧 CURRENT ISSUE IN CODE

### Problem File: `src/pages/LoginFixed.tsx`
```typescript
// Line 6 - HARDCODED!
const API_BASE_URL = "/api";
```

This should be:
```typescript
const API_BASE_URL = (() => {
  const configured = (import.meta.env.VITE_API_URL || "").trim();
  if (typeof window !== "undefined" && window.location.protocol === "https:" && configured.startsWith("http://")) {
    return "/api";
  }
  return configured || (typeof window !== "undefined" && window.location.hostname !== "localhost" ? "/api" : "http://localhost:5000");
})();
```

---

## 📝 DEPLOYMENT CHECKLIST

### Backend Deployment
- [ ] Deploy backend to Render/Railway/Heroku
- [ ] Set environment variables (PORT, JWT_SECRET)
- [ ] Test backend URL (should return data)
- [ ] Copy backend URL

### Frontend Deployment
- [ ] Set `VITE_API_URL` environment variable
- [ ] Value should be backend URL (e.g., `https://backend.onrender.com`)
- [ ] Redeploy frontend
- [ ] Test login page

### Verification
- [ ] Open deployed frontend URL
- [ ] Check browser console for errors
- [ ] Try to login
- [ ] Should connect to backend successfully

---

## 🎯 RECOMMENDED DEPLOYMENT SETUP

### Architecture:
```
Frontend (Vercel/Netlify)
    ↓
Backend (Render/Railway)
    ↓
Database (Neon PostgreSQL) - Already configured!
```

### URLs:
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
- Database: Already in `.env` file

---

## 🚀 QUICK FIX FOR NOW

### Fix LoginFixed.tsx:
```bash
# Update the hardcoded API_BASE_URL
```

Then commit and push:
```bash
git add src/pages/LoginFixed.tsx
git commit -m "Fix: Use environment variable for API URL"
git push
```

This will trigger auto-redeploy on Vercel/Netlify.

---

## 📞 BACKEND DEPLOYMENT COMMANDS

### For Render (Web Service):
```
Build Command: npm install
Start Command: node server/mock-backend.mjs
```

### For Railway:
```
Build Command: npm install
Start Command: node server/mock-backend.mjs
```

### For Heroku:
```
Procfile content:
web: node server/mock-backend.mjs
```

---

## ⚠️ IMPORTANT NOTES

1. **CORS**: Backend must allow frontend domain
2. **Environment Variables**: Must be set in deployment platform
3. **Build**: Frontend must be rebuilt after env var changes
4. **Testing**: Always test after deployment

---

## 🔍 DEBUGGING

### Check if backend is running:
```bash
curl https://your-backend-url.com/health
```

### Check frontend API calls:
1. Open browser DevTools
2. Network tab
3. Try to login
4. Check request URL - should point to backend

### Common Errors:
- **404**: Backend not deployed or wrong URL
- **CORS**: Backend not allowing frontend domain
- **500**: Backend error - check backend logs

---

Generated: 2026-03-28
