# Quick Deployment Steps - 5 Minutes

## STEP 1: Prepare Code (2 minutes)

### Update Backend Environment
Edit `server/mock-backend.mjs` - add at the top:

```javascript
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Update CORS
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
```

### Update Frontend Environment
Create file `src/lib/api-config.ts`:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
```

Then update your API calls to use this config.

### Commit Changes
```bash
git add -A
git commit -m "Prepare for production deployment"
git push origin main
```

---

## STEP 2: Deploy Backend on Render (2 minutes)

1. Go to **https://render.com**
2. Sign up with GitHub
3. Click **"New +"** → **"Web Service"**
4. Select your GitHub repo: `Sujalpatne05/hotel`
5. Fill in:
   - **Name**: `restrohub-backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click **"Advanced"** and add Environment Variables:
   ```
   PORT=5000
   FRONTEND_URL=https://restrohub.vercel.app
   NODE_ENV=production
   ```
7. Click **"Create Web Service"**
8. Wait 2-3 minutes for deployment
9. **Copy your backend URL** (e.g., `https://restrohub-backend.onrender.com`)

---

## STEP 3: Deploy Frontend on Vercel (1 minute)

1. Go to **https://vercel.com**
2. Sign up with GitHub
3. Click **"Add New"** → **"Project"**
4. Select your repo: `Sujalpatne05/hotel`
5. Fill in:
   - **Project Name**: `restrohub`
   - **Framework**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **"Environment Variables"** and add:
   ```
   VITE_API_URL=https://restrohub-backend.onrender.com
   ```
   (Replace with your actual Render backend URL)
7. Click **"Deploy"**
8. Wait 2-3 minutes
9. **Copy your frontend URL** (e.g., `https://restrohub.vercel.app`)

---

## STEP 4: Update Backend CORS (30 seconds)

1. Go back to **Render Dashboard**
2. Click on your `restrohub-backend` service
3. Go to **"Environment"**
4. Update `FRONTEND_URL` to your Vercel URL:
   ```
   FRONTEND_URL=https://restrohub.vercel.app
   ```
5. Click **"Save"** - backend will redeploy

---

## STEP 5: Test Everything (30 seconds)

1. Open your Vercel URL: `https://restrohub.vercel.app`
2. Try logging in:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Open DevTools (F12) → Network tab
4. Click any button and verify API calls go to your Render backend URL
5. ✅ If login works, you're done!

---

## TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| "Cannot reach backend" | Check CORS - update FRONTEND_URL in Render |
| "Build fails on Vercel" | Check build logs, ensure all dependencies in package.json |
| "API calls timeout" | Render free tier sleeps after 15 min - upgrade to Starter |
| "Login doesn't work" | Check Network tab - see actual error from backend |

---

## YOUR DEPLOYMENT URLS

Once deployed, you'll have:

```
Frontend: https://restrohub.vercel.app
Backend:  https://restrohub-backend.onrender.com
```

Share these URLs with your team!

