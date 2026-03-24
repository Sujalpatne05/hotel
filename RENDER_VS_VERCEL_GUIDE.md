# Render vs Vercel - Complete Comparison

## Quick Summary

| Aspect | Render (Backend) | Vercel (Frontend) |
|--------|------------------|-------------------|
| **Purpose** | Deploy Node.js backend | Deploy React frontend |
| **Build Command** | `npm install` | `npm run build` |
| **Start Command** | `node server/mock-backend.mjs` | N/A (static files) |
| **Port** | 5000 | 443 (HTTPS) |
| **Database** | In-memory (mock) | N/A |
| **Cost** | Free (sleeps) / $7/month | Free / $20/month |
| **URL** | `https://restrohub-backend.onrender.com` | `https://restrohub.vercel.app` |

---

## Render (Backend Deployment)

### What is Render?
- Cloud platform for deploying backend services
- Supports Node.js, Python, Go, Rust, etc.
- Automatically deploys from GitHub
- Includes free tier with limitations

### Build Process
```
1. GitHub push detected
2. npm install (installs dependencies)
3. node server/mock-backend.mjs (starts server)
4. Server listens on port 5000
5. Accessible at https://restrohub-backend.onrender.com
```

### Build Command: `npm install`
- Installs all packages from `package.json`
- Creates `node_modules` folder
- Takes 1-2 minutes
- Required for every deployment

### Start Command: `node server/mock-backend.mjs`
- Starts the Express server
- Listens on port 5000
- Runs indefinitely
- Handles API requests

### Environment Variables
```
PORT=5000                                    # Server port
FRONTEND_URL=https://restrohub.vercel.app   # CORS origin
NODE_ENV=production                         # Environment mode
```

### Free Tier Limitations
- ✅ Free deployment
- ✅ Automatic GitHub integration
- ❌ Sleeps after 15 minutes of inactivity
- ❌ Slower startup time
- ❌ Limited resources

### Starter Plan ($7/month)
- ✅ 24/7 uptime
- ✅ Better performance
- ✅ More resources
- ✅ Recommended for production

---

## Vercel (Frontend Deployment)

### What is Vercel?
- Cloud platform for deploying frontend applications
- Optimized for React, Next.js, Vue, etc.
- Automatically deploys from GitHub
- Includes free tier

### Build Process
```
1. GitHub push detected
2. npm install (installs dependencies)
3. npm run build (builds React app)
4. Creates dist/ folder with static files
5. Serves files on HTTPS
6. Accessible at https://restrohub.vercel.app
```

### Build Command: `npm run build`
- Compiles React code to static files
- Optimizes for production
- Creates `dist/` folder
- Takes 1-2 minutes

### Start Command: N/A
- Vercel serves static files automatically
- No server process needed
- No start command required

### Environment Variables
```
VITE_API_URL=https://restrohub-backend.onrender.com   # Backend URL
```

### Free Tier
- ✅ Free deployment
- ✅ Automatic GitHub integration
- ✅ 24/7 uptime
- ✅ Good for production
- ✅ Recommended for most projects

### Pro Plan ($20/month)
- ✅ Advanced analytics
- ✅ Priority support
- ✅ More deployments
- ✅ Custom domains

---

## Deployment Flow

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                    │
│              (Sujalpatne05/hotel - main)                │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
        │                         │
   ┌────▼──────────┐      ┌──────▼────────┐
   │  RENDER.COM   │      │  VERCEL.COM   │
   │               │      │               │
   │ Backend       │      │ Frontend      │
   │ Node.js       │      │ React         │
   │               │      │               │
   │ Build:        │      │ Build:        │
   │ npm install   │      │ npm run build │
   │               │      │               │
   │ Start:        │      │ Start:        │
   │ node server/  │      │ (automatic)   │
   │ mock-backend  │      │               │
   │               │      │               │
   └────┬──────────┘      └──────┬────────┘
        │                        │
        │ Port 5000              │ HTTPS
        │                        │
   ┌────▼──────────────────────┬─┘
   │                            │
   │  API Communication         │
   │  (CORS enabled)            │
   │                            │
   └────────────────────────────┘
```

---

## Configuration Files

### Render Configuration
**File**: `render.yaml` (optional) or Dashboard settings

```yaml
services:
  - type: web
    name: restrohub-backend
    env: node
    buildCommand: npm install
    startCommand: node server/mock-backend.mjs
    envVars:
      - key: PORT
        value: 5000
      - key: FRONTEND_URL
        value: https://restrohub.vercel.app
      - key: NODE_ENV
        value: production
