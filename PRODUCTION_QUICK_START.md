# Production Deployment - Quick Start (30 minutes)

## Recommended Stack
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: MongoDB Atlas
- **Domain**: Optional (use provided URLs initially)

---

## STEP 1: Deploy Frontend to Vercel (5 minutes)

### 1.1 Sign up
- Go to https://vercel.com
- Click "Sign Up"
- Choose "Continue with GitHub"
- Authorize Vercel

### 1.2 Import Project
- Click "New Project"
- Select your GitHub repo (hotel)
- Click "Import"

### 1.3 Configure
- Framework: Vite (auto-detected)
- Build Command: `npm run build`
- Output Directory: `dist`
- Click "Deploy"

### 1.4 Wait for Deployment
- Takes 2-3 minutes
- You'll get a URL like: `https://restrohub-xyz.vercel.app`
- **Save this URL**

---

## STEP 2: Deploy Backend to Render (5 minutes)

### 2.1 Sign up
- Go to https://render.com
- Click "Sign Up"
- Choose "Continue with GitHub"
- Authorize Render

### 2.2 Create Web Service
- Click "New +"
- Select "Web Service"
- Select your GitHub repo
- Click "Connect"

### 2.3 Configure Service
- **Name**: `restrohub-backend`
- **Environment**: Node
- **Build Command**: `npm install`
- **Start Command**: `node server/mock-backend.mjs`
- **Plan**: Free
- Click "Create Web Service"

### 2.4 Wait for Deployment
- Takes 3-5 minutes
- You'll get a URL like: `https://restrohub-backend-xyz.onrender.com`
- **Save this URL**

---

## STEP 3: Connect Frontend to Backend (2 minutes)

### 3.1 Update Frontend Environment
- Go to Vercel dashboard
- Select your project
- Go to Settings → Environment Variables
- Add new variable:
  - **Name**: `VITE_API_URL`
  - **Value**: `https://restrohub-backend-xyz.onrender.com`
  - Click "Save"

### 3.2 Redeploy Frontend
- Go to Deployments
- Click the latest deployment
- Click "Redeploy"
- Wait 1-2 minutes

---

## STEP 4: Update Backend CORS (2 minutes)

### 4.1 Edit Backend Code
- Open `server/mock-backend.mjs`
- Find the CORS section (around line 20-30)
- Update to include your Vercel URL:

```javascript
const corsOptions = {
  origin: [
    'https://restrohub-xyz.vercel.app',  // Your Vercel URL
    'http://localhost:3000',
    'http://localhost:8080'
  ],
  credentials: true
};
```

### 4.2 Commit and Push
```bash
git add server/mock-backend.mjs
git commit -m "Update CORS for production"
git push origin main
```

### 4.3 Wait for Auto-Deploy
- Render auto-deploys on push
- Takes 2-3 minutes

---

## STEP 5: Test Production (5 minutes)

### 5.1 Test Frontend
- Open your Vercel URL: `https://restrohub-xyz.vercel.app`
- Should load without errors

### 5.2 Test Login
- Use admin credentials:
  - Email: `admin@demo.com`
  - Password: `admin123`
- Should login successfully

### 5.3 Test API Connection
- Create a new restaurant
- Add menu items
- Create an order
- Check if data persists

### 5.4 Check Backend Health
- Open: `https://restrohub-backend-xyz.onrender.com/health`
- Should return: `{"status":"ok"}`

---

## STEP 6: Optional - Add Custom Domain (10 minutes)

### 6.1 Buy Domain
- Go to https://namecheap.com or https://domains.google.com
- Buy your domain (e.g., `restrohub.com`)
- **Cost**: $10-15/year

### 6.2 Connect to Vercel
- Vercel Dashboard → Settings → Domains
- Add your domain
- Follow DNS instructions
- Takes 24-48 hours to propagate

### 6.3 Connect to Render
- Render Dashboard → Settings → Custom Domain
- Add subdomain (e.g., `api.restrohub.com`)
- Follow DNS instructions

---

## STEP 7: Set Up Database (Optional but Recommended)

### 7.1 Sign up to MongoDB Atlas
- Go to https://www.mongodb.com/cloud/atlas
- Click "Try Free"
- Create account

### 7.2 Create Cluster
- Click "Create a Deployment"
- Choose "Free" tier
- Select region closest to you
- Click "Create Deployment"

### 7.3 Get Connection String
- Click "Connect"
- Choose "Drivers"
- Copy connection string
- Replace `<password>` with your password

### 7.4 Add to Render
- Render Dashboard → Environment
- Add variable:
  - **Name**: `DATABASE_URL`
  - **Value**: Your MongoDB connection string
- Redeploy backend

---

## PRODUCTION URLS

After deployment, you'll have:

```
Frontend: https://restrohub-xyz.vercel.app
Backend:  https://restrohub-backend-xyz.onrender.com
API:      https://restrohub-backend-xyz.onrender.com/api
```

---

## IMPORTANT NOTES

### Free Tier Limitations
- **Vercel**: 100GB bandwidth/month (usually enough)
- **Render**: Spins down after 15 min inactivity (cold start ~30s)
- **MongoDB**: 512MB storage (enough for testing)

### To Avoid Cold Starts
- Upgrade Render to Starter ($7/month)
- Or use Render's "Keep Alive" feature

### Data Persistence
- Currently using file-based storage (`server/data/`)
- **Not recommended for production**
- Switch to MongoDB Atlas (recommended)

### Backups
- Set up MongoDB Atlas automated backups
- Or use Render's backup features

---

## TROUBLESHOOTING

### Frontend shows "Cannot connect to API"
1. Check `VITE_API_URL` is set correctly in Vercel
2. Verify backend is running (check Render logs)
3. Check CORS is configured correctly
4. Clear browser cache and reload

### Backend deployment fails
1. Check build logs in Render
2. Verify `package.json` has all dependencies
3. Check `server/mock-backend.mjs` syntax
4. Verify environment variables are set

### Login not working
1. Check backend is running
2. Verify database connection (if using MongoDB)
3. Check user data exists in database
4. Review backend logs for errors

### Slow performance
1. Upgrade from free tier
2. Enable caching in Vercel
3. Optimize database queries
4. Use CDN for static assets

---

## NEXT STEPS

1. ✅ Deploy frontend to Vercel
2. ✅ Deploy backend to Render
3. ✅ Connect frontend to backend
4. ✅ Test all features
5. ⏭️ Set up custom domain (optional)
6. ⏭️ Set up MongoDB database (recommended)
7. ⏭️ Configure monitoring and alerts
8. ⏭️ Set up automated backups

---

## SUPPORT

- Vercel Support: https://vercel.com/support
- Render Support: https://render.com/support
- MongoDB Support: https://www.mongodb.com/support

