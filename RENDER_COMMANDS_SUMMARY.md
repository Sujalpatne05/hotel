# Render Build & Start Commands - Summary

## The Commands You Need

### Build Command
```bash
npm install
```

### Start Command
```bash
node server/mock-backend.mjs
```

---

## What Each Command Does

### Build Command: `npm install`
**Purpose**: Install all dependencies

**What it does**:
1. Reads `package.json`
2. Downloads all packages
3. Creates `node_modules` folder
4. Installs Express, CORS, JWT, etc.
5. Takes 1-2 minutes

**Why it's needed**:
- Backend needs Express to run
- Backend needs CORS for frontend communication
- Backend needs JWT for authentication
- All dependencies listed in `package.json`

### Start Command: `node server/mock-backend.mjs`
**Purpose**: Start the backend server

**What it does**:
1. Starts Node.js process
2. Loads `server/mock-backend.mjs`
3. Creates Express app
4. Listens on port 5000
5. Handles API requests
6. Runs indefinitely

**Why it's needed**:
- Starts the server
- Makes API endpoints available
- Handles requests from frontend
- Keeps running 24/7 (on Starter plan)

---

## Environment Variables

Add these to Render dashboard:

```
PORT=5000
FRONTEND_URL=https://restrohub.vercel.app
NODE_ENV=production
```

### What Each Variable Does

| Variable | Value | Purpose |
|----------|-------|---------|
| `PORT` | `5000` | Port server listens on |
| `FRONTEND_URL` | `https://restrohub.vercel.app` | CORS origin (frontend URL) |
| `NODE_ENV` | `production` | Environment mode |

---

## Step-by-Step Setup on Render

### 1. Create Web Service
- Go to Render.com
- Click "New +"
- Select "Web Service"
- Connect GitHub
- Select `Sujalpatne05/hotel` repo

### 2. Configure Service
```
Name:              restrohub-backend
Environment:       Node
Region:            Oregon
Root Directory:    (leave empty)
Build Command:     npm install
Start Command:     node server/mock-backend.mjs
Instance Type:     Free (or Starter)
```

### 3. Add Environment Variables
Click "Advanced" and add:
```
PORT=5000
FRONTEND_URL=https://restrohub.vercel.app
NODE_ENV=production
```

### 4. Deploy
- Click "Create Web Service"
- Wait 2-3 minutes
- Check logs for success

### 5. Get URL
Once deployed:
```
https://restrohub-backend.onrender.com
```

---

## Verify It Works

### Test 1: Check if running
```bash
curl https://restrohub-backend.onrender.com/auth/login
```

Response:
```json
{"message":"Login endpoint"}
```

### Test 2: Try login
```bash
curl -X POST https://restrohub-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

Response:
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

## Common Issues

### Build Fails
**Error**: `npm install exited with 1`

**Solution**:
1. Check logs for specific error
2. Verify `package.json` is valid
3. Try locally: `npm install`
4. Redeploy if local works

### Server Won't Start
**Error**: `node server/mock-backend.mjs exited with code 1`

**Solution**:
1. Check logs for error
2. Verify `server/mock-backend.mjs` exists
3. Check environment variables
4. Verify Node.js version (18+)

### CORS Errors
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Update `FRONTEND_URL` env var
2. Ensure it matches Vercel URL exactly
3. Redeploy backend
4. Wait 1-2 minutes

### Service Keeps Crashing
**Solution**:
1. Check logs for error messages
2. Verify all env vars are set
3. Try redeploying
4. Check `server/mock-backend.mjs` for errors

---

## Important Notes

✅ **Build Command**: `npm install` (installs dependencies)
✅ **Start Command**: `node server/mock-backend.mjs` (starts server)
✅ **Port**: Must be `5000` (set in `PORT` env var)
✅ **Frontend URL**: Update after Vercel deployment
✅ **Free Tier**: Sleeps after 15 min (upgrade to Starter for 24/7)

---

## After Deployment

1. Copy backend URL: `https://restrohub-backend.onrender.com`
2. Go to Vercel dashboard
3. Add `VITE_API_URL=<backend-url>` env var
4. Redeploy frontend
5. Test login

---

## Upgrade to Starter Plan

### Why?
- Free tier sleeps after 15 minutes
- Starter runs 24/7
- Only $7/month

### How?
1. Render Dashboard → Your Service
2. Settings → Plan
3. Change to Starter
4. Add payment method

---

## File Locations

```
hotel/
├── server/
│   └── mock-backend.mjs          ← This file is started
├── package.json                  ← Dependencies are installed from here
└── ...
```

---

## Quick Reference

| Item | Value |
|------|-------|
| Build Command | `npm install` |
| Start Command | `node server/mock-backend.mjs` |
| Port | `5000` |
| Environment | `Node` |
| Instance | `Free` or `Starter` |
| Backend URL | `https://restrohub-backend.onrender.com` |

---

## Deployment Checklist

- [ ] Build Command: `npm install`
- [ ] Start Command: `node server/mock-backend.mjs`
- [ ] Environment Variables:
  - [ ] `PORT=5000`
  - [ ] `FRONTEND_URL=https://restrohub.vercel.app`
  - [ ] `NODE_ENV=production`
- [ ] Deployment started
- [ ] Logs show success
- [ ] Backend URL obtained
- [ ] Backend URL added to Vercel
- [ ] Frontend redeployed
- [ ] Login works

---

## That's It!

You now have everything you need to deploy on Render. The build and start commands are:

```
Build:  npm install
Start:  node server/mock-backend.mjs
```

Good luck! 🚀

