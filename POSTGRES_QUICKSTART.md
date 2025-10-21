# 🚀 Quick Start: Vercel Postgres Setup

## For the FASTEST setup, follow these steps:

### 1️⃣ Create Vercel Postgres Database (2 minutes)

Open this URL in your browser:
```
https://vercel.com/nikolays-projects-bedcf89a/auracase/stores
```

Click: **Create Database** → **Postgres** → Name it `auracase-db` → **Create**

Click: **Connect Project** → Select `auracase` → **Connect**

---

### 2️⃣ Update Your Environment Variable (1 minute)

**In Vercel Dashboard:**
1. Go to: https://vercel.com/nikolays-projects-bedcf89a/auracase/settings/environment-variables
2. Find the variable `POSTGRES_PRISMA_URL` (copy its value)
3. Find your existing `DATABASE_URL` variable
4. Click "Edit" and replace its value with `POSTGRES_PRISMA_URL` value
5. Make sure it's enabled for: **Production**, **Preview**, and **Development**

---

### 3️⃣ Run Setup Script (2 minutes)

Open PowerShell in your project folder and run:

```powershell
# Pull the database connection string
vercel env pull

# Run the automated setup
./setup-postgres.bat
```

This will:
- ✅ Pull environment variables from Vercel
- ✅ Generate Prisma Client for PostgreSQL
- ✅ Create all database tables
- ✅ Add sample products and categories

---

### 4️⃣ Deploy to Production (1 minute)

```powershell
vercel --prod
```

---

## ✅ That's it! Your database is now PostgreSQL!

### Verify Everything Works:

**Test Locally:**
```bash
npm run dev
# Visit: http://localhost:3000
```

**View Database:**
```bash
npx prisma studio
# Opens visual database browser
```

**Check Production:**
Visit: https://auracase-n66rn7kl4-nikolays-projects-bedcf89a.vercel.app

---

## 🆘 Having Issues?

### Issue: "Can't reach database server"
**Solution:** Make sure you pulled env variables:
```bash
vercel env pull
```

### Issue: "Invalid DATABASE_URL"
**Solution:** 
1. Check your `.env.local` file - should have `DATABASE_URL="postgresql://..."`
2. Make sure you updated the Vercel dashboard variable

### Issue: "Table doesn't exist"
**Solution:** Run migrations:
```bash
npx prisma db push
npm run prisma:seed
```

### Issue: "Deployment failed"
**Solution:** Make sure `DATABASE_URL` is set in all Vercel environments:
- Go to Settings → Environment Variables
- Edit `DATABASE_URL` 
- Check: ✅ Production ✅ Preview ✅ Development

---

## 📊 Database Management

**View all data:**
```bash
npx prisma studio
```

**Reset database:**
```bash
npx prisma db push --force-reset
npm run prisma:seed
```

**See database schema:**
```bash
npx prisma db pull
```

---

## 💡 Pro Tips

1. **Backup your data:** Vercel Postgres has automatic backups
2. **Monitor usage:** Check usage in Vercel dashboard → Storage tab
3. **Scale up:** Upgrade your plan if you need more storage/connections
4. **Connection pooling:** Vercel Postgres includes connection pooling automatically

---

Need more detailed instructions? See: `POSTGRES_SETUP_GUIDE.md`
