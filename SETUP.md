# Setup Instructions for AuraCase

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/auracase?schema=public"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

3. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Setup (Optional)

### For Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database named `auracase`
3. Update the `DATABASE_URL` in `.env` file
4. Run Prisma migrations:
   ```bash
   npm run prisma:push
   ```

### For Cloud Database (Recommended)

You can use services like:
- **Vercel Postgres** (Easiest if deploying on Vercel)
- **Supabase** (Free tier available)
- **Railway** (PostgreSQL hosting)
- **Neon** (Serverless PostgreSQL)

Update the `DATABASE_URL` with your cloud database connection string.

## Adding Product Images

Currently, the site uses placeholder SVG images. To add real product images:

1. **Add images to the public folder**
   - Product images: `public/products/`
   - Category images: `public/categories/`
   - Brand logos: `public/brands/`

2. **Update mockData.ts**
   
   Replace the placeholder paths in `lib/mockData.ts`:
   ```typescript
   // Change from
   image: '/placeholder.svg',
   images: ['/placeholder.svg'],
   
   // To
   image: '/products/your-product-image.jpg',
   images: ['/products/image1.jpg', '/products/image2.jpg'],
   ```

3. **Recommended Image Sizes**
   - Product cards: 400x400px
   - Product detail images: 800x800px
   - Category banners: 1200x600px
   - Brand logos: 200x80px (transparent background)

## NextAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env` file

### Email/Password Authentication

For production, implement proper password hashing:
```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

Update the credentials provider in `app/api/auth/[...nextauth]/route.ts`

## Production Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Customization

### Colors

Update the color scheme in `tailwind.config.ts`:
```typescript
colors: {
  primary: {
    DEFAULT: '#your-color',
    dark: '#your-darker-color',
    light: '#your-lighter-color',
  },
  accent: {
    DEFAULT: '#your-accent-color',
    // ...
  },
}
```

### Products

Edit `lib/mockData.ts` to add, remove, or modify products.

### Pages

All pages are in the `app/` directory using Next.js App Router.

## Troubleshooting

### Build Errors

If you encounter TypeScript errors:
```bash
npm run build
```

### Database Connection Issues

Ensure your PostgreSQL database is running and the connection string is correct.

### Module Not Found

Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

