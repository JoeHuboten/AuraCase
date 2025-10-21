@echo off
echo ========================================
echo  AuraCase PostgreSQL Setup Script
echo ========================================
echo.

echo Step 1: Pulling environment variables from Vercel...
call vercel env pull
echo.

echo Step 2: Generating Prisma Client...
call npx prisma generate
echo.

echo Step 3: Pushing database schema to PostgreSQL...
call npx prisma db push
echo.

echo Step 4: Seeding database with initial data...
call npm run prisma:seed
echo.

echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Your database is now configured with PostgreSQL!
echo.
echo Next steps:
echo 1. Run: npm run dev (to test locally)
echo 2. Run: npx prisma studio (to view your data)
echo 3. Run: vercel --prod (to deploy to production)
echo.
pause
