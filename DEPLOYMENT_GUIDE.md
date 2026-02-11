# HRMS Lite - Complete Deployment Guide

Deploy your HRMS Lite application to production in ~30 minutes using **Render** (backend + database) and **Vercel** (frontend).

## Overview

- **Backend + Database**: Render.com (Free tier)
- **Frontend**: Vercel (Free tier)
- **Total Cost**: $0/month (Free tier)
- **Time Required**: ~30 minutes

## Prerequisites

✅ GitHub account
✅ Git installed locally
✅ Your HRMS Lite code

---

## Part 1: Prepare Your Code (5 minutes)

### Step 1: Push to GitHub

If you haven't already, push your code to GitHub:

```bash
cd /Users/gauravmishra/HRMS-Lite

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit: HRMS Lite production-ready code"

# Create a repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/HRMS-Lite.git
git branch -M main
git push -u origin main
```

### Step 2: Verify Required Files

Make sure these files exist (they already do):

```
backend/
  ├── build.sh           ✅ Build script
  ├── requirements.txt   ✅ Dependencies
  ├── runtime.txt        ✅ Python version
  └── .env.example       ✅ Environment template

frontend/
  └── vercel.json        ✅ Vercel config
```

---

## Part 2: Deploy Backend to Render (15 minutes)

### Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with GitHub (recommended)
4. Authorize Render to access your repositories

### Step 2: Create PostgreSQL Database

1. From Render Dashboard, click **"New +"**
2. Select **"PostgreSQL"**
3. Configure:
   ```
   Name: hrms-lite-db
   Database: hrms_db
   User: hrms_user
   Region: Oregon (or closest to your users)
   Plan: Free
   ```
4. Click **"Create Database"**
5. Wait 2-3 minutes for provisioning
6. Once created, copy the **Internal Database URL** (it starts with `postgresql://`)

**Example Internal Database URL:**
```
postgresql://hrms_user:xxx@dpg-xxx.oregon-postgres.render.com/hrms_db
```

### Step 3: Deploy Backend Web Service

1. From Render Dashboard, click **"New +"**
2. Select **"Web Service"**
3. Click **"Connect a repository"** → Select your **HRMS-Lite** repo
4. Configure:

   **Basic Info:**
   ```
   Name: hrms-lite-backend
   Region: Oregon (same as database)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   ```

   **Build & Deploy:**
   ```
   Build Command: ./build.sh
   Start Command: gunicorn hrms.wsgi:application
   ```

   **Instance Type:**
   ```
   Plan: Free
   ```

5. Click **"Advanced"** to add Environment Variables

### Step 4: Configure Environment Variables

Add these environment variables one by one (click **"Add Environment Variable"**):

| Key | Value |
|-----|-------|
| `DEBUG` | `False` |
| `SECRET_KEY` | Generate using: `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"` |
| `DATABASE_URL` | Paste the Internal Database URL from Step 2 |
| `ALLOWED_HOSTS` | `.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | `https://your-app.vercel.app` (you'll update this later) |
| `PYTHON_VERSION` | `3.11.6` |

**To generate SECRET_KEY locally:**
```bash
cd backend
source venv/bin/activate
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Wait 5-10 minutes for deployment
3. You'll see logs in real-time
4. Once deployed, you'll get a URL like: `https://hrms-lite-backend.onrender.com`

### Step 6: Verify Backend Deployment

Test your backend API:

```bash
curl https://hrms-lite-backend.onrender.com/api/dashboard/
```

Expected response:
```json
{
  "success": true,
  "data": {
    "total_employees": 0,
    "present_today": 0,
    "absent_today": 0,
    "attendance_rate": 0,
    "today_date": "2024-01-15",
    "recent_attendance": []
  }
}
```

✅ **Backend is now live!**

---

## Part 3: Deploy Frontend to Vercel (10 minutes)

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Sign up with GitHub (recommended)
4. Authorize Vercel to access your repositories

### Step 2: Update Frontend API URL

Before deploying, update the API URL in your frontend files:

```bash
cd /Users/gauravmishra/HRMS-Lite/frontend
```

