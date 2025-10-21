@echo off
REM 🚀 AuraCase Setup Script for Windows
REM This script sets up the project on a new Windows device

echo 🚀 Setting up AuraCase...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo ✅ Dependencies installed

REM Check if .env exists
if not exist ".env" (
    echo 🔧 Creating .env file...
    
    REM Generate JWT secret
    for /f %%i in ('node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"') do set JWT_SECRET=%%i
    
    echo DATABASE_URL="file:./dev.db" > .env
    echo JWT_SECRET="%JWT_SECRET%" >> .env
    
    echo ✅ .env file created with JWT secret
) else (
    echo ✅ .env file already exists
)

REM Generate Prisma client
echo 🔧 Generating Prisma client...
npx prisma generate

if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

echo ✅ Prisma client generated

REM Setup database
echo 🗄️ Setting up database...
npx prisma db push

if %errorlevel% neq 0 (
    echo ❌ Failed to setup database
    pause
    exit /b 1
)

echo ✅ Database setup complete

REM Seed database
echo 🌱 Seeding database...
npm run prisma:seed

if %errorlevel% neq 0 (
    echo ❌ Failed to seed database
    pause
    exit /b 1
)

echo ✅ Database seeded with sample data

echo.
echo 🎉 Setup complete! You can now run:
echo    npm run dev
echo.
echo The application will be available at: http://localhost:3000
echo.
echo Default admin account:
echo    Email: admin@auracase.com
echo    Password: admin123
echo.
pause
