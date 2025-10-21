@echo off
REM AuraCase Docker Setup Script for Windows
REM This script helps you set up the AuraCase project with Docker

echo 🐳 AuraCase Docker Setup
echo =========================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    echo Visit: https://docs.docker.com/desktop/windows/install/
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    echo Visit: https://docs.docker.com/compose/install/
    pause
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    (
        echo DATABASE_URL=postgresql://postgres:password123@postgres:5432/auracase
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo NEXTAUTH_URL=http://localhost:3000
    ) > .env
    echo ✅ .env file created
) else (
    echo ✅ .env file already exists
)

REM Ask user for setup type
echo.
echo Choose setup type:
echo 1^) Production setup ^(optimized for production^)
echo 2^) Development setup ^(with hot reloading^)
echo 3^) Both
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo 🚀 Setting up production environment...
    docker-compose up --build -d
) else if "%choice%"=="2" (
    echo 🛠️ Setting up development environment...
    docker-compose -f docker-compose.dev.yml up --build -d
) else if "%choice%"=="3" (
    echo 🚀 Setting up both environments...
    echo Starting production environment...
    docker-compose up --build -d
    echo Starting development environment...
    docker-compose -f docker-compose.dev.yml up --build -d
) else (
    echo ❌ Invalid choice. Exiting.
    pause
    exit /b 1
)

echo.
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service status...
docker-compose ps

echo.
echo 🎉 Setup complete!
echo.
echo 📱 Access your application:
echo    - Website: http://localhost:3000
echo    - Database: localhost:5432
echo.
echo 🔧 Useful commands:
echo    - View logs: docker-compose logs
echo    - Stop services: docker-compose down
echo    - Restart: docker-compose restart
echo    - Database shell: docker-compose exec postgres psql -U postgres -d auracase
echo.
echo 📚 For more information, see DOCKER_SETUP.md
pause
