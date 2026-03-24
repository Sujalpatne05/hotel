# Render Environment Variables - Complete Guide

## Quick Answer

Copy and paste these into Render:

```
PORT=5000
FRONTEND_URL=https://restrohub.vercel.app
NODE_ENV=production
```

---

## Step-by-Step: How to Add Environment Variables in Render

### Step 1: Go to Your Service
1. Open Render Dashboard: https://render.com/dashboard
2. Click on your service: `restrohub-backend`

### Step 2: Go to Environment Variables
1. Click **"Settings"** tab
2. Scroll down to **"Environment"** section
3. Or click **"Advanced"** during service creation

### Step 3: Add Each Variable
Click **"Add Environment Variable"** and add:

#### Variable 1: PORT
```
Key:   PORT
Value: 5000
```

#### Variable 2: FRONTEND_URL
```
Key:   FRONTEND_URL
Value: https://restrohub.vercel.app
```

#### Variable 3: NODE_ENV
```
Key:   NODE_ENV
Value: production
```

### Step 4: Save
Click **"Save"** button. Service will redeploy automatically.

---

## What Each Variable Does

### 1. PORT=5000
**Purpose**: Tells the server which port to listen on

**Why needed**: 
- Backend server needs to know which port to use
- Render assigns port 5000 by default
- Must match the port in `server/mock-backend.mjs`

