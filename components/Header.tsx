'use client';

import Link from 'next/link';
import { FiSearch, FiShoppingCart, FiMenu, FiX, FiHeart, FiUser } from 'react-icons/fi';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSearchStore } from '@/store/searchStore';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import AdvancedSearch from './AdvancedSearch';
import LanguageSwitcher from './LanguageSwitcher';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  oldPrice: number | null;
  discount: number | null;
  image: string;
  images: string;
  categoryId: string;
  colors: string;
  sizes: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
  specifications: any;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
  };
}

const Header = () => {
  const cartItems = useCartStore((state) => state.items);
  const wishlistItems = useWishlistStore((state) => state.items);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { addToHistory } = useSearchStore();
  const { t } = useLanguage();

  // Fix hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const cartItemsCount = mounted ? cartItems.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const wishlistItemsCount = mounted ? wishlistItems.length : 0;

  // Server-side search with debounce
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery.trim())}&limit=5`);
        if (response.ok) {
          const data = await response.json();
          setSearchSuggestions(data.products || []);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (query: string, filters?: any) => {
    if (query.trim()) {
      addToHistory(query.trim());
      const searchParams = new URLSearchParams();
      searchParams.set('search', query.trim());
      
      if (filters) {
        if (filters.category && filters.category !== 'all') {
          searchParams.set('category', filters.category);
        }
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
          searchParams.set('minPrice', filters.priceRange[0].toString());
          searchParams.set('maxPrice', filters.priceRange[1].toString());
        }
        if (filters.rating > 0) {
          searchParams.set('rating', filters.rating.toString());
        }
        if (filters.inStock) {
          searchParams.set('inStock', 'true');
        }
        if (filters.featured) {
          searchParams.set('featured', 'true');
        }
      }
      
      router.push(`/shop?${searchParams.toString()}`);
      setSearchQuery('');
      setShowSuggestions(false);
    }
  };

  return (
    <>
      {/* Main Header */}
      <header className="bg-primary/95 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50 shadow-lg shadow-black/20">
        <div className="container-custom py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-white flex-shrink-0 tracking-tight hover:text-accent transition-colors duration-300">
              <span className="bg-gradient-to-r from-white via-white to-accent-light bg-clip-text text-transparent">AURA</span>
              <span className="text-accent">CASE</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-10 mx-10">
              <Link href="/" className="relative text-text-secondary hover:text-white transition-colors duration-300 font-medium text-sm group">
                {t('nav.home', 'Home')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-accent-light group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/shop" className="relative text-text-secondary hover:text-white transition-colors duration-300 font-medium text-sm group">
                {t('nav.shop', 'Shop')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-accent-light group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/about" className="relative text-text-secondary hover:text-white transition-colors duration-300 font-medium text-sm group">
                {t('nav.about', 'About')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-accent-light group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/contact" className="relative text-text-secondary hover:text-white transition-colors duration-300 font-medium text-sm group">
                {t('nav.contact', 'Contact')}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-accent-light group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex items-center flex-1 max-w-sm mx-6">
              <div className="relative w-full group">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-accent transition-colors duration-300" size={18} />
                <input
                  type="text"
                  placeholder={t('search.placeholder', 'Search products...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  onFocus={() => setShowSuggestions(searchQuery.trim().length > 1)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="w-full bg-white/5 backdrop-blur-sm text-white pl-11 pr-10 py-2.5 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/40 focus:bg-white/8 transition-all duration-300 placeholder:text-white/40"
                  suppressHydrationWarning
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                  >
                    <FiX size={14} />
                  </button>
                )}

                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-primary/98 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 z-50 max-h-96 overflow-y-auto overflow-x-hidden">
                    <div className="p-3">
                      <div className="text-xs text-text-secondary/70 mb-2 px-2 uppercase tracking-wider font-medium">Suggestions</div>
                      {searchSuggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            router.push(`/product/${product.slug}`);
                            setSearchQuery('');
                            setShowSuggestions(false);
                          }}
                          className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-200 text-left group border border-transparent hover:border-white/5"
                        >
                          <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium group-hover:text-accent transition-colors truncate text-sm">
                              {product.name}
                            </div>
                            <div className="text-text-secondary text-xs mt-0.5 flex items-center gap-2">
                              <span className="text-accent font-semibold">${product.price.toFixed(2)}</span>
                              <span className="text-text-secondary/50">•</span>
                              <span>{product.category.name}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                      <div className="border-t border-white/5 mt-3 pt-3">
                        <button
                          onClick={() => handleSearch(searchQuery)}
                          className="w-full text-center text-accent hover:text-accent-light transition-colors py-2.5 text-sm font-medium rounded-xl hover:bg-accent/10"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-2">
              <LanguageSwitcher />
              <button 
                onClick={() => setIsAdvancedSearchOpen(true)}
                className="p-2.5 text-text-secondary hover:text-accent hover:bg-white/5 rounded-xl transition-all duration-300"
                title="Търсене"
              >
                <FiSearch size={20} />
              </button>
              <Link href="/account" className="p-2.5 text-text-secondary hover:text-accent hover:bg-white/5 rounded-xl transition-all duration-300" title="Account">
                <FiUser size={20} />
              </Link>
              <Link href="/cart" className="relative p-2.5 text-text-secondary hover:text-accent hover:bg-white/5 rounded-xl transition-all duration-300">
                <FiShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-accent to-accent-dark text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-accent/30 ring-2 ring-primary">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
              <Link href="/wishlist" className="relative p-2.5 text-text-secondary hover:text-red-400 hover:bg-white/5 rounded-xl transition-all duration-300">
                <FiHeart size={20} />
                {wishlistItemsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-red-500/30 ring-2 ring-primary">
                    {wishlistItemsCount}
                  </span>
                )}
              </Link>
              <button
                className="p-2.5 md:hidden text-text-secondary hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-primary-light/95 backdrop-blur-xl border-t border-white/5">
            <nav className="container-custom py-6 flex flex-col space-y-1">
              <Link
                href="/"
                className="text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-300 font-medium px-4 py-3 rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.home', 'Home')}
              </Link>
              <Link
                href="/shop"
                className="text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-300 font-medium px-4 py-3 rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.shop', 'Shop')}
              </Link>
              <Link
                href="/about"
                className="text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-300 font-medium px-4 py-3 rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.about', 'About')}
              </Link>
              <Link
                href="/contact"
                className="text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-300 font-medium px-4 py-3 rounded-xl"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.contact', 'Contact')}
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Advanced Search Modal */}
      <AdvancedSearch
        isOpen={isAdvancedSearchOpen}
        onClose={() => setIsAdvancedSearchOpen(false)}
        onSearch={handleSearch}
      />
    </>
  );
};

export default Header;

