'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useCartStore } from '@/store/cartStore'
import { ShoppingCart, User, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const getTotalItems = useCartStore((state) => state.getTotalItems)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="glass-effect sticky top-0 z-50 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gradient hover:scale-105 transition-transform">
              AuraCase
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-primary-400 transition">
              Начало
            </Link>
            <Link href="/products" className="text-gray-300 hover:text-primary-400 transition">
              Продукти
            </Link>
            <Link href="/categories" className="text-gray-300 hover:text-primary-400 transition">
              Категории
            </Link>
            
            <Link href="/cart" className="relative text-gray-300 hover:text-primary-400 transition">
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-500 text-dark-900 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold glow-cyan">
                  {getTotalItems()}
                </span>
              )}
            </Link>

            {session ? (
              <div className="flex items-center space-x-4">
                {session.user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="text-gray-300 hover:text-primary-400 transition"
                  >
                    Админ
                  </Link>
                )}
                <button
                  onClick={() => signOut()}
                  className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition"
                >
                  Изход
                </button>
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-primary-500 text-dark-900 px-4 py-2 rounded-lg hover:bg-primary-400 transition flex items-center space-x-2 font-semibold glow-cyan"
              >
                <User className="w-4 h-4" />
                <span>Вход</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-300 hover:text-primary-400"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-effect border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 text-gray-300 hover:bg-dark-400 hover:text-primary-400 rounded-md transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Начало
            </Link>
            <Link
              href="/products"
              className="block px-3 py-2 text-gray-300 hover:bg-dark-400 hover:text-primary-400 rounded-md transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Продукти
            </Link>
            <Link
              href="/categories"
              className="block px-3 py-2 text-gray-300 hover:bg-dark-400 hover:text-primary-400 rounded-md transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Категории
            </Link>
            <Link
              href="/cart"
              className="block px-3 py-2 text-gray-300 hover:bg-dark-400 hover:text-primary-400 rounded-md transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Количка ({getTotalItems()})
            </Link>
            {session?.user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="block px-3 py-2 text-gray-300 hover:bg-dark-400 hover:text-primary-400 rounded-md transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Админ панел
              </Link>
            )}
            {session ? (
              <button
                onClick={() => {
                  signOut()
                  setMobileMenuOpen(false)
                }}
                className="w-full text-left px-3 py-2 text-red-400 hover:bg-dark-400 rounded-md transition"
              >
                Изход
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="block px-3 py-2 text-primary-400 hover:bg-dark-400 rounded-md transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Вход
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}