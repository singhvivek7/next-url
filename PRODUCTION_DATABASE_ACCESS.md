# Accessing Production Database with Prisma Studio

## 🎯 Overview

You cannot run Prisma Studio directly on Vercel, but you can connect Prisma Studio locally to your production MongoDB database. This guide shows you how.

## ✅ Method 1: Using Production Environment File (Recommended)

### Step 1: Get Production Environment Variables

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (run in project directory)
vercel link

# Pull production environment variables
vercel env pull .env.production
```

This creates a `.env.production` file with your production `DATABASE_URL`.

### Step 2: Run Prisma Studio with Production Database

```bash
# Use the new script we added
bun run db:studio:prod
```

This will:
- Load environment variables from `.env.production`
- Connect Prisma Studio to your production MongoDB
- Open Prisma Studio at `http://localhost:5555`

### Step 3: View and Edit Production Data

You can now:
- ✅ View all production data
- ✅ Edit records
- ✅ Delete records
- ✅ Create new records
- ⚠️ **BE CAREFUL** - Changes are made directly to production!

---

## 🔒 Method 2: Manual Connection String

If you prefer not to use Vercel CLI:

### Step 1: Get Your Production DATABASE_URL

1. Go to Vercel Dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Copy your `DATABASE_URL` value

### Step 2: Create `.env.production` Manually

Create a file `.env.production` in your project root:

```env
DATABASE_URL="mongodb+srv://your-production-connection-string"
```

### Step 3: Run Prisma Studio

```bash
bun run db:studio:prod
```

---

## 🛡️ Safety Tips

### ⚠️ Important Warnings

1. **You're editing LIVE production data** - Be extremely careful!
2. **No undo** - Changes are immediate and permanent
3. **Backup first** - Consider exporting data before making changes
4. **Read-only recommended** - Only make changes if absolutely necessary

### 🔐 Best Practices

1. **Use Read-Only Access When Possible**
   - Create a separate MongoDB user with read-only permissions
   - Use that connection string for viewing data

2. **Never Commit `.env.production`**
   - Already in `.gitignore`
   - Contains sensitive production credentials

3. **Use Staging Environment**
   - Test changes in staging before production
   - Create a staging database for experiments

4. **Monitor Changes**
   - Keep track of what you modify
   - Document any manual changes

---

## 📊 Alternative: MongoDB Atlas Dashboard

If you're using MongoDB Atlas, you can also:

1. **Login to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Select your cluster**
3. **Click "Browse Collections"**
4. **View/Edit data** directly in the web interface

**Advantages:**
- ✅ Web-based (no local setup)
- ✅ Built-in safety features
- ✅ Audit logs
- ✅ Better for production

**Disadvantages:**
- ❌ Less intuitive than Prisma Studio
- ❌ No Prisma schema awareness

---

## 🔍 Viewing Specific Data

### Check Click Counts

```bash
# In Prisma Studio connected to production:
# 1. Go to "Click" model
# 2. Filter by url_id to see clicks for specific URL
# 3. Count records to verify tracking is working
```

### Check Transactions

```bash
# 1. Go to "Transaction" model
# 2. Check status: SUCCESS, PENDING, or FAILED
# 3. Verify payment_id and order_id are populated
```

### Check User Plans

```bash
# 1. Go to "User" model
# 2. Check "plan" field (BASIC, PRO, CUSTOM)
# 3. Check "plan_expires_at" for expiration dates
```

---

## 🚀 Quick Commands Reference

```bash
# Local development database
bun run db:studio

# Production database (requires .env.production)
bun run db:studio:prod

# Pull latest env vars from Vercel
vercel env pull .env.production

# Generate Prisma Client
bun run db:gen

# Push schema changes (BE CAREFUL in production!)
bun run db:push
```

---

## 🐛 Troubleshooting

### "Connection refused" Error

**Problem:** Can't connect to production database

**Solutions:**
1. Check if your IP is whitelisted in MongoDB Atlas
2. Verify DATABASE_URL is correct in `.env.production`
3. Check if MongoDB Atlas cluster is running

### "Authentication failed" Error

**Problem:** Invalid credentials

**Solutions:**
1. Verify DATABASE_URL has correct username/password
2. Check if database user exists in MongoDB Atlas
3. Ensure user has proper permissions

### "Database not found" Error

**Problem:** Database name doesn't exist

**Solutions:**
1. Check database name in connection string
2. Verify database exists in MongoDB Atlas
3. Create database if needed

---

## 📝 Example Workflow

### Checking if Click Tracking Works

```bash
# 1. Pull production env
vercel env pull .env.production

# 2. Open Prisma Studio
bun run db:studio:prod

# 3. Navigate to "Click" model

# 4. Check recent clicks:
#    - Sort by created_at (descending)
#    - Verify new clicks are appearing
#    - Check ip_address, user_agent, referer fields

# 5. Navigate to "Url" model
#    - Find your test URL
#    - Note the id

# 6. Back to "Click" model
#    - Filter by url_id = [your URL id]
#    - Count total clicks for that URL
```

---

## 🎯 Summary

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **Prisma Studio (Local)** | Familiar UI, Prisma-aware | Requires local setup | Development, debugging |
| **MongoDB Atlas Dashboard** | Web-based, safe | Less intuitive | Production viewing |
| **Vercel CLI + Prisma Studio** | Easy setup, powerful | Direct prod access | Quick checks |

**Recommendation:** Use Prisma Studio for development and debugging, MongoDB Atlas Dashboard for production monitoring.

---

## 🔗 Useful Links

- [Prisma Studio Docs](https://www.prisma.io/docs/concepts/components/prisma-studio)
- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)

---

**Last Updated:** 2026-01-04  
**Status:** ✅ Ready to use
