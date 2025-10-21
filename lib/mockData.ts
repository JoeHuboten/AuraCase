export const categories = [
  {
    id: '1',
    name: 'Phone Cases',
    slug: 'phone-cases',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=600&fit=crop',
    description: 'Protective and stylish cases for your device'
  },
  {
    id: '2',
    name: 'Screen Protectors',
    slug: 'screen-protectors',
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&h=600&fit=crop',
    description: 'Keep your screen scratch-free'
  },
  {
    id: '3',
    name: 'Wireless Earphones',
    slug: 'wireless-earphones',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&h=600&fit=crop',
    description: 'Premium sound quality'
  },
  {
    id: '4',
    name: 'Chargers & Cables',
    slug: 'chargers-cables',
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop',
    description: 'Fast charging solutions'
  },
  {
    id: '5',
    name: 'Power Banks',
    slug: 'power-banks',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&h=600&fit=crop',
    description: 'Portable power on the go'
  },
  {
    id: '6',
    name: 'Adapters',
    slug: 'adapters',
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=800&h=600&fit=crop',
    description: 'Universal connectivity solutions'
  },
];

export const products = [
  {
    id: '1',
    name: 'Premium Leather Case',
    slug: 'premium-leather-case',
    description: 'Handcrafted genuine leather case with card slots and premium finish. Perfect protection with elegant style.',
    price: 45,
    oldPrice: 70,
    discount: 36,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop'],
    categoryId: '1',
    colors: ['Black', 'Brown', 'Navy'],
    sizes: ['iPhone 14', 'iPhone 14 Pro', 'iPhone 15', 'Samsung S24'],
    rating: 4.5,
    reviews: 95,
    inStock: true,
    featured: true,
    specifications: {
      material: 'Genuine Leather',
      protection: 'Drop Protection up to 6ft',
      features: ['Card Slots', 'Wireless Charging Compatible', 'Scratch Resistant']
    }
  },
  {
    id: '2',
    name: 'Crystal Clear Case',
    slug: 'crystal-clear-case',
    description: 'Ultra-thin transparent case that shows off your phone\'s original design while providing excellent protection.',
    price: 25,
    oldPrice: 35,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600&h=600&fit=crop'],
    categoryId: '1',
    colors: ['Clear', 'Smoke Black'],
    sizes: ['iPhone 14', 'iPhone 15', 'Samsung S24'],
    rating: 4.3,
    reviews: 120,
    inStock: true,
    featured: true,
    specifications: {
      material: 'TPU',
      protection: 'Shock Absorption',
      features: ['Ultra Thin', 'Anti-Yellowing', 'Raised Edges']
    }
  },
  {
    id: '3',
    name: 'Tempered Glass Screen Protector',
    slug: 'tempered-glass-protector',
    description: '9H hardness tempered glass with oleophobic coating for ultimate screen protection.',
    price: 15,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop'],
    categoryId: '2',
    colors: [],
    sizes: ['iPhone 14', 'iPhone 15', 'Samsung S24'],
    rating: 4.7,
    reviews: 230,
    inStock: true,
    featured: false,
    specifications: {
      material: '9H Tempered Glass',
      thickness: '0.33mm',
      features: ['Anti-Fingerprint', 'HD Clear', 'Easy Installation']
    }
  },
  {
    id: '4',
    name: 'Privacy Screen Protector',
    slug: 'privacy-screen-protector',
    description: 'Advanced privacy filter that keeps your screen content visible only to you.',
    price: 28,
    oldPrice: 40,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=600&h=600&fit=crop'],
    categoryId: '2',
    colors: [],
    sizes: ['iPhone 14', 'iPhone 15'],
    rating: 4.4,
    reviews: 87,
    inStock: true,
    featured: false,
    specifications: {
      material: 'Privacy Glass',
      viewing: 'Privacy Angle: 45°',
      features: ['Anti-Spy', 'Scratch Resistant', 'Blue Light Filter']
    }
  },
  {
    id: '5',
    name: 'Pro Wireless Earbuds',
    slug: 'pro-wireless-earbuds',
    description: 'Premium wireless earbuds with active noise cancellation and 30-hour battery life.',
    price: 120,
    oldPrice: 160,
    discount: 25,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop'],
    categoryId: '3',
    colors: ['Black', 'White', 'Blue'],
    sizes: [],
    rating: 4.8,
    reviews: 340,
    inStock: true,
    featured: true,
    specifications: {
      battery: '30 hours with case',
      connection: 'Bluetooth 5.3',
      features: ['ANC', 'Touch Controls', 'IPX7 Waterproof', 'Fast Charging']
    }
  },
  {
    id: '6',
    name: 'Sport Wireless Earphones',
    slug: 'sport-wireless-earphones',
    description: 'Sweatproof wireless earphones designed for active lifestyles with secure fit.',
    price: 65,
    oldPrice: 90,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=600&fit=crop'],
    categoryId: '3',
    colors: ['Black', 'Red', 'Green'],
    sizes: [],
    rating: 4.5,
    reviews: 156,
    inStock: true,
    featured: false,
    specifications: {
      battery: '12 hours',
      connection: 'Bluetooth 5.0',
      features: ['Sweatproof', 'Ear Hooks', 'Volume Control']
    }
  },
  {
    id: '7',
    name: 'Fast Charge Cable',
    slug: 'fast-charge-cable',
    description: 'Durable braided USB-C cable with 100W fast charging support.',
    price: 18,
    oldPrice: 25,
    discount: 28,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop'],
    categoryId: '4',
    colors: ['Black', 'White', 'Red'],
    sizes: ['1m', '2m', '3m'],
    rating: 4.6,
    reviews: 445,
    inStock: true,
    featured: false,
    specifications: {
      material: 'Braided Nylon',
      power: '100W Fast Charge',
      features: ['USB-C to USB-C', 'Tangle Free', '10000+ Bend Lifespan']
    }
  },
  {
    id: '8',
    name: '65W GaN Charger',
    slug: 'gan-charger-65w',
    description: 'Compact GaN technology charger with multiple ports for all your devices.',
    price: 55,
    oldPrice: 80,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop'],
    categoryId: '4',
    colors: ['Black', 'White'],
    sizes: [],
    rating: 4.7,
    reviews: 289,
    inStock: true,
    featured: true,
    specifications: {
      power: '65W Total Output',
      ports: '2x USB-C, 1x USB-A',
      features: ['GaN Technology', 'Foldable Plug', 'Multiple Protection']
    }
  },
  {
    id: '9',
    name: '20000mAh Power Bank',
    slug: 'power-bank-20000',
    description: 'High-capacity power bank with fast charging and LED display.',
    price: 45,
    oldPrice: 65,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop'],
    categoryId: '5',
    colors: ['Black', 'Silver'],
    sizes: [],
    rating: 4.6,
    reviews: 512,
    inStock: true,
    featured: true,
    specifications: {
      capacity: '20000mAh',
      output: '22.5W Fast Charge',
      features: ['LED Display', 'Multiple Ports', 'Pass-Through Charging']
    }
  },
  {
    id: '10',
    name: 'Slim 10000mAh Power Bank',
    slug: 'slim-power-bank-10000',
    description: 'Ultra-slim and portable power bank perfect for daily use.',
    price: 32,
    oldPrice: 45,
    discount: 29,
    image: 'https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1618944847828-82e943c3bdb7?w=600&h=600&fit=crop'],
    categoryId: '5',
    colors: ['Black', 'White', 'Pink'],
    sizes: [],
    rating: 4.4,
    reviews: 267,
    inStock: true,
    featured: false,
    specifications: {
      capacity: '10000mAh',
      output: '20W PD',
      features: ['Ultra Slim', 'Lightweight', 'Dual Output']
    }
  },
  {
    id: '11',
    name: 'USB-C to HDMI Adapter',
    slug: 'usbc-hdmi-adapter',
    description: '4K HDMI adapter for connecting your phone to external displays.',
    price: 35,
    oldPrice: 50,
    discount: 30,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=600&h=600&fit=crop'],
    categoryId: '6',
    colors: ['Space Gray'],
    sizes: [],
    rating: 4.5,
    reviews: 178,
    inStock: true,
    featured: false,
    specifications: {
      resolution: '4K@60Hz',
      compatibility: 'USB-C Devices',
      features: ['Plug and Play', 'Aluminum Housing', 'Compact Design']
    }
  },
  {
    id: '12',
    name: 'Multi-Port USB Hub',
    slug: 'multi-port-usb-hub',
    description: '7-in-1 USB-C hub with HDMI, USB, SD card reader and more.',
    price: 48,
    oldPrice: 70,
    discount: 31,
    image: 'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=600&h=600&fit=crop',
    images: ['https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=600&h=600&fit=crop'],
    categoryId: '6',
    colors: ['Gray', 'Silver'],
    sizes: [],
    rating: 4.6,
    reviews: 203,
    inStock: true,
    featured: false,
    specifications: {
      ports: '7-in-1',
      features: ['4K HDMI', 'USB 3.0', 'SD/TF Card Reader', '100W PD'],
      material: 'Aluminum Alloy'
    }
  },
];


export const testimonials = [
  {
    id: '1',
    name: 'James L.',
    verified: true,
    rating: 5,
    text: "As someone who's always on the lookout for unique tech accessories, I'm thrilled to have stumbled upon AuraCase. The selection of products is not only diverse but also on-point with the latest trends."
  },
  {
    id: '2',
    name: 'Ethan R.',
    verified: true,
    rating: 5,
    text: "This case is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the quality in every aspect."
  },
  {
    id: '3',
    name: 'Olivia P.',
    verified: true,
    rating: 5,
    text: "As a UI/UX enthusiast, I value simplicity and functionality. This product not only represents those principles but also feels great to use. It's evident that quality was a priority."
  },
];

