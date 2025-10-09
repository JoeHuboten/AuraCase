'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw, Cpu, Camera, Battery, Smartphone, ChevronDown } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

// Mock data - ще се замени с реални данни от API
const mockProduct = {
  id: '1',
  name: 'Силиконов кейс за iPhone 14 Pro - Черен',
  slug: 'silicone-case-iphone-14-pro-black',
  description: 'Висококачествен силиконов кейс с мека текстура и перфектно прилягане. Защитава устройството ви от удари и драскотини, като същевременно запазва елегантния му вид.',
  price: 29.99,
  salePrice: 24.99,
  images: [
    '/images/products/case-1.jpg',
    '/images/products/case-1-2.jpg',
    '/images/products/case-1-3.jpg',
  ],
  stock: 15,
  category: { name: 'Кейсове', slug: 'cases' },
  rating: 4.5,
  reviews: 28,
  features: [
    'Мека силиконова текстура',
    'Перфектно прилягане',
    'Защита от удари и драскотини',
    'Лесен достъп до всички бутони',
    'Поддържа безжично зареждане',
  ],
}

export default function ProductDetailPage() {
  const params = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('Deep Purple')
  const [selectedStorage, setSelectedStorage] = useState('1TB')
  const [showAllSpecs, setShowAllSpecs] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'Deep Purple', hex: '#4B0082' },
    { name: 'Red', hex: '#DC2626' },
    { name: 'Gold', hex: '#FFA500' },
    { name: 'Silver', hex: '#C0C0C0' },
  ]

  const storageOptions = ['128GB', '256GB', '512GB', '1TB']

  const specs = [
    { label: 'Screen size', value: '6.7"', icon: Smartphone },
    { label: 'CPU', value: 'Apple A16 Bionic', icon: Cpu },
    { label: 'Number of Cores', value: '6', icon: Cpu },
    { label: 'Main camera', value: '48-12-12 MP', icon: Camera },
    { label: 'Front-camera', value: '12 MP', icon: Camera },
    { label: 'Battery capacity', value: '4323 mAh', icon: Battery },
  ]

  const detailedSpecs = [
    { category: 'Screen', items: [
      { label: 'Screen diagonal', value: '6.7"' },
      { label: 'The screen resolution', value: '2796×1290' },
      { label: 'The screen refresh rate', value: '120 Hz' },
      { label: 'The pixel density', value: '460 ppi' },
      { label: 'Screen type', value: 'OLED' },
      { label: 'Additionally', value: 'Dynamic Island, Always-On display, HDR display, True Tone, Wide color (P3)' },
    ]},
    { category: 'CPU', items: [
      { label: 'CPU', value: 'A16 Bionic' },
      { label: 'Number of cores', value: '6' },
    ]},
  ]

  const handleAddToCart = () => {
    addItem({
      id: mockProduct.id,
      name: `${mockProduct.name} ${selectedStorage} ${selectedColor}`,
      price: mockProduct.price,
      salePrice: mockProduct.salePrice || undefined,
      image: mockProduct.images[0],
      slug: mockProduct.slug,
    })
  }

  const displayPrice = mockProduct.salePrice || mockProduct.price
  const hasDiscount = mockProduct.salePrice && mockProduct.salePrice < mockProduct.price

  return (
    <div className="bg-dark-500 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <span className="hover:text-primary-400 cursor-pointer">Home</span>
          <span>/</span>
          <span className="hover:text-primary-400 cursor-pointer">Catalog</span>
          <span>/</span>
          <span className="hover:text-primary-400 cursor-pointer">Smartphones</span>
          <span>/</span>
          <span className="hover:text-primary-400 cursor-pointer">Apple</span>
          <span>/</span>
          <span className="text-gray-100">iPhone 14 Pro Max</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div>
            <div className="relative h-[600px] glass-effect rounded-lg mb-4 overflow-hidden group">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-64 h-96 bg-gradient-to-br from-purple-600 to-purple-900 rounded-3xl flex items-center justify-center">
                  <span className="text-white text-4xl">📱</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {mockProduct.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-24 glass-effect rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-primary-500 border-primary-500' : ''
                  }`}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-6 text-gray-100">Apple iPhone 14 Pro Max</h1>
            
            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-5xl font-bold text-primary-400">
                $1399
              </span>
              {hasDiscount && (
                <span className="text-2xl text-gray-500 line-through">
                  $1499
                </span>
              )}
            </div>

            {/* Color Selector */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-3 block">Select color :</label>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                      selectedColor === color.name
                        ? 'ring-2 ring-primary-500 ring-offset-2 ring-offset-dark-500'
                        : 'hover:ring-2 hover:ring-gray-600 hover:ring-offset-2 hover:ring-offset-dark-500'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Storage Options */}
            <div className="mb-6">
              <div className="grid grid-cols-4 gap-3">
                {storageOptions.map((storage) => (
                  <button
                    key={storage}
                    onClick={() => setSelectedStorage(storage)}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition ${
                      selectedStorage === storage
                        ? 'border-primary-500 bg-primary-500/10 text-primary-400'
                        : 'border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    {storage}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Specs */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {specs.map((spec, index) => (
                <div key={index} className="glass-effect p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <spec.icon className="w-5 h-5 text-primary-400" />
                    <span className="text-xs text-gray-400">{spec.label}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-200">{spec.value}</p>
                </div>
              ))}
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              {mockProduct.description} Enhanced capabilities thanks loan enlarged display of 6.7 inchesand work
              without rechargingthroughout the day. Incredible photosin weak, yesand in bright lightusing the new systemwith two cameras.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button className="flex-1 border-2 border-gray-700 text-gray-100 px-8 py-4 rounded-lg hover:border-primary-500 transition font-semibold flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Add to Wishlist
              </button>
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary-500 text-dark-900 px-8 py-4 rounded-lg hover:bg-primary-400 transition font-bold glow-cyan flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Card
              </button>
            </div>

            {/* Delivery Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Free Delivery</p>
                  <p className="text-sm font-semibold text-gray-200">1-2 day</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">In Stock</p>
                  <p className="text-sm font-semibold text-gray-200">Today</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-500/20 rounded flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Guaranteed</p>
                  <p className="text-sm font-semibold text-gray-200">1 year</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specifications */}
        <div className="glass-effect rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-100">Details</h2>
          
          <p className="text-gray-400 leading-relaxed mb-8">
            Just as a book is judged by its cover, the first thing you notice when you pick up a modern smartphone is the display. Nothing surprising, because
            advanced technologies allow you to practically level the display frames and cutouts for the front camera and speaker, leaving no room for bold design
            solutions. And how good that in such realities Apple everything is fine with displays. Both critics and mass consumers always praise the quality of the
            picture provided by the products of the Californian brand. And last year's 6.7-inch Retina panels, which had ProMotion, caused real admiration for many.
          </p>

          {detailedSpecs.map((section, index) => (
            <div key={index} className="mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-100">{section.category}</h3>
              <div className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex justify-between py-3 border-b border-gray-800 last:border-0">
                    <span className="text-gray-400">{item.label}</span>
                    <span className="text-gray-100 text-right max-w-md">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button 
            onClick={() => setShowAllSpecs(!showAllSpecs)}
            className="w-full border-2 border-gray-700 text-gray-100 py-3 rounded-lg hover:border-primary-500 transition font-semibold flex items-center justify-center gap-2"
          >
            View More
            <ChevronDown className={`w-5 h-5 transition-transform ${showAllSpecs ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  )
}

