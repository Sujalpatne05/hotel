# Render Backend Deployment Guide

## Overview
Deploy the RestroHub backend on Render.com with proper build and start commands.

---

## STEP 1: Create Render Account

1. Go to https://render.com
2. Click "Sign up"
3. Sign up with GitHub (recommended)
4. Authorize access to your repositories

---

## STEP 2: Create Web Service on Render

### Option A: From Dashboard
1. Click **"New +"** button
2. Select **"Web Service"**
3. Click **"Connect account"** to authorize GitHub
4. Select your repository: `Sujalpatne05/hotel`
5. Select branch: `main`

### Option B: From GitHub
1. Go to your GitHub repo
2. Look for Render deployment option
3. Click to connect

---

## STEP 3: Configure Web Service

### Basic Settings

| Setting | Value |
|---------|-------|
| **Name** | `restrohub-backend` |
| **Environment** | `Node` |
| **Region** | `Oregon` (or closest to you) |
| **Branch** | `main` |
| **Root Directory** | `./` (leave empty) |

### Build Command
```bash
npm install
```

### Start Command
```bash
node server/mock-backend.mjs
```

### Instance Type
- **Free**: For testing (sleeps after 15 min inactivity)
- **Starter**: $7/month (recommended for production)

---

## STEP 4: Add Environment Variables

Click **"Advanced"** or **"Environment"** section and add:

```
PORT=5000
FRONTEND_URL=https://restrohub.vercel.app
NODE_ENV=production
```

**Important**: Update `FRONTEND_URL` after you deploy frontend on Vercel.

---

## STEP 5: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (2-3 minutes)
3. Check logs for any errors
4. Once deployed, you'll get a URL like:
   ```
   https://restrohub-backend.onrender.com
   ```

---

## STEP 6: Verify Deployment

### Test Backend is Running
```bash
curl https://restrohub-backend.onrender.com/auth/login
```

Expected response:
```json
{"message":"Login endpoint"}
```

### Test Login Endpoint
```bash
curl -X POST https://restrohub-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

Expected response:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## Build & Start Commands Explained

### Build Command: `npm install`
- Installs all dependencies from `package.json`
- Creates `node_modules` folder
- Runs on every deployment
- Takes 1-2 minutes

### Start Command: `node server/mock-backend.mjs`
- Starts the Express server
- Listens on port 5000
- Runs indefinitely
- Handles all API requests

### Why These Commands?
- **npm install**: Installs dependencies needed by the backend
- **node server/mock-backend.mjs**: Starts the backend server
- **No build step**: Backend is JavaScript, not compiled

---

## Environment Variables Explained

| Variable | Value | Purpose |
|----------|-------|---------|
| `PORT` | `5000` | Port the server listens on |
| `FRONTEND_URL` | `https://restrohub.vercel.app` | CORS origin (frontend URL) |
| `NODE_ENV` | `production` | Environment mode |

---

## Deployment Checklist

- [ ] GitHub account connected to Render
- [ ] Repository selected: `Sujalpatne05/hotel`
- [ ] Branch selected: `main`
- [ ] Name: `restrohub-backend`
- [ ] Environment: `Node`
- [ ] Build Command: `npm install`
- [ ] Start Command: `node server/mock-backend.mjs`
- [ ] Environment Variables added:
  - [ ] `PORT=5000`
  - [ ] `FRONTEND_URL=https://restrohub.vercel.app`
  - [ ] `NODE_ENV=production`
- [ ] Instance Type: `Free` or `Starter`
- [ ] Deployment started
- [ ] Logs show "Server running on http://localhost:5000"
- [ ] Backend URL obtained (e.g., `https://restrohub-backend.onrender.com`)

---

## Troubleshooting

### Issue: Build Fails
**Error**: `npm install exited with 1`

**Solution**:
1. Check logs for specific error
2. Ensure `package.json` is valid
3. Try locally: `npm install`
4. If local works, try Render again
5. Clear Render cache and redeploy

### Issue: Server Won't Start
**Error**: `node server/mock-backend.mjs exited with code 1`

**Solution**:
1. Check logs for error message
2. Verify `server/mock-backend.mjs` exists
3. Verify Node.js version (should be 18+)
4. Check for port conflicts
5. Verify environment variables are set

