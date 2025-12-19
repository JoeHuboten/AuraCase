'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiPackage, 
  FiGrid, 
  FiShoppingBag, 
  FiUsers, 
  FiSettings,
  FiTrendingUp,
  FiLogOut,
  FiMail,
  FiPercent,
  FiSend
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: FiHome },
  { name: 'Products', href: '/admin/products', icon: FiPackage },
  { name: 'Categories', href: '/admin/categories', icon: FiGrid },
  { name: 'Orders', href: '/admin/orders', icon: FiShoppingBag },
  { name: 'Users', href: '/admin/users', icon: FiUsers },
  { name: 'Messages', href: '/admin/messages', icon: FiMail },
  { name: 'Newsletter', href: '/admin/newsletter', icon: FiSend },
  { name: 'Discount Codes', href: '/admin/discount-codes', icon: FiPercent },
  { name: 'Analytics', href: '/admin/analytics', icon: FiTrendingUp },
  { name: 'Settings', href: '/admin/settings', icon: FiSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-background-secondary border-r border-gray-800">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-gray-800">
          <Link href="/admin" className="text-xl font-bold text-white">
            AURACASE ADMIN
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-text-secondary hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Back to Site */}
        <div className="p-4 border-t border-gray-800">
          <Link
            href="/"
            className="flex items-center px-4 py-3 text-sm font-medium text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg transition"
          >
            <FiLogOut className="mr-3 h-5 w-5" />
            Back to Site
          </Link>
        </div>
      </div>
    </div>
  );
}
