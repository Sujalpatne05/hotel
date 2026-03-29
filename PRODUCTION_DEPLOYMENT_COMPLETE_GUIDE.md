# RestroHub POS - Production Deployment Guide

## Overview
This guide covers deploying RestroHub to production with both frontend and backend running on cloud platforms.

---

## PART 1: CHOOSE YOUR DEPLOYMENT PLATFORM

### Option A: Vercel (Recommended for Frontend) + Render (Backend)
**Best for**: Quick setup, free tier available, good performance

### Option B: Netlify (Frontend) + Render (Backend)
**Best for**: Simple deployment, good free tier

### Option C: AWS (Full Stack)
**Best for**: Enterprise, scalability, full control

### Option D: DigitalOcean (Full Stack)
**Best for**: Affordable, simple, good documentation

---

## PART 2: FRONTEND DEPLOYMENT (Vercel - Recommended)

### Step 1: Prepare Frontend for Production

1. **Update environment variables** in `.env.production`:
```
VITE_API_URL=https://your-backend-domain.com
```

2. **Build the frontend locally to test**:
```bash
npm run build
```

3. **Verify build output** in `dist/` folder

### Step 2: Deploy to Vercel

1. **Sign up at** https://vercel.com (free tier available)

2. **Connect GitHub repository**:
   - Click "New Project"
   - Select your GitHub repo
   - Vercel auto-detects it's a Vite project

3. **Configure build settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Set environment variables** in Vercel dashboard:
   - Go to Settings → Environment Variables
   - Add: `VITE_API_URL=https://your-backend-domain.com`

5. **Deploy**:
   - Click "Deploy"
   - Vercel automatically deploys on every push to main branch
   - Your frontend URL: `https://your-project.vercel.app`

### Step 3: Configure CORS for Frontend

Your backend needs to allow requests from your Vercel domain. Update backend CORS:

```javascript
// In server/mock-backend.mjs
const corsOptions = {
  origin: [
    'https://your-project.vercel.app',
    'http://localhost:3000',
    'http://localhost:8080'
  ],
  credentials: true
};
```

---

## PART 3: BACKEND DEPLOYMENT (Render - Recommended)

### Step 1: Prepare Backend for Production

1. **Create `.env` file** in root (if not exists):
```
NODE_ENV=production
PORT=5000
DATABASE_URL=your-database-url (if using database)
```

2. **Update backend to use environment variables**:
```javascript
// In server/mock-backend.mjs
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
```

3. **Ensure data persistence** (critical):
   - Option A: Use database (MongoDB, PostgreSQL)
   - Option B: Use file-based storage with backup
   - Option C: Use cloud storage (AWS S3, Firebase)

### Step 2: Deploy to Render

1. **Sign up at** https://render.com (free tier available)

2. **Create new Web Service**:
   - Click "New +"
   - Select "Web Service"
   - Connect GitHub repo

3. **Configure service**:
   - Name: `restrohub-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server/mock-backend.mjs`
   - Plan: Free (or Starter for production)

4. **Set environment variables**:
   - Go to Environment
   - Add: `NODE_ENV=production`
   - Add: `PORT=5000`
   - Add any database URLs

5. **Deploy**:
   - Click "Create Web Service"
   - Render deploys automatically
   - Your backend URL: `https://your-backend.onrender.com`

### Step 3: Update Frontend API URL

After backend is deployed, update frontend environment:

1. **In Vercel dashboard**:
   - Settings → Environment Variables
   - Update `VITE_API_URL=https://your-backend.onrender.com`

2. **Redeploy frontend** (automatic on next push or manual redeploy)

---

## PART 4: DATABASE SETUP (Critical for Production)

### Option A: MongoDB Atlas (Recommended)

1. **Sign up at** https://www.mongodb.com/cloud/atlas

2. **Create cluster**:
   - Free tier available
   - Choose region close to your users
   - Create database user

3. **Get connection string**:
   - Connection String: `mongodb+srv://user:password@cluster.mongodb.net/restrohub`

4. **Update backend**:
```javascript
// In server/mock-backend.mjs
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
};

connectDB();
```

5. **Add to Render environment variables**:
   - `DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/restrohub`

### Option B: PostgreSQL (Supabase)

1. **Sign up at** https://supabase.com

2. **Create project** (free tier available)

3. **Get connection string** from project settings

4. **Update backend** with PostgreSQL driver

### Option C: Firebase (Easiest)

1. **Sign up at** https://firebase.google.com

2. **Create project**

3. **Enable Firestore Database**

4. **Get credentials** and add to backend

---

## PART 5: DOMAIN & SSL SETUP

### Step 1: Get Custom Domain