**Value**: `5000` (don't change this)

### 2. FRONTEND_URL=https://restrohub.vercel.app
**Purpose**: Tells backend which frontend URL is allowed (CORS)

**Why needed**:
- Prevents CORS errors
- Allows frontend to communicate with backend
- Security: only allows requests from this URL

**Value**: Your Vercel frontend URL
- After deploying on Vercel, you'll get a URL like: `https://restrohub.vercel.app`
- Update this value with your actual Vercel URL

**Example**:
```
FRONTEND_URL=https://restrohub.vercel.app
```

### 3. NODE_ENV=production
**Purpose**: Tells Node.js this is production environment

**Why needed**:
- Enables production optimizations
- Disables debug logging
- Better performance

**Value**: `production` (for deployed app)

---

## Visual Guide

```
┌─────────────────────────────────────────────────────────┐
│              Render Dashboard                           │
│                                                         │
│  Your Service: restrohub-backend                        │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Settings                                        │   │
│  │                                                 │   │
│  │ Environment Variables:                          │   │
│  │                                                 │   │
│  │ ┌─────────────────────────────────────────────┐ │   │
│  │ │ KEY              │ VALUE                    │ │   │
│  │ ├──────────────────┼────────────────────────┤ │   │
│  │ │ PORT             │ 5000                   │ │   │
│  │ ├──────────────────┼────────────────────────┤ │   │
│  │ │ FRONTEND_URL     │ https://restrohub...   │ │   │
│  │ ├──────────────────┼────────────────────────┤ │   │
│  │ │ NODE_ENV         │ production             │ │   │
│  │ └─────────────────────────────────────────────┘ │   │
│  │                                                 │   │
│  │ [Save]                                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Complete Example

### Before Deployment
```
PORT=5000
FRONTEND_URL=http://localhost:8080
NODE_ENV=development
```

### After Deployment on Render
```
PORT=5000
FRONTEND_URL=https://restrohub.vercel.app
NODE_ENV=production
```

---

## Timeline: When to Update

### Step 1: Deploy Backend on Render
Set:
```
PORT=5000
FRONTEND_URL=https://restrohub.vercel.app
NODE_ENV=production
```

### Step 2: Deploy Frontend on Vercel
Get your Vercel URL (e.g., `https://restrohub.vercel.app`)

### Step 3: Update FRONTEND_URL (if different)
If your Vercel URL is different, update:
```
FRONTEND_URL=<your-actual-vercel-url>
```

### Step 4: Redeploy Backend
Render will automatically redeploy with new env vars.

---

## Common Mistakes

### ❌ Mistake 1: Wrong FRONTEND_URL
```
FRONTEND_URL=http://localhost:8080  ❌ WRONG (local URL)
FRONTEND_URL=https://restrohub.vercel.app  ✅ CORRECT
```

### ❌ Mistake 2: Missing PORT
```
(no PORT variable)  ❌ WRONG
PORT=5000  ✅ CORRECT
```

### ❌ Mistake 3: Wrong NODE_ENV
```
NODE_ENV=dev  ❌ WRONG
NODE_ENV=production  ✅ CORRECT
```

### ❌ Mistake 4: Typos in Variable Names
```
FRONTEND_url=...  ❌ WRONG (lowercase)
FRONTEND_URL=...  ✅ CORRECT (uppercase)
```

---

## Verification

### Check if Variables are Set
1. Go to Render Dashboard
2. Click your service
3. Click **"Settings"**
4. Scroll to **"Environment"**
5. Verify all three variables are there

### Check if Backend Uses Variables
1. Go to **"Logs"** tab
2. Look for: `Server running on http://localhost:5000`
3. If you see this, variables are working

### Test CORS
1. Open frontend URL
2. Open DevTools (F12)
3. Try logging in
4. Check Network tab
5. If API calls succeed, CORS is working

---

## Troubleshooting

### Issue: CORS Error
**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Check `FRONTEND_URL` is correct
2. Ensure it matches your Vercel URL exactly
3. Redeploy backend
4. Wait 1-2 minutes

### Issue: Backend Won't Start
**Error**: `listen EADDRINUSE: address already in use :::5000`

**Solution**:
1. Verify `PORT=5000` is set
2. Restart service: Dashboard → Manual Deploy
3. Check logs for errors

### Issue: Variables Not Taking Effect
**Solution**:
1. Verify variables are saved
2. Check logs to confirm deployment
3. Wait 1-2 minutes for changes
4. Try manual redeploy

---

## Environment Variables Reference

### All Available Variables

| Variable | Value | Required | Purpose |
|----------|-------|----------|---------|
| `PORT` | `5000` | ✅ Yes | Server port |
| `FRONTEND_URL` | `https://restrohub.vercel.app` | ✅ Yes | CORS origin |
| `NODE_ENV` | `production` | ✅ Yes | Environment mode |

### Optional Variables (Not Needed Now)

```
DATABASE_URL=...        # For future database
JWT_SECRET=...          # For JWT signing
LOG_LEVEL=info          # For logging
```

---

## How Backend Uses Variables

### In server/mock-backend.mjs

```javascript
// Read PORT from environment
const PORT = process.env.PORT || 5000;

// Read FRONTEND_URL from environment
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080';

// Read NODE_ENV from environment
const NODE_ENV = process.env.NODE_ENV || 'development';

// Use FRONTEND_URL for CORS
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Start server on PORT
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## Step-by-Step Setup

### During Service Creation

1. Fill in basic info
2. Click **"Advanced"**
3. Scroll to **"Environment Variables"**
4. Click **"Add Environment Variable"**
5. Add `PORT=5000`
6. Click **"Add Environment Variable"**
7. Add `FRONTEND_URL=https://restrohub.vercel.app`
8. Click **"Add Environment Variable"**
9. Add `NODE_ENV=production`
10. Click **"Create Web Service"**

### After Service Creation

1. Go to Render Dashboard
2. Click your service
3. Click **"Settings"**
4. Scroll to **"Environment"**
5. Click **"Add Environment Variable"**
6. Add each variable
7. Click **"Save"**

---

## Quick Reference

```
┌─────────────────────────────────────────┐
│ RENDER ENVIRONMENT VARIABLES            │
├─────────────────────────────────────────┤
│ PORT                                    │
│ Value: 5000                             │
├─────────────────────────────────────────┤
│ FRONTEND_URL                            │
│ Value: https://restrohub.vercel.app     │
├─────────────────────────────────────────┤
│ NODE_ENV                                │
│ Value: production                       │
└─────────────────────────────────────────┘
```

---

## Checklist

- [ ] PORT=5000 is set
- [ ] FRONTEND_URL=https://restrohub.vercel.app is set
- [ ] NODE_ENV=production is set
- [ ] All variables are saved
- [ ] Service redeployed
- [ ] Logs show success
- [ ] Backend URL obtained
- [ ] CORS working (no errors)

---

## After Setting Variables

1. ✅ Variables are saved
2. ✅ Service redeploys automatically
3. ✅ Backend starts with new variables
4. ✅ CORS is configured
5. ✅ Ready for frontend to connect

---

## Summary

**Set these 3 environment variables in Render:**

```
PORT=5000
FRONTEND_URL=https://restrohub.vercel.app
NODE_ENV=production
```

That's it! Your backend will use these values to:
- Listen on port 5000
- Allow requests from your Vercel frontend
- Run in production mode

