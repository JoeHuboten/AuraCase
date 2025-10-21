# 🚀 AuraCase Deployment Guide

## 📋 Prerequisites

Before running the project on a new device, ensure you have:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

## 🔧 Installation Steps

### 1. Copy Project Files
Copy all project files to the new device, **EXCLUDING** these folders:
- `node_modules/` (will be recreated)
- `.next/` (build cache, will be recreated)
- `dev.db` (database file, will be recreated)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the project root with:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-here"
```

**Generate a new JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Create and seed database
npx prisma db push
npm run prisma:seed
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at: `http://localhost:3000`

## 🗂️ Project Structure

```
AuraCase/
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utility functions
├── prisma/                 # Database schema and migrations
├── store/                  # Zustand state management
├── public/                 # Static assets
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
└── README.md              # Project documentation
```

## 🔑 Default Admin Account

After seeding the database, you can log in with:
- **Email:** admin@auracase.com
- **Password:** admin123

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database with sample data

## 🐛 Troubleshooting

### Common Issues:

1. **Port 3000 already in use:**
   ```bash
   # Kill process using port 3000
   npx kill-port 3000
   ```

2. **Database connection errors:**
   ```bash
   # Reset database
   rm prisma/dev.db
   npx prisma db push
   npm run prisma:seed
   ```

3. **Node modules issues:**
   ```bash
   # Clean install
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Prisma client out of sync:**
   ```bash
   npx prisma generate
   ```

## 🌐 Production Deployment

For production deployment:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Set production environment variables:**
   ```env
   DATABASE_URL="your-production-database-url"
   JWT_SECRET="your-production-jwt-secret"
   NODE_ENV="production"
   ```

3. **Start production server:**
   ```bash
   npm run start
   ```

## 📱 Features

- ✅ E-commerce functionality
- ✅ User authentication
- ✅ Shopping cart (guest + logged in users)
- ✅ Admin panel
- ✅ Order management
- ✅ Responsive design
- ✅ Dark theme

## 🆘 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify all environment variables are set
3. Ensure database is properly seeded
4. Check that all dependencies are installed

---

**Happy coding! 🎉**
