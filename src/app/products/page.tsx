'use client'

import { useState } from 'react'
import ProductCard from '@/components/ProductCard'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'

// Временни данни - ще се заменят с реални данни от базата
const mockProducts = [
  {
    id: '1',
    name: 'Силиконов кейс за iPhone 14 Pro - Черен',
    slug: 'silicone-case-iphone-14-pro-black',
    description: 'Висококачествен силиконов кейс с мека текстура',
    price: 29.99,
    salePrice: 24.99,
    images: ['/images/products/case-1.jpg'],
    stock: 15,
    categoryId: '1',
    featured: true,
  },
  {
    id: '2',
    name: 'Стъклен протектор Samsung Galaxy S23 Ultra',
    slug: 'glass-protector-samsung-s23-ultra',
    description: '9H твърдост, пълно покритие',
    price: 19.99,
    salePrice: null,
    images: ['/images/products/protector-1.jpg'],
    stock: 30,
    categoryId: '2',
    featured: false,
  },
  {
    id: '3',
    name: 'Безжично зарядно устройство 15W',
    slug: 'wireless-charger-15w',
    description: 'Бързо зареждане за всички съвместими устройства',
    price: 49.99,
    salePrice: 39.99,
    images: ['/images/products/charger-1.jpg'],
    stock: 8,
    categoryId: '3',
    featured: true,
  },
  {
    id: '4',
    name: 'Прозрачен кейс Xiaomi 13 Pro',
    slug: 'clear-case-xiaomi-13-pro',
    description: 'Ultra тънък прозрачен кейс с защита от пожълтяване',
    price: 24.99,
    salePrice: null,
    images: ['/images/products/case-2.jpg'],
    stock: 20,
    categoryId: '1',
    featured: false,
  },
  {
    id: '5',
    name: 'TWS Bluetooth слушалки',
    slug: 'tws-bluetooth-earbuds',
    description: 'Премиум звук, активно шумопотискане',
    price: 89.99,
    salePrice: 69.99,
    images: ['/images/products/earbuds-1.jpg'],
    stock: 12,
    categoryId: '4',
    featured: true,
  },
  {
    id: '6',
    name: 'USB-C кабел 2м - Черен',
    slug: 'usb-c-cable-2m-black',
    description: 'Издръжлив плетен кабел с бързо зареждане',
    price: 14.99,
    salePrice: null,
    images: ['/images/products/cable-1.jpg'],
    stock: 50,
    categoryId: '3',
    featured: false,
  },
]

export default function ProductsPage() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 100])
  const [searchBrand, setSearchBrand] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    category: true,
    price: true,
  })

  const brands = [
    { name: 'Apple', count: 110 },
    { name: 'Samsung', count: 125 },
    { name: 'Xiaomi', count: 68 },
    { name: 'Huawei', count: 54 },
    { name: 'OPPO', count: 36 },
    { name: 'OnePlus', count: 28 },
  ]

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  return (
    <div className="bg-dark-500 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
          <span className="hover:text-primary-400 cursor-pointer">Home</span>
          <span>/</span>
          <span className="hover:text-primary-400 cursor-pointer">Catalog</span>
          <span>/</span>
          <span className="text-gray-100">Smartphones</span>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="glass-effect rounded-lg p-6 sticky top-24">
              {/* Brand Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('brand')}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <h3 className="text-lg font-semibold text-gray-100">Brand</h3>
                  {expandedSections.brand ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {expandedSections.brand && (
                  <>
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchBrand}
                        onChange={(e) => setSearchBrand(e.target.value)}
                        className="w-full bg-dark-400 border border-gray-700 text-gray-100 pl-10 pr-4 py-2 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
                      />
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {brands.map((brand) => (
                        <label key={brand.name} className="flex items-center cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={selectedBrands.includes(brand.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedBrands([...selectedBrands, brand.name])
                              } else {
                                setSelectedBrands(selectedBrands.filter(b => b !== brand.name))
                              }
                            }}
                            className="w-4 h-4 rounded border-gray-600 bg-dark-400 text-primary-500 focus:ring-primary-500 focus:ring-2"
                          />
                          <span className="ml-3 text-gray-300 group-hover:text-primary-400 transition flex-1">
                            {brand.name}
                          </span>
                          <span className="text-gray-500 text-sm">{brand.count}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-gray-800 my-6"></div>

              {/* Category Filter */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('category')}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <h3 className="text-lg font-semibold text-gray-100">Category</h3>
                  {expandedSections.category ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {expandedSections.category && (
                  <div className="space-y-3">
                    {['Кейсове', 'Протектори', 'Зарядни', 'Слушалки', 'Кабели'].map((cat) => (
                      <label key={cat} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-600 bg-dark-400 text-primary-500 focus:ring-primary-500 focus:ring-2"
                        />
                        <span className="ml-3 text-gray-300 group-hover:text-primary-400 transition">
                          {cat}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-800 my-6"></div>

              {/* Price Range */}
              <div>
                <button
                  onClick={() => toggleSection('price')}
                  className="flex items-center justify-between w-full mb-4"
                >
                  <h3 className="text-lg font-semibold text-gray-100">Price Range</h3>
                  {expandedSections.price ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {expandedSections.price && (
                  <div>
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span>от {priceRange[0]} лв</span>
                      <span>до {priceRange[1]} лв</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                      className="w-full accent-primary-500"
                    />
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-300">
                Selected Products: <span className="text-primary-400 font-semibold">{mockProducts.length}</span>
              </div>

              <select className="bg-dark-400 border border-gray-700 text-gray-100 px-4 py-2 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition">
                <option>By rating</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex gap-2">
                <button className="px-4 py-2 glass-effect rounded-lg hover:border-primary-500 transition text-gray-300">
                  Предишна
                </button>
                <button className="px-4 py-2 bg-primary-500 text-dark-900 rounded-lg font-semibold glow-cyan">1</button>
                <button className="px-4 py-2 glass-effect rounded-lg hover:border-primary-500 transition text-gray-300">2</button>
                <button className="px-4 py-2 glass-effect rounded-lg hover:border-primary-500 transition text-gray-300">3</button>
                <button className="px-4 py-2 glass-effect rounded-lg hover:border-primary-500 transition text-gray-300">
                  Следваща
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

