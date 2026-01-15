# ⚡ Quick Vercel Setup Checklist

## Current Status: ✅ Deployed to Vercel!

Your AuraCase app is deploying now. Here's what you need to do after it completes:

---

## Step 1: Create Database (5 minutes)

1. Open: https://vercel.com/dashboard
2. Click on **auracase** project
3. Go to **Storage** tab (top menu)
4. Click **Create Database** → **Postgres**
5. Name: `auracase-db`
6. Region: **Frankfurt (Europe)** or **Stockholm** (closest to Bulgaria)
7. Click **Create**

✅ Vercel will automatically add `POSTGRES_PRISMA_URL` environment variable

---

## Step 2: Add Environment Variables (5 minutes)

Go to: **Settings** → **Environment Variables**

### Copy-paste these (already generated for you):

#### JWT_SECRET
```
fjMf3bn2EZ4yKDYeDDIizoUtsHFgR6jatU7+2RYkPhc=
```

#### NEXTAUTH_SECRET
```
VW2Z+OF+spMSd/kWuC8Agddf0PnkS6D5pICbYYxSPo0=
```

#### DATABASE_URL
```
Copy the value from POSTGRES_PRISMA_URL (automatically created when you made the database)
```

#### NEXTAUTH_URL
```
https://auracase.vercel.app
(or whatever your domain is)
```

#### NODE_ENV
```
production
```

For each variable:
1. Click **Add New**
2. Name: `JWT_SECRET` (for example)
3. Value: (paste the value above)
4. Environment: **Production** only
5. Click **Save**

---

## Step 3: Redeploy After Adding Variables (2 minutes)

After adding all variables:

1. Go to **Deployments** tab
2. Click the **...** (three dots) on latest deployment
3. Click **Redeploy**
4. Check **Use existing build cache**
5. Click **Redeploy**

---

## Step 4: Run Database Migrations (3 minutes)

After successful deployment, run locally:

```bash
# Pull production environment variables
vercel env pull .env.local

# Run migrations on production database
npx prisma migrate deploy

# Seed database with categories and products
npx prisma db seed
```

---

## Step 5: Test Your Site! (2 minutes)

1. Open: https://auracase.vercel.app
2. Check homepage loads
3. Try signing up for an account
4. Browse products

---

## Optional: Add Payment Keys

If you want to accept payments now:

### Stripe (recommended)
1. Get keys from: https://dashboard.stripe.com/apikeys
2. Add to Vercel environment variables:
   - `STRIPE_PUBLISHABLE_KEY` (starts with pk_)
   - `STRIPE_SECRET_KEY` (starts with sk_)

### PayPal
1. Get keys from: https://developer.paypal.com/
2. Add to Vercel environment variables:
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_MODE` = `live`

---

## Need Help?

Check deployment logs:
```bash
vercel logs
```

Or view in dashboard:
https://vercel.com/nikolays-projects-bedcf89a/auracase

---

## Your Deployment Info

- **Project**: auracase
- **Account**: nikolays-projects-bedcf89a
- **Production URL**: https://auracase.vercel.app
- **Dashboard**: https://vercel.com/nikolays-projects-bedcf89a/auracase

---

**Total setup time: ~15-20 minutes**

🎉 **You're almost done!** Just follow steps 1-4 above.
