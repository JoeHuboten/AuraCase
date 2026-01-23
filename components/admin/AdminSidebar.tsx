'use client';

import { useState, useEffect } from 'react';
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
  FiSend,
  FiMenu,
  FiX
} from 'react-icons/fi';

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
  const [isOpen, setIsOpen] = useState(false);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background-secondary border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="text-lg font-bold text-white">
          JC Admin
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-white hover:bg-gray-800 rounded-lg transition"
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-background-secondary border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo - Hidden on mobile (shown in header) */}
          <div className="hidden lg:flex items-center justify-center h-16 border-b border-gray-800">
            <Link href="/admin" className="text-xl font-bold text-white">
              Just Cases ADMIN
            </Link>
          </div>

          {/* Mobile spacer */}
          <div className="lg:hidden h-14" />

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-text-secondary hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Back to Site */}
          <div className="p-3 border-t border-gray-800">
            <Link
              href="/"
              className="flex items-center px-3 py-2.5 text-sm font-medium text-text-secondary hover:text-white hover:bg-gray-800 rounded-lg transition"
            >
              <FiLogOut className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="truncate">Back to Site</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
