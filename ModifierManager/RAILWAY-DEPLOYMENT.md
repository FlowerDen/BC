# Railway Deployment Guide

## Prerequisites
- GitHub account
- Railway account (free): https://railway.app/

## Step 1: Prepare for Deployment

### Add Railway start script (already done in package.json)
Your app is ready to deploy!

## Step 2: Create `.gitignore`
Make sure sensitive data isn't committed to GitHub.

## Step 3: Push to GitHub
```bash
cd "C:\Users\info\Github Clone\BC\ModifierManager"
git init
git add .
git commit -m "Initial commit - BigCommerce Modifier Manager"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/bigcommerce-modifier-manager.git
git push -u origin main
```

## Step 4: Deploy to Railway

1. Go to https://railway.app/
2. Sign up with GitHub
3. Click **"New Project"**
4. Choose **"Deploy from GitHub repo"**
5. Select your `bigcommerce-modifier-manager` repo
6. Railway will auto-detect Node.js and deploy!

## Step 5: Get Your App URL

After deployment:
- Railway gives you a URL like: `https://bigcommerce-modifier-manager.up.railway.app`
- This is your public app URL!

## Step 6: Set Environment Variables (for OAuth later)

In Railway dashboard → Variables tab, add:
- `SESSION_SECRET` = (generate a random string)
- `BIGCOMMERCE_CLIENT_ID` = (from Developer Portal)
- `BIGCOMMERCE_CLIENT_SECRET` = (from Developer Portal)
- `APP_URL` = (your Railway URL)

---

## Cost
- Free tier: $5 credit/month
- Your app will likely use $2-3/month
- Pay only if you exceed free credits

## Next Steps After Deployment
1. Test your live app
2. Configure OAuth (if converting to marketplace app)
3. Submit to BigCommerce marketplace
