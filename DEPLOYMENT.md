# 🚀 Deployment Guide - AuraCase

Ръководство за публикуване на вашия магазин в production.

## 🎯 Преди deployment

### Контролен списък:

- [ ] Проектът работи локално без грешки
- [ ] Базата данни е настроена и тествана
- [ ] Environment variables са подготвени
- [ ] Всички функции са тествани
- [ ] Безопасността е проверена

---

## 🌐 Вариант 1: Vercel (Препоръчва се)

Vercel е най-лесният начин да deploy-нете Next.js приложение.

### Стъпки:

1. **Push кода в GitHub**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/auracase.git
git push -u origin main
```

2. **Създайте акаунт в Vercel**
   - Отидете на [vercel.com](https://vercel.com)
   - Влезте с GitHub акаунта си

3. **Import проекта**
   - Click "Add New" → "Project"
   - Изберете вашето GitHub репо
   - Click "Import"

4. **Конфигурирайте Environment Variables**

Добавете следните променливи в Vercel:

```env
DATABASE_URL=your_production_database_url
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://your-app.vercel.app
```

5. **Deploy**
   - Click "Deploy"
   - Изчакайте 2-3 минути
   - Готово! 🎉

### Автоматичен deployment

Vercel автоматично ще deploy-ва при всеки push към main branch.

---

## 🐳 Вариант 2: Docker + DigitalOcean/AWS

### Създайте Dockerfile:

```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "start"]
```

### Build и run:

```bash
docker build -t auracase .
docker run -p 3000:3000 auracase
```

---

## ☁️ Вариант 3: Railway

Railway е лесна cloud платформа с автоматичен deployment.

### Стъпки:

1. **Отидете на [railway.app](https://railway.app)**
2. **Създайте нов проект**
   - Click "New Project"
   - Изберете "Deploy from GitHub repo"
3. **Добавете PostgreSQL база данни**
   - Click "New" → "Database" → "PostgreSQL"
   - Копирайте connection string
4. **Конфигурирайте environment variables**

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=${{RAILWAY_PUBLIC_DOMAIN}}
```

5. **Deploy**
   - Railway автоматично ще deploy-не проекта

---

## 🗄️ База данни за Production

### Вариант 1: Supabase (Препоръчва се)

**Безплатен план:** 500MB база данни

1. Създайте проект на [supabase.com](https://supabase.com)
2. Копирайте connection string
3. Добавете в environment variables
4. Run migrations:

```bash
npx prisma migrate deploy
```

### Вариант 2: Railway PostgreSQL

**Безплатен план:** 1GB база данни

1. Добавете PostgreSQL в Railway проекта
2. Connection string автоматично се добавя
3. Run migrations

### Вариант 3: Neon

**Безплатен план:** 3GB база данни

1. Създайте проект на [neon.tech](https://neon.tech)
2. Копирайте connection string
3. Добавете в environment variables

---

## 🔐 Сигурност преди Production

### 1. Environment Variables

**НИКОГА не commit-вайте `.env` файлове!**

Проверете `.gitignore`:

```
.env
.env.local
.env*.local
```

### 2. NEXTAUTH_SECRET

Генерирайте силен secret:

```bash
openssl rand -base64 32
```

### 3. Database Security

- Използвайте силни пароли
- Enable SSL за database connections
- Restrict IP access (ако е възможно)

### 4. CORS и CSP

Добавете в `next.config.mjs`:

```js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
        ],
      },
    ]
  },
}
```

---

## ⚡ Performance Optimization

### 1. Image Optimization

Next.js автоматично оптимизира изображенията.

Конфигурирайте в `next.config.mjs`:

```js
module.exports = {
  images: {
    domains: ['your-cdn-domain.com'],
    formats: ['image/avif', 'image/webp'],
  },
}
```

### 2. Caching

Добавете caching headers:

```ts
export const revalidate = 3600 // Revalidate every hour
```

### 3. Database Connection Pooling

За production, използвайте connection pooling:

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?pgbouncer=true"
```

---

## 📊 Monitoring

### 1. Vercel Analytics

Автоматично включен на Vercel.

### 2. Sentry (Error tracking)

```bash
npm install @sentry/nextjs
```

### 3. Google Analytics

Добавете в `app/layout.tsx`:

```tsx
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions

Създайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm run build
      - run: npm test
```

---

## 🌍 Custom Domain

### На Vercel:

1. Отидете в Settings → Domains
2. Добавете вашия domain
3. Конфигурирайте DNS records:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Обновете NEXTAUTH_URL:

```env
NEXTAUTH_URL=https://yourdomain.com
```

---

## 📝 Post-Deployment Checklist

След deployment:

- [ ] Тествайте всички страници
- [ ] Проверете автентикацията
- [ ] Тествайте количката
- [ ] Проверете mobile версията
- [ ] Тествайте checkout процеса
- [ ] Проверете админ панела
- [ ] Setup мониторинг
- [ ] Setup backups за базата данни
- [ ] SSL сертификат (автоматичен на Vercel)
- [ ] Тествайте performance (PageSpeed Insights)

---

## 🆘 Troubleshooting

### Build грешки на Vercel

```bash
# Тествайте build локално
npm run build

# Проверете за TypeScript грешки
npm run lint
```

### Database connection грешки

- Проверете дали DATABASE_URL е правилен
- Vercel изисква SSL: добавете `?sslmode=require`
- Проверете firewall правилата на базата данни

### 404 грешки след deployment

- Проверете дали всички файлове са commit-нати
- Проверете `.gitignore` за случайно игнорирани файлове

---

## 💰 Pricing Estimates

### Препоръчана Setup (Безплатно за старт):

- **Hosting:** Vercel Free (Unlimited бандвидт)
- **Database:** Supabase Free (500MB)
- **Domain:** ~10-15 лв/година

### При растеж:

- **Vercel Pro:** $20/месец
- **Supabase Pro:** $25/месец
- **Total:** ~$45/месец за малък/среден бизнес

---

## 🎉 Готово!

Вашият магазин е live! Не забравяйте:

1. 📢 Споделете с приятели
2. 🔍 SEO оптимизация
3. 📊 Setup analytics
4. 💳 Добавете payment gateway
5. 📧 Email notifications
6. 🚀 Продължете да развивате!

---

**Успешен deployment! 🚀**