```

### Vercel Configuration
**File**: `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite_api_url"
  },
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## Deployment Checklist

### Render Backend
- [ ] GitHub connected
- [ ] Repository selected
- [ ] Branch: `main`
- [ ] Name: `restrohub-backend`
- [ ] Environment: `Node`
- [ ] Build Command: `npm install`
- [ ] Start Command: `node server/mock-backend.mjs`
- [ ] Environment Variables set:
  - [ ] `PORT=5000`
  - [ ] `FRONTEND_URL=https://restrohub.vercel.app`
  - [ ] `NODE_ENV=production`
- [ ] Deployment started
- [ ] Logs show success
- [ ] Backend URL obtained

### Vercel Frontend
- [ ] GitHub connected
- [ ] Repository selected
- [ ] Branch: `main`
- [ ] Framework: `Vite`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Environment Variables set:
  - [ ] `VITE_API_URL=https://restrohub-backend.onrender.com`
- [ ] Deployment started
- [ ] Logs show success
- [ ] Frontend URL obtained

---

## Testing Deployment

### Test Backend (Render)
```bash
# Test if running
curl https://restrohub-backend.onrender.com/auth/login

# Test login
curl -X POST https://restrohub-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### Test Frontend (Vercel)
1. Open https://restrohub.vercel.app
2. Check browser console (F12) for errors
3. Try logging in
4. Check Network tab for API calls

### Test Integration
1. Open frontend URL
2. Open DevTools (F12)
3. Go to Network tab
4. Try logging in
5. Verify API calls go to backend URL
6. Verify login succeeds

---

## Common Issues & Solutions

### Render Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check logs, verify `package.json` |
| Server won't start | Check logs, verify `server/mock-backend.mjs` |
| CORS errors | Update `FRONTEND_URL`, redeploy |
| Service sleeps | Upgrade to Starter plan |
| Port conflicts | Ensure `PORT=5000` env var |

### Vercel Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check logs, verify `npm run build` works locally |
| Blank page | Check console for errors, verify build output |
| API calls fail | Check `VITE_API_URL` env var, verify backend URL |
| 404 errors | Check `vercel.json` rewrites configuration |

---

## Monitoring

### Render Monitoring
- Dashboard → Your Service → Logs
- Dashboard → Your Service → Metrics
- Check CPU, Memory, Network usage
- View real-time logs

### Vercel Monitoring
- Dashboard → Your Project → Deployments
- Dashboard → Your Project → Analytics
- Check build times
- View deployment logs

---

## Cost Comparison

### Render
- **Free**: $0/month (sleeps after 15 min)
- **Starter**: $7/month (24/7 uptime)
- **Standard**: $12/month (more resources)

### Vercel
- **Free**: $0/month (24/7 uptime)
- **Pro**: $20/month (advanced features)
- **Enterprise**: Custom pricing

### Recommended Setup
- **Render Starter**: $7/month (backend)
- **Vercel Free**: $0/month (frontend)
- **Total**: $7/month

---

## Deployment Timeline

```
Time    Action                          Status
────────────────────────────────────────────────────────────
T+0     Push code to GitHub             ✓ Complete
        
T+1     Render detects push             ✓ Triggered
        
T+2     Render: npm install             ⏳ In Progress
        
T+3     Render: npm start               ⏳ In Progress
        
T+4     Backend deployed                ✓ Complete
        
T+5     Vercel detects push             ✓ Triggered
        
T+6     Vercel: npm install             ⏳ In Progress
        
T+7     Vercel: npm run build           ⏳ In Progress
        
T+8     Frontend deployed               ✓ Complete
        
T+9     Update env vars                 ✓ Complete
        
T+10    Redeploy both                   ⏳ In Progress
        
T+11    All systems operational         ✓ READY
```

---

## Quick Reference

### Render Commands
```bash
# Build
npm install

# Start
node server/mock-backend.mjs

# Environment Variables
PORT=5000
FRONTEND_URL=https://restrohub.vercel.app
NODE_ENV=production
```

### Vercel Commands
```bash
# Build
npm run build

# Environment Variables
VITE_API_URL=https://restrohub-backend.onrender.com
```

---

## Next Steps

1. Deploy backend on Render
2. Get backend URL
3. Deploy frontend on Vercel
4. Update environment variables
5. Test integration
6. Monitor logs
7. Upgrade plans if needed

