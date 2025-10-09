'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    salePrice?: number | null
    images: string[]
    stock: number
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice || undefined,
      image: product.images[0] || '/placeholder.jpg',
      slug: product.slug,
    })
  }

  const displayPrice = product.salePrice || product.price
  const hasDiscount = product.salePrice && product.salePrice < product.price

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="glass-effect rounded-lg overflow-hidden hover:border-primary-500 transition-all duration-300">
        <div className="relative h-64 bg-dark-300">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary-500/50">
              Няма изображение
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-primary-500 text-dark-900 px-3 py-1 rounded-md text-sm font-bold glow-cyan">
              -{Math.round(((product.price - (product.salePrice || 0)) / product.price) * 100)}%
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-100 mb-2 line-clamp-2 group-hover:text-primary-400 transition">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between mt-4">
            <div>
              <span className="text-2xl font-bold text-primary-400">
                {displayPrice.toFixed(2)} лв
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  {product.price.toFixed(2)} лв
                </span>
              )}
            </div>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-primary-500 text-dark-900 p-2 rounded-lg hover:bg-primary-400 transition disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed glow-cyan"
              title={product.stock === 0 ? 'Няма наличност' : 'Добави в количка'}
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
          
          {product.stock === 0 && (
            <p className="text-red-400 text-sm mt-2">Няма наличност</p>
          )}
          {product.stock > 0 && product.stock < 5 && (
            <p className="text-primary-400 text-sm mt-2">Остават само {product.stock} бр.</p>
          )}
        </div>
      </div>
    </Link>
  )
}

