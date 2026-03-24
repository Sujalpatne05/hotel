# Deploy Frontend on Netlify - Complete Guide

## Step 1: Create Netlify Account

1. Go to https://netlify.com
2. Click "Sign up"
3. Choose "Sign up with GitHub"
4. Authorize Netlify to access your GitHub

## Step 2: Create New Site

1. Click "Add new site"
2. Select "Import an existing project"
3. Click "GitHub"
4. Authorize GitHub connection

## Step 3: Select Repository

1. Search for: `hotel`
2. Click on `Sujalpatne05/hotel`
3. Select branch: `main`

## Step 4: Configure Build Settings

Netlify will auto-detect settings. Verify:

```
Build Command:     npm run build
Publish Directory: dist
```

If not auto-detected, enter manually.

## Step 5: Add Environment Variables

1. Click "Advanced"
2. Click "New variable"
3. Add:
   ```
   Key:   VITE_API_URL
   Value: https://hotel-vpuj.onrender.com
   ```
4. Click "Deploy site"

## Step 6: Wait for Deployment

- Netlify will build and deploy
- Takes 2-3 minutes
- You'll see a URL like: `https://restro-hub-xyz.netlify.app`

## Step 7: Get Your Frontend URL

Once deployed, you'll have:
```
Frontend: https://restro-hub-xyz.netlify.app
```

(The exact URL will be shown in Netlify dashboard)

## Step 8: Update Backend CORS

Go to Render Backend:
1. Render Dashboard → `hotel-vpuj` service
2. Settings → Environment
3. Update: `FRONTEND_URL=<your-netlify-url>`
4. Click Save (auto-redeploys)

## Step 9: Test

1. Open your Netlify URL
2. Login with credentials
3. Try logout and login again
4. All routes should work! ✅

## Final URLs

```
Frontend: https://restro-hub-xyz.netlify.app
Backend:  https://hotel-vpuj.onrender.com
```

## Why Netlify?

✅ Automatic routing for React apps
✅ No 404 errors on logout
✅ Better performance
✅ Free tier available
✅ Easy GitHub integration

## Troubleshooting

**Build fails?**
- Check build logs in Netlify dashboard
- Ensure `npm run build` works locally

**API calls fail?**
- Verify `VITE_API_URL` environment variable
- Check backend is running

**Still getting 404?**
- Clear browser cache
- Hard refresh (Ctrl+Shift+R)