### Issue: Port Already in Use
**Error**: `listen EADDRINUSE: address already in use :::5000`

**Solution**:
1. Render automatically assigns port from `PORT` env var
2. Ensure `PORT=5000` is set
3. Restart service: Dashboard → Service → Manual Deploy

### Issue: CORS Errors
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Verify `FRONTEND_URL` is set correctly
2. Ensure it matches your Vercel URL exactly
3. Redeploy backend after updating `FRONTEND_URL`
4. Wait 1-2 minutes for changes to take effect

### Issue: Service Keeps Restarting
**Error**: Service crashes and restarts repeatedly

**Solution**:
1. Check logs for error messages
2. Verify all environment variables are set
3. Check for infinite loops in code
4. Verify `server/mock-backend.mjs` is valid
5. Try redeploying

### Issue: Deployment Takes Too Long
**Solution**:
1. Free tier is slower than Starter
2. Upgrade to Starter plan ($7/month)
3. Or wait for free tier deployment to complete

---

## Monitoring & Logs

### View Logs
1. Go to Render Dashboard
2. Click on your service: `restrohub-backend`
3. Click **"Logs"** tab
4. View real-time logs

### Check Metrics
1. Click on your service
2. Click **"Metrics"** tab
3. View CPU, Memory, Network usage

### Restart Service
1. Click on your service
2. Click **"Manual Deploy"** button
3. Service will restart

---

## Update Backend Code

### When You Make Changes
1. Commit changes locally:
   ```bash
   git add .
   git commit -m "Your message"
   ```

2. Push to GitHub:
   ```bash
   git push origin main
   ```

3. Render automatically detects changes and redeploys
4. Check logs to verify deployment succeeded

### Manual Redeploy
1. Go to Render Dashboard
2. Click on your service
3. Click **"Manual Deploy"** button
4. Select branch: `main`
5. Click **"Deploy"**

---

## Upgrade to Starter Plan

### Why Upgrade?
- Free tier sleeps after 15 minutes of inactivity
- Starter tier runs 24/7
- Better performance
- Only $7/month

### How to Upgrade
1. Go to Render Dashboard
2. Click on your service
3. Click **"Settings"**
4. Scroll to **"Plan"**
5. Click **"Change Plan"**
6. Select **"Starter"**
7. Add payment method
8. Confirm upgrade

---

## Custom Domain (Optional)

### Add Custom Domain
1. Go to Render Dashboard
2. Click on your service
3. Click **"Settings"**
4. Scroll to **"Custom Domain"**
5. Enter your domain (e.g., `api.restrohub.com`)
6. Update DNS records as instructed
7. Wait for DNS propagation (up to 48 hours)

---

## Environment Variables Reference

### Development (Local)
```bash
PORT=5000
FRONTEND_URL=http://localhost:8080
NODE_ENV=development
```

### Production (Render)
```bash
PORT=5000
FRONTEND_URL=https://restrohub.vercel.app
NODE_ENV=production
```

---

## Quick Reference

| Task | Steps |
|------|-------|
| Create service | Dashboard → New → Web Service → Select repo |
| Set build command | `npm install` |
| Set start command | `node server/mock-backend.mjs` |
| Add env vars | Settings → Environment Variables |
| View logs | Click service → Logs tab |
| Restart service | Click service → Manual Deploy |
| Upgrade plan | Settings → Plan → Change Plan |
| Add domain | Settings → Custom Domain |

---

## Deployment URLs

After deployment, you'll have:

```
Backend API: https://restrohub-backend.onrender.com
```

Use this URL in your frontend's `VITE_API_URL` environment variable.

---

## Next Steps

1. ✅ Deploy backend on Render
2. ✅ Get backend URL
3. ✅ Deploy frontend on Vercel
4. ✅ Update `VITE_API_URL` on Vercel
5. ✅ Update `FRONTEND_URL` on Render
6. ✅ Test integration
7. ✅ Monitor logs

---

## Support

### Render Documentation
- https://render.com/docs

### Common Issues
- Check logs first
- Verify environment variables
- Ensure GitHub is connected
- Try manual redeploy

### Getting Help
- Check Render status page
- Review error logs carefully
- Search Render documentation
- Contact Render support