Edit these 3 files and replace the API_BASE_URL:

**1. index.html** (around line 53):
```javascript
const API_BASE_URL = 'https://hrms-lite-backend.onrender.com/api';
```

**2. employees.html** (around line 53):
```javascript
const API_BASE_URL = 'https://hrms-lite-backend.onrender.com/api';
```

**3. attendance.html** (around line 53):
```javascript
const API_BASE_URL = 'https://hrms-lite-backend.onrender.com/api';
```

Commit and push these changes:
```bash
git add frontend/index.html frontend/employees.html frontend/attendance.html
git commit -m "Update API URL for production"
git push
```

### Step 3: Deploy to Vercel

1. From Vercel Dashboard, click **"Add New..."** → **"Project"**
2. Click **"Import"** next to your **HRMS-Lite** repository
3. Configure Project:
   ```
   Framework Preset: Other
   Root Directory: frontend
   Build Command: (leave empty)
   Output Directory: (leave empty)
   Install Command: (leave empty)
   ```
4. Click **"Deploy"**
5. Wait 1-2 minutes for deployment
6. You'll get a URL like: `https://hrms-lite-gaurav.vercel.app`

### Step 4: Update CORS in Backend

Now that you have your Vercel URL, update the backend CORS settings:

1. Go to Render Dashboard
2. Click on your **hrms-lite-backend** service
3. Go to **"Environment"** tab
4. Find `CORS_ALLOWED_ORIGINS`
5. Update it to: `https://hrms-lite-gaurav.vercel.app` (use your actual Vercel URL)
6. Click **"Save Changes"**
7. Wait for automatic redeployment (~2 minutes)

### Step 5: Test Your Application

Open your Vercel URL in a browser:
```
https://hrms-lite-gaurav.vercel.app
```

✅ **Your HRMS Lite is now live!**

---

## Part 4: Post-Deployment (Optional)

### Create Admin User (Optional)

To access Django admin panel:

1. Go to Render Dashboard
2. Click on **hrms-lite-backend**
3. Go to **"Shell"** tab
4. Run:
   ```bash
   python manage.py createsuperuser
   ```
5. Follow prompts to create admin user
6. Access admin at: `https://hrms-lite-backend.onrender.com/admin/`

### Custom Domain (Optional)

**For Frontend (Vercel):**
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**For Backend (Render):**
1. Go to Service Settings → Custom Domain
2. Add your custom domain
3. Update DNS records as instructed

---

## Deployment Checklist

### Backend Deployment ✅
- [ ] PostgreSQL database created
- [ ] Web service created
- [ ] Environment variables configured
- [ ] Build script executable
- [ ] Migrations applied automatically
- [ ] API endpoints responding
- [ ] CORS configured for frontend URL

### Frontend Deployment ✅
- [ ] API_BASE_URL updated in all HTML files
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Frontend deployed
- [ ] Application accessible via URL
- [ ] Backend API calls working

---

## Troubleshooting

### Backend Issues

**Build Failed:**
- Check `build.sh` has execute permissions
- Verify `requirements.txt` is correct
- Check Python version in `runtime.txt`

**Database Connection Error:**
```
Solution: Verify DATABASE_URL in environment variables
Ensure it's the Internal Database URL, not External
```

**Migration Errors:**
```
Solution: Check build logs in Render dashboard
Database might not be provisioned yet
Wait a few minutes and redeploy
```

**502 Bad Gateway:**
```
Solution: Check Start Command is: gunicorn hrms.wsgi:application
Verify gunicorn is in requirements.txt
Check logs for errors
```

### Frontend Issues

**Can't Connect to API:**
```
Solution:
1. Check API_BASE_URL in HTML files is correct
2. Verify CORS_ALLOWED_ORIGINS includes your Vercel URL
3. Make sure backend is deployed and running
```

**404 Not Found:**
```
Solution:
1. Verify Root Directory is set to "frontend"
2. Check vercel.json exists in frontend folder
3. Redeploy from Vercel dashboard
```