1. **Buy domain** from:
   - Namecheap
   - GoDaddy
   - Google Domains
   - Cloudflare

### Step 2: Connect to Vercel (Frontend)

1. **In Vercel dashboard**:
   - Settings → Domains
   - Add your domain
   - Follow DNS configuration steps

### Step 3: Connect to Render (Backend)

1. **In Render dashboard**:
   - Settings → Custom Domain
   - Add your backend domain (e.g., api.yourdomain.com)
   - Follow DNS configuration steps

### Step 4: SSL Certificate

- Vercel: Automatic SSL (free)
- Render: Automatic SSL (free)
- Both platforms handle SSL automatically

---

## PART 6: PRODUCTION CHECKLIST

### Security
- [ ] Remove debug logs from production code
- [ ] Enable HTTPS everywhere
- [ ] Set secure CORS headers
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting on API
- [ ] Set up authentication properly
- [ ] Use secure session management

### Performance
- [ ] Enable caching headers
- [ ] Compress responses (gzip)
- [ ] Optimize images
- [ ] Minify CSS/JS (Vite does this)
- [ ] Use CDN for static assets
- [ ] Enable database indexing
- [ ] Monitor API response times

### Monitoring & Logging
- [ ] Set up error tracking (Sentry)
- [ ] Enable application logging
- [ ] Monitor server health
- [ ] Set up uptime monitoring
- [ ] Create backup strategy
- [ ] Monitor database performance

### Data & Backup
- [ ] Set up automated backups
- [ ] Test backup restoration
- [ ] Enable database replication
- [ ] Document recovery procedures
- [ ] Encrypt sensitive data

---

## PART 7: DEPLOYMENT STEPS (Quick Summary)

### First Time Deployment:

1. **Frontend (Vercel)**:
   ```bash
   # Push to GitHub
   git push origin main
   
   # Vercel auto-deploys
   # Check: https://your-project.vercel.app
   ```

2. **Backend (Render)**:
   - Connect GitHub repo to Render
   - Set environment variables
   - Deploy
   - Check: https://your-backend.onrender.com/health

3. **Update Frontend API URL**:
   - Set `VITE_API_URL` in Vercel environment
   - Redeploy frontend

4. **Test**:
   - Login to frontend
   - Create restaurant
   - Add menu items
   - Test all features

### Subsequent Deployments:

1. **Make changes locally**
2. **Test locally**: `npm run dev`
3. **Commit and push**: `git push origin main`
4. **Vercel auto-deploys frontend**
5. **Render auto-deploys backend** (if connected to GitHub)

---

## PART 8: ENVIRONMENT VARIABLES REFERENCE

### Frontend (.env.production)
```
VITE_API_URL=https://your-backend.onrender.com
```

### Backend (.env)
```
NODE_ENV=production
PORT=5000
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/restrohub
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=https://your-project.vercel.app
```

---

## PART 9: TROUBLESHOOTING

### Frontend not connecting to backend
- Check `VITE_API_URL` is correct
- Verify backend CORS allows frontend domain
- Check browser console for errors
- Verify backend is running

### Backend deployment fails
- Check build command is correct
- Verify all dependencies in package.json
- Check environment variables are set
- Review deployment logs

### Database connection fails
- Verify connection string is correct
- Check database user credentials
- Verify IP whitelist (if applicable)
- Check database is running

### SSL/HTTPS issues
- Wait 24-48 hours for DNS propagation
- Clear browser cache
- Check DNS records are correct
- Verify domain is pointing to correct service

---

## PART 10: MONITORING & MAINTENANCE

### Daily
- Check error logs
- Monitor API response times
- Verify database is healthy

### Weekly
- Review user feedback
- Check performance metrics
- Update dependencies (if needed)

### Monthly
- Review security logs
- Test backup restoration
- Update SSL certificates (if manual)
- Review cost optimization

---

## RECOMMENDED DEPLOYMENT STACK

**For Production:**
- Frontend: Vercel (free tier or Pro)
- Backend: Render (free tier or Starter)
- Database: MongoDB Atlas (free tier)
- Domain: Namecheap or Google Domains
- Monitoring: Sentry (free tier)
- Email: SendGrid (free tier)

**Estimated Monthly Cost:**
- Vercel: $0-20
- Render: $7-50
- MongoDB: $0-50
- Domain: $10-15
- **Total: $17-135/month**

---

## NEXT STEPS

1. Choose your deployment platform
2. Set up accounts on chosen platforms
3. Follow the deployment steps above
4. Test thoroughly in production
5. Set up monitoring and backups
6. Document your deployment process
7. Create runbook for common issues

---

## SUPPORT & RESOURCES

- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Node.js Best Practices: https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

