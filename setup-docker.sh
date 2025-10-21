#!/bin/bash

# AuraCase Docker Setup Script
# This script helps you set up the AuraCase project with Docker

set -e

echo "🐳 AuraCase Docker Setup"
echo "========================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
DATABASE_URL=postgresql://postgres:password123@postgres:5432/auracase
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Ask user for setup type
echo ""
echo "Choose setup type:"
echo "1) Production setup (optimized for production)"
echo "2) Development setup (with hot reloading)"
echo "3) Both"
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🚀 Setting up production environment..."
        docker-compose up --build -d
        ;;
    2)
        echo "🛠️ Setting up development environment..."
        docker-compose -f docker-compose.dev.yml up --build -d
        ;;
    3)
        echo "🚀 Setting up both environments..."
        echo "Starting production environment..."
        docker-compose up --build -d
        echo "Starting development environment..."
        docker-compose -f docker-compose.dev.yml up --build -d
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
docker-compose ps

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📱 Access your application:"
echo "   - Website: http://localhost:3000"
echo "   - Database: localhost:5432"
echo ""
echo "🔧 Useful commands:"
echo "   - View logs: docker-compose logs"
echo "   - Stop services: docker-compose down"
echo "   - Restart: docker-compose restart"
echo "   - Database shell: docker-compose exec postgres psql -U postgres -d auracase"
echo ""
echo "📚 For more information, see DOCKER_SETUP.md"