**CORS Error in Browser Console:**
```
Solution:
1. Update CORS_ALLOWED_ORIGINS in Render
2. Include full URL: https://your-app.vercel.app
3. Don't add trailing slash
4. Wait for backend to redeploy
```

---

## Free Tier Limitations

### Render Free Tier:
- **Web Service**: 750 hours/month (plenty for one app)
- **PostgreSQL**: 90 days free, then $7/month
- **Spin down after 15 minutes of inactivity** (first request will be slow)
- 512 MB RAM

### Vercel Free Tier:
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic SSL
- Global CDN

### Keeping Backend Alive (Optional)

Free tier services sleep after 15 minutes. To keep it alive:

**Option 1: Cron Job (Recommended)**
- Use [cron-job.org](https://cron-job.org) (free)
- Create a job to ping your backend every 14 minutes:
  ```
  URL: https://hrms-lite-backend.onrender.com/api/dashboard/
  Interval: */14 * * * *
  ```

**Option 2: Upgrade**
- Render Starter plan: $7/month (no sleep)

---

## Monitoring & Maintenance

### Check Application Status:

**Backend:**
```bash
curl https://hrms-lite-backend.onrender.com/api/dashboard/
```

**Frontend:**
```bash
curl https://hrms-lite-gaurav.vercel.app
```

### View Logs:

**Render:**
- Dashboard → Service → Logs tab
- Real-time logs with search

**Vercel:**
- Dashboard → Project → Deployments → Click deployment → Runtime Logs

### Update Application:

**Backend:**
```bash
git add .
git commit -m "Update backend"
git push
# Auto-deploys on Render
```

**Frontend:**
```bash
git add .
git commit -m "Update frontend"
git push
# Auto-deploys on Vercel
```

---

## Environment Management

### Development:
```
Backend: http://localhost:8000
Frontend: http://localhost:5500
Database: Local PostgreSQL
```

### Production:
```
Backend: https://hrms-lite-backend.onrender.com
Frontend: https://hrms-lite-gaurav.vercel.app
Database: Render PostgreSQL
```

---

## Security Best Practices

1. ✅ **Never commit .env file** - Already in .gitignore
2. ✅ **Use strong SECRET_KEY** - Generated randomly
3. ✅ **DEBUG=False in production** - Already configured
4. ✅ **HTTPS enforced** - Automatic on Render & Vercel
5. ✅ **CORS properly configured** - Only your domain allowed
6. ✅ **Environment variables** - Secure storage on platforms
7. ✅ **Regular updates** - Keep dependencies updated

---

## Cost Breakdown

### Free Tier (Current):
```
Backend (Render):         $0/month (750 hours)
Database (Render):        $0/month (90 days trial)
Frontend (Vercel):        $0/month
Domain (optional):        ~$12/year
Total:                    $0/month
```

### Paid Tier (Recommended for Production):
```
Backend (Render Starter): $7/month (no sleep)
Database (Render):        $7/month (included with paid tier)
Frontend (Vercel):        $0/month (free tier sufficient)
Domain (optional):        ~$12/year
Total:                    $7/month + domain
```

---

## Quick Commands Reference

### Local Development:
```bash
# Start backend
cd backend
source venv/bin/activate
python manage.py runserver

# Start frontend
cd frontend
python -m http.server 5500
```

### Deployment:
```bash
# Deploy changes
git add .
git commit -m "Your message"
git push
# Both Render and Vercel auto-deploy
```

### Database Access:
```bash
# Local
psql hrms_db

# Production (via Render Shell)
# Go to Render Dashboard → Service → Shell tab
python manage.py dbshell
```

---

## Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Django Deployment**: https://docs.djangoproject.com/en/4.2/howto/deployment/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

---

## Next Steps After Deployment

1. ✅ Test all features thoroughly
2. ✅ Create some test data
3. ✅ Share the URL with stakeholders
4. ✅ Set up monitoring/alerts (optional)
5. ✅ Configure custom domain (optional)
6. ✅ Set up backup strategy (optional)
7. ✅ Add Google Analytics (optional)

---

**Your HRMS Lite is now production-ready and deployed! 🚀**

Need help? Check the troubleshooting section or open an issue on GitHub.
