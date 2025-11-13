@echo off
echo ========================================
echo  AuraCase - Local PostgreSQL Setup
echo ========================================
echo.

echo Step 1: Creating database and user...
echo Please enter your PostgreSQL password when prompted
echo.

psql -U postgres -c "CREATE DATABASE auracase;"
psql -U postgres -c "CREATE USER auracase_user WITH PASSWORD 'auracase123';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE auracase TO auracase_user;"
psql -U postgres -d auracase -c "GRANT ALL ON SCHEMA public TO auracase_user;"

echo.
echo Step 2: Generating Prisma Client...
call npx prisma generate

echo.
echo Step 3: Creating database tables...
call npx prisma db push

echo.
echo Step 4: Seeding database with products...
call npm run prisma:seed

echo.
echo ========================================
echo  Setup Complete!
echo ========================================
echo.
echo Database created: auracase
echo Username: auracase_user
echo Password: auracase123
echo.
echo Your DATABASE_URL:
echo postgresql://auracase_user:auracase123@localhost:5432/auracase
echo.
echo Next steps:
echo 1. Run: npm run dev
echo 2. Visit: http://localhost:3000
echo.
pause
