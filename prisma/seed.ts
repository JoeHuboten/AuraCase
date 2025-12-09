import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Phone Cases',
        slug: 'phone-cases',
        description: 'Protective and stylish cases for your device',
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=600&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Screen Protectors',
        slug: 'screen-protectors',
        description: 'Keep your screen scratch-free',
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=600&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Wireless Earphones',
        slug: 'wireless-earphones',
        description: 'Premium sound quality',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=600&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Chargers & Cables',
        slug: 'chargers-cables',
        description: 'Fast charging solutions',
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Power Banks',
        slug: 'power-banks',
        description: 'Portable power on the go',
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=600&fit=crop',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Adapters',
        slug: 'adapters',
        description: 'Universal connectivity solutions',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create products
  const products = await Promise.all([
    // Phone Cases (6 products)
    prisma.product.create({
      data: {
        name: 'Premium Leather Case',
        slug: 'premium-leather-case',
        description: 'Handcrafted genuine leather case with card slots and premium finish.',
        price: 45,
        oldPrice: 70,
        discount: 36,
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop',
        categoryId: categories[0].id,
        colors: 'Black, Brown, Navy',
        sizes: 'iPhone 14, iPhone 14 Pro, iPhone 15, Samsung S24',
        rating: 4.5,
        reviews: 95,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          material: 'Genuine Leather',
          protection: 'Drop Protection up to 6ft',
          features: ['Card Slots', 'Wireless Charging Compatible', 'Scratch Resistant']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Crystal Clear Case',
        slug: 'crystal-clear-case',
        description: 'Ultra-thin transparent case that shows off your phone\'s original design.',
        price: 25,
        oldPrice: 35,
        discount: 29,
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop',
        categoryId: categories[0].id,
        colors: 'Clear, Smoke Black',
        sizes: 'iPhone 14, iPhone 15, Samsung S24',
        rating: 4.3,
        reviews: 120,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          material: 'TPU',
          protection: 'Shock Absorption',
          features: ['Ultra Thin', 'Anti-Yellowing', 'Raised Edges']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Rugged Armor Case',
        slug: 'rugged-armor-case',
        description: 'Military-grade protection with dual-layer design for ultimate durability.',
        price: 35,
        oldPrice: 50,
        discount: 30,
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop',
        categoryId: categories[0].id,
        colors: 'Black, Blue, Red',
        sizes: 'iPhone 14, iPhone 15, Samsung S24, Google Pixel',
        rating: 4.4,
        reviews: 180,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          material: 'Polycarbonate + TPU',
          protection: 'Military Standard 810G',
          features: ['Shock Absorption', 'Raised Camera Protection', 'Anti-Slip Grip']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Silicone Grip Case',
        slug: 'silicone-grip-case',
        description: 'Soft silicone case with anti-slip texture and wireless charging compatibility.',
        price: 20,
        oldPrice: 30,
        discount: 33,
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop',
        categoryId: categories[0].id,
        colors: 'Black, White, Pink, Blue',
        sizes: 'iPhone 14, iPhone 15, Samsung S24',
        rating: 4.2,
        reviews: 95,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          material: 'Premium Silicone',
          protection: 'Drop Protection up to 4ft',
          features: ['Anti-Slip Texture', 'Wireless Charging', 'Easy Installation']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Wallet Case with Stand',
        slug: 'wallet-case-stand',
        description: 'Multi-functional case with card slots, stand feature, and magnetic closure.',
        price: 55,
        oldPrice: 75,
        discount: 27,
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop',
        categoryId: categories[0].id,
        colors: 'Black, Brown, Navy',
        sizes: 'iPhone 14, iPhone 15, Samsung S24',
        rating: 4.6,
        reviews: 150,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          material: 'Genuine Leather + TPU',
          protection: '360° Protection',
          features: ['Card Slots', 'Stand Function', 'Magnetic Closure', 'RFID Blocking']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Carbon Fiber Case',
        slug: 'carbon-fiber-case',
        description: 'Lightweight carbon fiber case with premium finish and military-grade protection.',
        price: 65,
        oldPrice: 90,
        discount: 28,
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop',
        categoryId: categories[0].id,
        colors: 'Black, Silver',
        sizes: 'iPhone 14, iPhone 15, Samsung S24',
        rating: 4.7,
        reviews: 200,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          material: 'Real Carbon Fiber',
          protection: 'Military Standard',
          features: ['Ultra Lightweight', 'Scratch Resistant', 'Wireless Charging']
        }
      },
    }),

    // Screen Protectors (6 products)
    prisma.product.create({
      data: {
        name: 'Tempered Glass Screen Protector',
        slug: 'tempered-glass-protector',
        description: '9H hardness tempered glass with oleophobic coating for ultimate screen protection.',
        price: 15,
        image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop',
        categoryId: categories[1].id,
        colors: '',
        sizes: 'iPhone 14, iPhone 15, Samsung S24',
        rating: 4.7,
        reviews: 230,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          material: '9H Tempered Glass',
          thickness: '0.33mm',
          features: ['Anti-Fingerprint', 'HD Clear', 'Easy Installation']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Privacy Screen Protector',
        slug: 'privacy-screen-protector',
        description: 'Anti-spy tempered glass that blocks side viewing angles for privacy protection.',
        price: 25,
        oldPrice: 35,
        discount: 29,
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop',
        categoryId: categories[1].id,
        colors: '',
        sizes: 'iPhone 14, iPhone 15, Samsung S24',
        rating: 4.5,
        reviews: 180,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          material: '9H Tempered Glass',
          thickness: '0.33mm',
          features: ['Privacy Protection', 'Anti-Spy', 'HD Clear', 'Easy Installation']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Blue Light Filter Protector',
        slug: 'blue-light-filter-protector',
        description: 'Tempered glass with blue light filtering technology to reduce eye strain.',
        price: 20,
        oldPrice: 30,
        discount: 33,
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop',
        categoryId: categories[1].id,
        colors: '',
        sizes: 'iPhone 14, iPhone 15, Samsung S24',
        rating: 4.3,
        reviews: 120,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          material: '9H Tempered Glass',
          thickness: '0.33mm',
          features: ['Blue Light Filter', 'Eye Protection', 'HD Clear', 'Anti-Fingerprint']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Matte Anti-Glare Protector',
        slug: 'matte-anti-glare-protector',
        description: 'Matte finish tempered glass that reduces glare and fingerprints.',
        price: 18,
        oldPrice: 25,
        discount: 28,
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop',
        categoryId: categories[1].id,
        colors: '',
        sizes: 'iPhone 14, iPhone 15, Samsung S24',
        rating: 4.4,
        reviews: 160,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          material: '9H Tempered Glass',
          thickness: '0.33mm',
          features: ['Matte Finish', 'Anti-Glare', 'Anti-Fingerprint', 'Easy Installation']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Curved Edge Protector',
        slug: 'curved-edge-protector',
        description: 'Full coverage tempered glass designed for curved edge displays.',
        price: 22,
        oldPrice: 32,
        discount: 31,
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop',
        categoryId: categories[1].id,
        colors: '',
        sizes: 'Samsung S24, iPhone 15 Pro',
        rating: 4.6,
        reviews: 140,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          material: '9H Tempered Glass',
          thickness: '0.33mm',
          features: ['Curved Edge Design', 'Full Coverage', 'HD Clear', 'Easy Installation']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Self-Healing Protector',
        slug: 'self-healing-protector',
        description: 'Advanced self-healing technology that automatically repairs minor scratches.',
        price: 30,
        oldPrice: 45,
        discount: 33,
        image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop',
        categoryId: categories[1].id,
        colors: '',
        sizes: 'iPhone 14, iPhone 15, Samsung S24',
        rating: 4.8,
        reviews: 220,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          material: 'Self-Healing Polymer',
          thickness: '0.3mm',
          features: ['Self-Healing', 'Scratch Resistant', 'HD Clear', 'Easy Installation']
        }
      },
    }),

    // Wireless Earphones (6 products)
    prisma.product.create({
      data: {
        name: 'Pro Wireless Earbuds',
        slug: 'pro-wireless-earbuds',
        description: 'Premium wireless earbuds with active noise cancellation and 30-hour battery life.',
        price: 120,
        oldPrice: 160,
        discount: 25,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
        categoryId: categories[2].id,
        colors: 'Black, White, Blue',
        sizes: '',
        rating: 4.8,
        reviews: 340,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          battery: '30 hours total',
          features: ['Active Noise Cancellation', 'Wireless Charging', 'IPX7 Waterproof']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Sport Wireless Earbuds',
        slug: 'sport-wireless-earbuds',
        description: 'Sweat-resistant wireless earbuds with secure fit for active lifestyle.',
        price: 80,
        oldPrice: 110,
        discount: 27,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
        categoryId: categories[2].id,
        colors: 'Black, Red, Blue, Green',
        sizes: '',
        rating: 4.5,
        reviews: 280,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          battery: '24 hours total',
          features: ['IPX8 Waterproof', 'Secure Fit', 'Sweat Resistant', 'Quick Charge']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Budget Wireless Earbuds',
        slug: 'budget-wireless-earbuds',
        description: 'Affordable wireless earbuds with good sound quality and long battery life.',
        price: 35,
        oldPrice: 50,
        discount: 30,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
        categoryId: categories[2].id,
        colors: 'Black, White, Pink',
        sizes: '',
        rating: 4.2,
        reviews: 450,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          battery: '20 hours total',
          features: ['Good Sound Quality', 'Long Battery', 'Comfortable Fit', 'Easy Pairing']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Gaming Wireless Earbuds',
        slug: 'gaming-wireless-earbuds',
        description: 'Low-latency wireless earbuds designed for gaming with immersive sound.',
        price: 95,
        oldPrice: 130,
        discount: 27,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
        categoryId: categories[2].id,
        colors: 'Black, Red, Blue',
        sizes: '',
        rating: 4.6,
        reviews: 190,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          battery: '25 hours total',
          features: ['Low Latency', 'Gaming Mode', 'Immersive Sound', 'RGB Lighting']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Noise Cancelling Headphones',
        slug: 'noise-cancelling-headphones',
        description: 'Over-ear wireless headphones with advanced noise cancellation technology.',
        price: 150,
        oldPrice: 200,
        discount: 25,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
        categoryId: categories[2].id,
        colors: 'Black, Silver, Navy',
        sizes: '',
        rating: 4.7,
        reviews: 320,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          battery: '35 hours total',
          features: ['Advanced ANC', 'Premium Sound', 'Comfortable', 'Foldable Design']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'True Wireless Earbuds Pro',
        slug: 'true-wireless-earbuds-pro',
        description: 'Premium true wireless earbuds with spatial audio and transparency mode.',
        price: 180,
        oldPrice: 250,
        discount: 28,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
        categoryId: categories[2].id,
        colors: 'Black, White, Gold',
        sizes: '',
        rating: 4.9,
        reviews: 280,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          battery: '32 hours total',
          features: ['Spatial Audio', 'Transparency Mode', 'Adaptive EQ', 'Wireless Charging']
        }
      },
    }),

    // Chargers & Cables (6 products)
    prisma.product.create({
      data: {
        name: 'Fast Charge Cable',
        slug: 'fast-charge-cable',
        description: 'Durable braided USB-C cable with 100W fast charging support.',
        price: 18,
        oldPrice: 25,
        discount: 28,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
        categoryId: categories[3].id,
        colors: 'Black, White, Red',
        sizes: '1m, 2m, 3m',
        rating: 4.6,
        reviews: 445,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          power: '100W',
          length: '2m',
          features: ['Braided Design', 'Fast Charging', 'Durable']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Wireless Charging Pad',
        slug: 'wireless-charging-pad',
        description: '15W fast wireless charging pad with LED indicator and safety features.',
        price: 35,
        oldPrice: 50,
        discount: 30,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
        categoryId: categories[3].id,
        colors: 'Black, White, Blue',
        sizes: '',
        rating: 4.4,
        reviews: 320,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          power: '15W',
          features: ['Fast Wireless Charging', 'LED Indicator', 'Safety Protection', 'Non-Slip Surface']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Car Charger Adapter',
        slug: 'car-charger-adapter',
        description: 'Dual USB car charger with fast charging and smart detection technology.',
        price: 25,
        oldPrice: 35,
        discount: 29,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
        categoryId: categories[3].id,
        colors: 'Black, Silver',
        sizes: '',
        rating: 4.5,
        reviews: 280,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          power: '24W Total',
          features: ['Dual USB Ports', 'Fast Charging', 'Smart Detection', 'LED Indicator']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Magnetic Charging Cable',
        slug: 'magnetic-charging-cable',
        description: 'Magnetic USB-C cable with detachable connector for easy connection.',
        price: 22,
        oldPrice: 32,
        discount: 31,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
        categoryId: categories[3].id,
        colors: 'Black, White, Red, Blue',
        sizes: '1m, 2m',
        rating: 4.3,
        reviews: 190,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          power: '60W',
          features: ['Magnetic Connection', 'Easy Attachment', 'Fast Charging', 'Durable']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Multi-Port Charging Station',
        slug: 'multi-port-charging-station',
        description: '6-port USB charging station for multiple devices with smart power distribution.',
        price: 65,
        oldPrice: 90,
        discount: 28,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
        categoryId: categories[3].id,
        colors: 'Black, White',
        sizes: '',
        rating: 4.7,
        reviews: 150,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          power: '60W Total',
          features: ['6 USB Ports', 'Smart Power Distribution', 'LED Indicators', 'Compact Design']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Lightning to USB-C Cable',
        slug: 'lightning-usb-c-cable',
        description: 'Apple certified Lightning to USB-C cable for fast charging and data transfer.',
        price: 28,
        oldPrice: 40,
        discount: 30,
        image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
        categoryId: categories[3].id,
        colors: 'White, Black',
        sizes: '1m, 2m',
        rating: 4.6,
        reviews: 380,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          power: '20W',
          features: ['Apple Certified', 'Fast Charging', 'Data Transfer', 'Durable Design']
        }
      },
    }),

    // Power Banks (6 products)
    prisma.product.create({
      data: {
        name: '20000mAh Power Bank',
        slug: 'power-bank-20000',
        description: 'High-capacity power bank with fast charging and LED display.',
        price: 45,
        oldPrice: 65,
        discount: 31,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
        categoryId: categories[4].id,
        colors: 'Black, Silver',
        sizes: '',
        rating: 4.6,
        reviews: 512,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          capacity: '20000mAh',
          output: '18W',
          features: ['LED Display', 'Fast Charging', 'Multiple Ports']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: '10000mAh Compact Power Bank',
        slug: 'power-bank-10000',
        description: 'Compact and lightweight power bank perfect for everyday use.',
        price: 25,
        oldPrice: 35,
        discount: 29,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
        categoryId: categories[4].id,
        colors: 'Black, White, Blue, Pink',
        sizes: '',
        rating: 4.4,
        reviews: 380,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          capacity: '10000mAh',
          output: '15W',
          features: ['Compact Design', 'Lightweight', 'Fast Charging', 'LED Indicator']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: '30000mAh Solar Power Bank',
        slug: 'solar-power-bank-30000',
        description: 'High-capacity power bank with solar charging capability for outdoor adventures.',
        price: 85,
        oldPrice: 120,
        discount: 29,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
        categoryId: categories[4].id,
        colors: 'Black, Green, Orange',
        sizes: '',
        rating: 4.5,
        reviews: 180,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          capacity: '30000mAh',
          output: '20W',
          features: ['Solar Charging', 'Waterproof', 'LED Flashlight', 'Multiple Ports']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Wireless Power Bank',
        slug: 'wireless-power-bank',
        description: 'Power bank with built-in wireless charging pad for convenient charging.',
        price: 55,
        oldPrice: 75,
        discount: 27,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
        categoryId: categories[4].id,
        colors: 'Black, White, Blue',
        sizes: '',
        rating: 4.6,
        reviews: 220,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          capacity: '15000mAh',
          output: '15W Wireless + 18W Wired',
          features: ['Wireless Charging', 'Fast Charging', 'LED Display', 'Stand Function']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: '5000mAh Ultra Slim Power Bank',
        slug: 'ultra-slim-power-bank',
        description: 'Ultra-slim and lightweight power bank that fits in your pocket.',
        price: 20,
        oldPrice: 30,
        discount: 33,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
        categoryId: categories[4].id,
        colors: 'Black, White, Gold, Rose Gold',
        sizes: '',
        rating: 4.3,
        reviews: 290,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          capacity: '5000mAh',
          output: '12W',
          features: ['Ultra Slim', 'Lightweight', 'Pocket Size', 'LED Indicator']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'MagSafe Compatible Power Bank',
        slug: 'magsafe-power-bank',
        description: 'Magnetic power bank compatible with MagSafe for iPhone 12 and newer.',
        price: 75,
        oldPrice: 100,
        discount: 25,
        image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
        categoryId: categories[4].id,
        colors: 'Black, White, Blue',
        sizes: '',
        rating: 4.7,
        reviews: 160,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          capacity: '10000mAh',
          output: '15W',
          features: ['MagSafe Compatible', 'Magnetic Attachment', 'Wireless Charging', 'LED Display']
        }
      },
    }),

    // Adapters (6 products)
    prisma.product.create({
      data: {
        name: 'USB-C to Lightning Adapter',
        slug: 'usb-c-lightning-adapter',
        description: 'Compact adapter for connecting USB-C devices to Lightning ports.',
        price: 15,
        oldPrice: 22,
        discount: 32,
        image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop',
        categoryId: categories[5].id,
        colors: 'White, Black',
        sizes: '',
        rating: 4.4,
        reviews: 180,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          compatibility: 'USB-C to Lightning',
          features: ['Compact Design', 'Fast Data Transfer', 'Charging Support', 'Durable']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'HDMI to USB-C Adapter',
        slug: 'hdmi-usb-c-adapter',
        description: '4K HDMI to USB-C adapter for connecting laptops to external displays.',
        price: 35,
        oldPrice: 50,
        discount: 30,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
        categoryId: categories[5].id,
        colors: 'Black, Silver',
        sizes: '',
        rating: 4.5,
        reviews: 220,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          compatibility: 'HDMI to USB-C',
          features: ['4K Resolution', 'Plug & Play', 'Compact Design', 'Universal Compatibility']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Multi-Port USB Hub',
        slug: 'multi-port-usb-hub',
        description: '7-in-1 USB-C hub with multiple ports for laptops and tablets.',
        price: 45,
        oldPrice: 65,
        discount: 31,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
        categoryId: categories[5].id,
        colors: 'Black, Silver, Space Gray',
        sizes: '',
        rating: 4.6,
        reviews: 190,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          compatibility: 'USB-C',
          features: ['7-in-1 Design', 'HDMI Output', 'USB 3.0 Ports', 'SD Card Reader', 'Ethernet Port']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: '3.5mm to USB-C Adapter',
        slug: 'audio-usb-c-adapter',
        description: 'High-quality audio adapter for connecting 3.5mm headphones to USB-C devices.',
        price: 12,
        oldPrice: 18,
        discount: 33,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
        categoryId: categories[5].id,
        colors: 'Black, White',
        sizes: '',
        rating: 4.3,
        reviews: 250,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: false,
        specifications: {
          compatibility: '3.5mm to USB-C',
          features: ['High-Quality Audio', 'Compact Design', 'Universal Compatibility', 'Durable']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Wireless Charging Stand',
        slug: 'wireless-charging-stand',
        description: 'Adjustable wireless charging stand with phone holder and fast charging.',
        price: 40,
        oldPrice: 55,
        discount: 27,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
        categoryId: categories[5].id,
        colors: 'Black, White, Silver',
        sizes: '',
        rating: 4.5,
        reviews: 170,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          compatibility: 'Qi Wireless',
          features: ['Adjustable Stand', 'Fast Charging', 'Phone Holder', 'LED Indicator']
        }
      },
    }),
    prisma.product.create({
      data: {
        name: 'Car Mount with Wireless Charging',
        slug: 'car-mount-wireless-charging',
        description: 'Magnetic car mount with built-in wireless charging for hands-free driving.',
        price: 55,
        oldPrice: 75,
        discount: 27,
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
        images: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop',
        categoryId: categories[5].id,
        colors: 'Black, Silver',
        sizes: '',
        rating: 4.6,
        reviews: 140,
        inStock: true,
        stock: 50,
        lowStockThreshold: 10,
        featured: true,
        specifications: {
          compatibility: 'Universal',
          features: ['Magnetic Mount', 'Wireless Charging', '360° Rotation', 'Strong Grip', 'Auto-Clamping']
        }
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products`);
  // Create an admin user for local development if it doesn't exist
  const adminEmail = 'nstoyanov639@gmail.com';
  const adminPassword = '123123';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashed,
        name: 'Admin',
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });
    console.log(`✅ Created admin user ${adminEmail}`);
  } else {
    console.log(`ℹ️ Admin user ${adminEmail} already exists`);
  }

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });