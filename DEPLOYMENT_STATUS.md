# Deployment Status

## ✅ Backend Deployed on Render

```
Backend URL: https://hotel-vpuj.onrender.com
```

## Next: Deploy Frontend on Vercel

### Step 1: Go to Vercel
https://vercel.com/dashboard

### Step 2: Create Project
- Click "Add New" → "Project"
- Select `Sujalpatne05/hotel` repository
- Click "Import"

### Step 3: Configure
- Framework: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

### Step 4: Add Environment Variable
Click "Environment Variables" and add:
```
VITE_API_URL=https://hotel-vpuj.onrender.com
```

### Step 5: Deploy
Click "Deploy" and wait 2-3 minutes

### Step 6: Get Frontend URL
Once deployed, you'll get a URL like:
```
https://restrohub.vercel.app
```

## Step 7: Update Backend CORS

Go back to Render and update:
```
FRONTEND_URL=<your-vercel-url>
```

Then redeploy backend.

## Final URLs

```
Frontend: https://restrohub.vercel.app
Backend:  https://hotel-vpuj.onrender.com
```

