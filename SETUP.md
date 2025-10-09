# 🚀 Ръководство за настройка на AuraCase

Това е подробно ръководство за настройка и стартиране на проекта AuraCase.

## 📋 Предварителни изисквания

1. **Инсталирайте Node.js**
   - Изтеглете и инсталирайте Node.js от [nodejs.org](https://nodejs.org/)
   - Препоръчителна версия: 18.x или по-нова
   - Проверете инсталацията:
     ```bash
     node --version
     npm --version
     ```

2. **Инсталирайте PostgreSQL** (опционално за локална разработка)
   - Изтеглете от [postgresql.org](https://www.postgresql.org/download/)
   - Или използвайте cloud решение като [Supabase](https://supabase.com/) или [Railway](https://railway.app/)

## 🔧 Стъпка по стъпка настройка

### 1. Инсталиране на зависимости

Отворете терминал в директорията на проекта и изпълнете:

```bash
npm install
```

Това ще инсталира всички необходими пакети.

### 2. Настройка на environment variables

Създайте `.env` файл в root директорията на проекта:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# Mac/Linux
cp .env.example .env
```

Редактирайте `.env` файла и попълнете необходимите стойности:

```env
# Database - Ще бъде нужно когато решите да настроите базата данни
DATABASE_URL="postgresql://username:password@localhost:5432/auracase"

# NextAuth Secret - Генерирайте random ключ
NEXTAUTH_SECRET="your-super-secret-key-change-this"
NEXTAUTH_URL="http://localhost:3002"
```

**Генериране на NEXTAUTH_SECRET:**

```bash
# Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((1..32 | ForEach-Object { [char](Get-Random -Minimum 65 -Maximum 122) }) -join ''))

# Mac/Linux
openssl rand -base64 32
```

### 3. Стартиране на приложението (БЕЗ база данни)

Засега можете да стартирате приложението без база данни, за да видите UI:

```bash
npm run dev
```

Отворете браузър на адрес: [http://localhost:3002](http://localhost:3002)

⚠️ **Забележка:** Без база данни ще работят само статичните страници. Автентикацията и динамичните данни няма да работят.

---

## 🗄️ Настройка на база данни (когато сте готови)

### Вариант 1: Използване на cloud база данни (ПРЕПОРЪЧИТЕЛНО)

#### Supabase (безплатно)

1. Отидете на [supabase.com](https://supabase.com/)
2. Създайте нов проект
3. В Settings → Database намерете connection string
4. Копирайте го в `.env` файла като `DATABASE_URL`

#### Railway (безплатно)

1. Отидете на [railway.app](https://railway.app/)
2. Създайте нов проект
3. Добавете PostgreSQL database
4. Копирайте connection string в `.env`

### Вариант 2: Локална PostgreSQL база данни

1. **Инсталирайте PostgreSQL**
   - Windows: Изтеглете от [postgresql.org](https://www.postgresql.org/download/windows/)
   - Mac: `brew install postgresql`

2. **Създайте база данни:**

```bash
# Влезте в PostgreSQL
psql -U postgres

# Създайте база данни
CREATE DATABASE auracase;

# Излезте
\q
```

3. **Обновете `.env` файла:**

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/auracase"
```

### След настройка на базата данни:

1. **Генерирайте Prisma клиент:**

```bash
npm run db:generate
```

2. **Създайте таблиците в базата данни:**

```bash
npm run db:push
```

3. **Seed базата данни с примерни данни:**

```bash
npm run db:seed
```

Това ще създаде:
- Админ потребител: `admin@auracase.com` / `admin123`
- Тестов потребител: `user@example.com` / `user123`
- Категории (Кейсове, Протектори, Зарядни и др.)
- Примерни продукти

4. **Отворете Prisma Studio (опционално):**

```bash
npm run db:studio
```

Това ще отвори визуален интерфейс на [http://localhost:5555](http://localhost:5555) за управление на базата данни.

---

## 📱 Тестване на приложението

След успешна настройка:

1. **Посетете началната страница:** http://localhost:3000
2. **Разгледайте продуктите:** http://localhost:3000/products
3. **Влезте като админ:** 
   - Email: `admin@auracase.com`
   - Password: `admin123`
4. **Влезте в админ панела:** http://localhost:3000/admin

---

## 🛠️ Полезни команди

```bash
# Стартиране на dev сървър
npm run dev

# Build за production
npm run build

# Стартиране на production сървър
npm start

# Проверка за lint грешки
npm run lint

# Prisma команди
npm run db:generate    # Генерира Prisma клиент
npm run db:push       # Push на schema в базата данни
npm run db:seed       # Seed на базата данни с данни
npm run db:studio     # Отваря Prisma Studio
```

---

## 🐛 Troubleshooting

### Node.js не е намерен

**Проблем:** `node is not recognized as an internal or external command`

**Решение:**
1. Уверете се, че Node.js е инсталиран от [nodejs.org](https://nodejs.org/)
2. Рестартирайте компютъра след инсталация
3. Проверете PATH променливите

### Грешка при npm install

**Проблем:** `Error during npm install`

**Решение:**
```bash
# Изтрийте node_modules и package-lock.json
rm -rf node_modules package-lock.json

# Опитайте отново
npm install
```

### Грешка при свързване с база данни

**Проблем:** `Can't reach database server`

**Решение:**
1. Проверете дали `DATABASE_URL` в `.env` е правилен
2. Уверете се, че PostgreSQL сървърът работи
3. Проверете firewall настройките

### Port 3000 вече се използва

**Проблем:** `Port 3000 is already in use`

**Решение:**
```bash
# Стартирайте на друг порт
PORT=3001 npm run dev
```

---

## 📚 Допълнителни ресурси

- [Next.js документация](https://nextjs.org/docs)
- [Prisma документация](https://www.prisma.io/docs)
- [NextAuth.js документация](https://next-auth.js.org/)
- [Tailwind CSS документация](https://tailwindcss.com/docs)

---

## 🆘 Нужда от помощ?

Ако имате проблеми:
1. Проверете този файл отново
2. Прочетете README.md
3. Проверете документацията на използваните технологии
4. Създайте issue в GitHub репото (ако има такова)

---

**Успешна работа с AuraCase! 🎉**

