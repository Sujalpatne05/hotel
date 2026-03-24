# Netlify - Deploy Settings & Environment Variables

## During Initial Deploy

### Step 1: After Selecting Repository

You'll see this screen:

```
Build settings for main

Build Command:     npm run build
Publish Directory: dist
```

✅ These are correct - don't change them

### Step 2: Click "Advanced"

Before clicking "Deploy site", click "Advanced" to add environment variables.

### Step 3: Add Environment Variable

Click "New variable"

```
Key:   VITE_API_URL
Value: https://hotel-vpuj.onrender.com
```

Click "Add"

### Step 4: Deploy

Click "Deploy site"

Wait 2-3 minutes for build to complete.

---

## After Deployment (If You Need to Change Settings)

### Go to Site Settings

1. Netlify Dashboard
2. Click your site
3. Click "Site settings"

### Build & Deploy Settings

1. Click "Build & deploy"
2. Click "Build settings"
3. You can see:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### Environment Variables

1. Click "Build & deploy"
2. Click "Environment"
3. Click "Edit variables"
4. Add or edit:
   ```
   VITE_API_URL = https://hotel-vpuj.onrender.com
   ```

### Redeploy After Changes

1. Go to "Deploys"
2. Click "Trigger deploy"
3. Select "Deploy site"
4. Wait for build

---

## Quick Checklist

- [ ] Build Command: `npm run build`
- [ ] Publish Directory: `dist`
- [ ] Environment Variable: `VITE_API_URL=https://hotel-vpuj.onrender.com`
- [ ] Click "Deploy site"
- [ ] Wait 2-3 minutes
- [ ] Get your Netlify URL
- [ ] Update Render backend CORS

---

## Your Netlify URL

After deployment, you'll get:
```
https://restro-hub-xyz.netlify.app
```

(The exact URL will be shown in Netlify dashboard)

