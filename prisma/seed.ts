import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Започва seed на базата данни...')

  // Създаване на админ потребител
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@auracase.com' },
    update: {},
    create: {
      email: 'admin@auracase.com',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Админ потребител създаден:', admin.email)

  // Създаване на тестов потребител
  const userPassword = await bcrypt.hash('user123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Test User',
      password: userPassword,
      role: 'USER',
    },
  })
  console.log('✅ Тестов потребител създаден:', user.email)

  // Създаване на категории
  const categories = [
    {
      name: 'Кейсове и калъфи',
      slug: 'cases',
      description: 'Защитете телефона си с стил',
    },
    {
      name: 'Стъклени протектори',
      slug: 'screen-protectors',
      description: 'Максимална защита за екрана',
    },
    {
      name: 'Зарядни устройства',
      slug: 'chargers',
      description: 'Бързо и безопасно зареждане',
    },
    {
      name: 'Слушалки',
      slug: 'headphones',
      description: 'Перфектен звук навсякъде',
    },
    {
      name: 'Кабели',
      slug: 'cables',
      description: 'Издръжливи и качествени кабели',
    },
  ]

  const createdCategories = []
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
    createdCategories.push(created)
    console.log('✅ Категория създадена:', created.name)
  }

  // Създаване на примерни продукти
  const products = [
    {
      name: 'Силиконов кейс за iPhone 14 Pro - Черен',
      slug: 'silicone-case-iphone-14-pro-black',
      description: 'Висококачествен силиконов кейс с мека текстура и перфектно прилягане. Защитава устройството ви от удари и драскотини.',
      price: 29.99,
      salePrice: 24.99,
      images: ['/images/products/case-1.jpg'],
      stock: 15,
      featured: true,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Стъклен протектор Samsung Galaxy S23 Ultra',
      slug: 'glass-protector-samsung-s23-ultra',
      description: '9H твърдост, пълно покритие на екрана, олеофобно покритие.',
      price: 19.99,
      salePrice: null,
      images: ['/images/products/protector-1.jpg'],
      stock: 30,
      featured: false,
      categoryId: createdCategories[1].id,
    },
    {
      name: 'Безжично зарядно устройство 15W',
      slug: 'wireless-charger-15w',
      description: 'Бързо зареждане за всички съвместими устройства. Компактен дизайн.',
      price: 49.99,
      salePrice: 39.99,
      images: ['/images/products/charger-1.jpg'],
      stock: 8,
      featured: true,
      categoryId: createdCategories[2].id,
    },
    {
      name: 'TWS Bluetooth слушалки',
      slug: 'tws-bluetooth-earbuds',
      description: 'Премиум звук, активно шумопотискане, до 24 часа работа.',
      price: 89.99,
      salePrice: 69.99,
      images: ['/images/products/earbuds-1.jpg'],
      stock: 12,
      featured: true,
      categoryId: createdCategories[3].id,
    },
    {
      name: 'USB-C кабел 2м - Черен',
      slug: 'usb-c-cable-2m-black',
      description: 'Издръжлив плетен кабел с бързо зареждане до 60W.',
      price: 14.99,
      salePrice: null,
      images: ['/images/products/cable-1.jpg'],
      stock: 50,
      featured: false,
      categoryId: createdCategories[4].id,
    },
    {
      name: 'Прозрачен кейс Xiaomi 13 Pro',
      slug: 'clear-case-xiaomi-13-pro',
      description: 'Ultra тънък прозрачен кейс с защита от пожълтяване.',
      price: 24.99,
      salePrice: null,
      images: ['/images/products/case-2.jpg'],
      stock: 20,
      featured: false,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Магнитна поставка за кола',
      slug: 'magnetic-car-mount',
      description: '360° въртене, силни магнити, универсална съвместимост.',
      price: 19.99,
      salePrice: 15.99,
      images: ['/images/products/mount-1.jpg'],
      stock: 25,
      featured: false,
      categoryId: createdCategories[0].id,
    },
    {
      name: 'Защитен кейс с вградена поставка iPhone 13',
      slug: 'kickstand-case-iphone-13',
      description: 'Двоен слой защита, вградена поставка за гледане.',
      price: 34.99,
      salePrice: null,
      images: ['/images/products/case-3.jpg'],
      stock: 18,
      featured: false,
      categoryId: createdCategories[0].id,
    },
  ]

  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
    console.log('✅ Продукт създаден:', created.name)
  }

  console.log('🎉 Seed завършен успешно!')
}

main()
  .catch((e) => {
    console.error('❌ Грешка при seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

