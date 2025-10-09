'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/store/cartStore'
import { Trash2, Plus, Minus, ShoppingBag, X } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
  const [discountCode, setDiscountCode] = useState('')
  const [cardNumber, setCardNumber] = useState('')

  if (items.length === 0) {
    return (
      <div className="bg-dark-500 min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto px-4 text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-primary-500/50 mb-6" />
          <h1 className="text-3xl font-bold mb-4">Количката е празна</h1>
          <p className="text-gray-400 mb-8">Добавете продукти, за да продължите</p>
          <Link
            href="/products"
            className="bg-primary-500 text-dark-900 px-8 py-3 rounded-lg hover:bg-primary-400 transition inline-block font-semibold glow-cyan"
          >
            Към продуктите
          </Link>
        </div>
      </div>
    )
  }

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.02 // 2% tax
  const shipping = 29
  const total = subtotal + tax + shipping

  return (
    <div className="bg-dark-500 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-100">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.salePrice || item.price
              return (
                <div key={item.id} className="glass-effect rounded-lg p-6">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 bg-dark-300 rounded-lg flex-shrink-0">
                      <div className="w-full h-full flex items-center justify-center text-primary-500/50 text-xs">
                        Продукт
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-semibold text-gray-100 hover:text-primary-400 transition"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-gray-400 mt-1">#{Math.random().toString(36).substr(2, 9)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-dark-400 border border-gray-700 rounded hover:border-primary-500 transition"
                      >
                        <Minus className="w-4 h-4 text-gray-300" />
                      </button>
                      <span className="text-gray-100 font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-dark-400 border border-gray-700 rounded hover:border-primary-500 transition"
                      >
                        <Plus className="w-4 h-4 text-gray-300" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-primary-400 w-24 text-right">
                        ${price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-400 transition"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 text-gray-100">Order Summary</h2>
              
              {/* Discount Code */}
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">
                  Discount code / Promo code
                </label>
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Code"
                  className="w-full bg-dark-400 border border-gray-700 text-gray-100 px-4 py-2 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
                />
              </div>

              {/* Bonus Card */}
              <div className="mb-6">
                <label className="block text-sm text-gray-400 mb-2">
                  Your bonus card number
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="Enter Card Number"
                    className="flex-1 bg-dark-400 border border-gray-700 text-gray-100 px-4 py-2 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition"
                  />
                  <button className="px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:border-primary-500 transition">
                    Apply
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-800">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Estimated Tax</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Estimated shipping & Handling</span>
                  <span className="font-semibold">${shipping.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg mb-6">
                <span className="font-bold text-gray-100">Total</span>
                <span className="font-bold text-primary-400 text-2xl">${total.toFixed(2)}</span>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-primary-500 text-dark-900 text-center px-6 py-4 rounded-lg hover:bg-primary-400 transition font-bold glow-cyan"
              >
                Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

