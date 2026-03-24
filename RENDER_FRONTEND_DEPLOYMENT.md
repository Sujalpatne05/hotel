# Deploy Frontend on Render

## Step 1: Go to Render
https://render.com/dashboard

## Step 2: Create Static Site
- Click **"New +"**
- Select **"Static Site"**
- Connect GitHub
- Select `Sujalpatne05/hotel`
- Branch: `main`

## Step 3: Configure
```
Name:              restro-hub
Build Command:     npm run build
Publish Directory: dist
```

## Step 4: Add Environment Variable
Click **"Advanced"** and add:
```
VITE_API_URL=https://hotel-vpuj.onrender.com
```

## Step 5: Deploy
Click **"Create Static Site"**
Wait 2-3 minutes

## Step 6: Get Frontend URL
Once deployed:
```
https://restro-hub.onrender.com
```

## Step 7: Update Backend CORS
Go to Render Backend Service:
- Settings → Environment
- Update `FRONTEND_URL=https://restro-hub.onrender.com`
- Click Save (auto-redeploys)

## Done!
```
Frontend: https://restro-hub.onrender.com
Backend:  https://hotel-vpuj.onrender.com
```

