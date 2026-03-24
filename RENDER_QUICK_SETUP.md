# Render Backend - Quick Setup (5 Minutes)

## Copy These Commands

### Build Command
```bash
npm install
```

### Start Command
```bash
node server/mock-backend.mjs
```

---

## Environment Variables

Copy and paste these into Render:

```
PORT=5000
FRONTEND_URL=https://restrohub.vercel.app
NODE_ENV=production
```

**Note**: Update `FRONTEND_URL` after you deploy frontend on Vercel.

---

## Step-by-Step

### 1. Go to Render
https://render.com

### 2. Click "New +"
Select **"Web Service"**

### 3. Connect GitHub
- Click "Connect account"
- Authorize GitHub
- Select: `Sujalpatne05/hotel`
- Branch: `main`

### 4. Fill in Details
```
Name:              restrohub-backend
Environment:       Node
Region:            Oregon
Root Directory:    (leave empty)
Build Command:     npm install
Start Command:     node server/mock-backend.mjs
Instance Type:     Free (or Starter)
```

### 5. Add Environment Variables
Click "Advanced" and add:
```
PORT=5000
FRONTEND_URL=https://restrohub.vercel.app
NODE_ENV=production
```

### 6. Click "Create Web Service"
Wait 2-3 minutes for deployment.

### 7. Get Your URL
Once deployed, you'll see:
```
https://restrohub-backend.onrender.com
```

---

## Test It Works

### Test 1: Check if running
```bash
curl https://restrohub-backend.onrender.com/auth/login
```

Should return:
```json
{"message":"Login endpoint"}
```

### Test 2: Try login
```bash
curl -X POST https://restrohub-backend.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

Should return JWT token.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check logs, ensure `package.json` is valid |
| Server won't start | Check logs, verify `server/mock-backend.mjs` exists |
| CORS errors | Update `FRONTEND_URL` env var, redeploy |
| Service keeps crashing | Check logs for error messages |
| Too slow | Upgrade to Starter plan ($7/month) |

---

## Important Notes

- ✅ Build command: `npm install` (installs dependencies)
- ✅ Start command: `node server/mock-backend.mjs` (starts server)
- ✅ Port: Must be `5000` (set in `PORT` env var)
- ✅ Frontend URL: Update after Vercel deployment
- ✅ Free tier: Sleeps after 15 min (upgrade to Starter for 24/7)

---

## After Deployment

1. Copy your backend URL
2. Go to Vercel dashboard
3. Add `VITE_API_URL=<your-backend-url>` env var
4. Redeploy frontend
5. Test login

---

## Your Backend URL

Once deployed:
```
https://restrohub-backend.onrender.com
```

Use this in Vercel's `VITE_API_URL` environment variable.

