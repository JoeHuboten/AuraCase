# 🐳 Docker Setup for AuraCase

This guide will help you set up and run the AuraCase project using Docker on any device.

## 📋 Prerequisites

Before you begin, make sure you have the following installed on your system:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)

### Installing Docker

#### Windows:
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Run the installer and follow the setup wizard
3. Restart your computer when prompted

#### macOS:
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Drag Docker to your Applications folder
3. Launch Docker Desktop

#### Linux (Ubuntu/Debian):
```bash
# Update package index
sudo apt update

# Install Docker
sudo apt install docker.io docker-compose

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group (optional)
sudo usermod -aG docker $USER
```

## 🚀 Quick Start

### 1. Clone the Project
```bash
git clone <your-repository-url>
cd AuraCase
```

### 2. Environment Setup
Create a `.env` file in the project root:
```bash
# Copy the example environment file
cp env.example .env
```

Edit the `.env` file with your preferred settings:
```env
DATABASE_URL=postgresql://postgres:password123@postgres:5432/auracase
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

### 3. Build and Run with Docker Compose
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode (background)
docker-compose up --build -d
```

### 4. Access the Application
- **Website**: http://localhost:3000
- **Database**: localhost:5432 (PostgreSQL)

## 🔧 Docker Commands

### Basic Commands
```bash
# Start services
docker-compose up

# Start in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs

# View logs for specific service
docker-compose logs app
docker-compose logs postgres

# Rebuild and start
docker-compose up --build

# Stop and remove everything (including volumes)
docker-compose down -v
```

### Database Commands
```bash
# Access database shell
docker-compose exec postgres psql -U postgres -d auracase

# Run Prisma commands
docker-compose exec app npx prisma studio
docker-compose exec app npx prisma db push
docker-compose exec app npx prisma db seed
```

### Development Commands
```bash
# Run in development mode
docker-compose -f docker-compose.dev.yml up

# Install new dependencies
docker-compose exec app npm install <package-name>

# Run tests
docker-compose exec app npm test
```

## 📁 Project Structure

```
AuraCase/
├── Dockerfile              # Docker image configuration
├── docker-compose.yml      # Multi-container setup
├── .dockerignore          # Files to exclude from Docker build
├── DOCKER_SETUP.md        # This file
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts           # Database seeding
├── app/                   # Next.js app directory
├── components/            # React components
└── public/               # Static assets
```

## 🗄️ Database

The setup includes a PostgreSQL database with:
- **Database**: auracase
- **Username**: postgres
- **Password**: password123
- **Port**: 5432

### Database Persistence
Data is persisted using Docker volumes. The database data will survive container restarts.

### Reset Database
```bash
# Stop services and remove volumes
docker-compose down -v

# Start fresh
docker-compose up --build
```

## 🔒 Security Notes

### Production Deployment
For production deployment, make sure to:

1. **Change default passwords**:
   ```env
   POSTGRES_PASSWORD=your-secure-password
   JWT_SECRET=your-very-secure-jwt-secret
   ```

2. **Use environment variables**:
   ```bash
   # Create production environment file
   cp .env .env.production
   # Edit with production values
   ```

3. **Enable SSL/TLS** for database connections

4. **Use secrets management** for sensitive data

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Check what's using port 3000
netstat -tulpn | grep :3000

# Kill the process or change port in docker-compose.yml
```

#### Database Connection Issues
```bash
# Check if database is running
docker-compose ps

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

#### Build Issues
```bash
# Clean build
docker-compose down
docker system prune -a
docker-compose up --build
```

#### Permission Issues (Linux)
```bash
# Fix file permissions
sudo chown -R $USER:$USER .
chmod +x start.sh
```

### Logs and Debugging
```bash
# View all logs
docker-compose logs

# Follow logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f postgres
```

## 📦 Alternative: Development Setup

For development with hot reloading, create `docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: auracase-db-dev
    environment:
      POSTGRES_DB: auracase
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data_dev:/var/lib/postgresql/data

  app:
    build:
      context: .
      target: development
    container_name: auracase-app-dev
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password123@postgres:5432/auracase
      - JWT_SECRET=dev-jwt-secret
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - postgres
    command: npm run dev

volumes:
  postgres_data_dev:
```

## 🎯 Next Steps

1. **Customize Environment**: Edit `.env` file with your preferences
2. **Add Your Data**: Modify `prisma/seed.ts` with your products
3. **Deploy**: Use the same Docker setup for production deployment
4. **Monitor**: Set up logging and monitoring for production use

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. View the logs: `docker-compose logs`
3. Ensure all prerequisites are installed
4. Try rebuilding: `docker-compose up --build`

---

**Happy coding! 🚀**
