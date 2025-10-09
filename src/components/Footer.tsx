import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-dark-600 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-gradient">
              AuraCase
            </Link>
            <p className="mt-4 text-gray-400 max-w-md">
              Премиум аксесоари за вашите устройства. Подобрете гейминг, работата и развлеченията си с нашите висококачествени продукти.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Бързи връзки</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary-400 transition">
                  Начало
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-primary-400 transition">
                  Продукти
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-primary-400 transition">
                  Категории
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-gray-400 hover:text-primary-400 transition">
                  Количка
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Поддръжка</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary-400 transition">
                  Контакти
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-primary-400 transition">
                  Доставка
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-primary-400 transition">
                  Връщане
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-primary-400 transition">
                  Често задавани въпроси
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 AuraCase. Всички права запазени.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-primary-400 transition text-sm">
                Поверителност
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-primary-400 transition text-sm">
                Условия
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}