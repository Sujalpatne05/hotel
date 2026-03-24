# Vercel Deployment Fix

## Problem
```
Build Failed
Command "npm install" exited with 1
```

## Root Cause
The project has peer dependency conflicts that npm can't resolve in the Vercel build environment.

## Solution Applied

### 1. Created `.npmrc` File
Added `.npmrc` file to the project root with:
```
legacy-peer-deps=true
```

This tells npm to ignore peer dependency conflicts during installation.

### 2. Updated `vercel.json`
Updated the Vercel configuration to:
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

## What Changed
- ✅ Added `.npmrc` with `legacy-peer-deps=true`
- ✅ Updated `vercel.json` with correct build configuration
- ✅ Removed hardcoded IP address from rewrites
- ✅ Added environment variable support

## Next Steps

### 1. Redeploy on Vercel
1. Go to Vercel Dashboard
2. Click on your project
3. Click "Redeploy" button
4. Wait for build to complete

### 2. Set Environment Variables
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   ```
   VITE_API_URL=https://restrohub-backend.onrender.com
   ```
3. Redeploy

### 3. Verify Deployment
- [ ] Build succeeds (no red errors)
- [ ] Deployment completes
- [ ] Frontend URL is accessible
- [ ] Login works with test credentials
- [ ] API calls reach backend

## If Still Failing

### Check Build Logs
1. Go to Vercel Dashboard
2. Click on your project
3. Click on the failed deployment
4. Click "Logs" tab
5. Look for error messages

### Common Issues

**Issue**: Still getting npm install error
**Solution**: 
- Clear Vercel cache: Project Settings → Git → Clear Cache
- Redeploy

**Issue**: Build succeeds but page is blank
**Solution**:
- Check browser console (F12) for errors
- Verify `VITE_API_URL` environment variable is set
- Check Network tab for API calls

**Issue**: API calls fail with CORS error
**Solution**:
- Verify backend is running on Render
- Check `VITE_API_URL` matches backend URL
- Verify backend CORS is configured correctly

## Files Modified
- `.npmrc` - Created (new file)
- `vercel.json` - Updated
- `package.json` - No changes needed

## Deployment Status
✅ Frontend: Ready to deploy on Vercel
✅ Backend: Deploy on Render (separate)

## Quick Redeploy Steps
1. Changes are already pushed to GitHub
2. Go to Vercel Dashboard
3. Click "Redeploy" on your project
4. Wait 2-3 minutes
5. Check if build succeeds

---

## Alternative: Manual Fix (If Needed)

If you want to manually fix locally:

```bash
# Clear cache
npm cache clean --force

# Remove lock file
rm package-lock.json

# Reinstall with legacy peer deps
npm install --legacy-peer-deps

# Build
npm run build

# Commit and push
git add -A
git commit -m "Fix npm dependencies"
git push origin main
```

---

## Prevention for Future

The `.npmrc` file will prevent this issue in future deployments. It's now committed to the repository.

